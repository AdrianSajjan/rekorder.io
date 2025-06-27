import AutosizeTextarea from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import EasySpeech from 'easy-speech';

import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Lightning, MagicWand } from '@phosphor-icons/react';

import { parseUploadedFilePath } from '@rekorder.io/utils';
import { Button, Label, Switch, VideoPlayer } from '@rekorder.io/ui';
import { supabase } from '@rekorder.io/database';

import { ChatApiFactory } from '../../../apis/chat';
import { UploadApiFactory } from '../../../apis/upload';
import { RecordingApiFactory } from '../../../apis/recordings';
import { useAuthenticatedSession } from '../../../store/authentication';

interface IChatMessage {
  id: string;
  message: string;
  type: 'user' | 'agent';
}

export const Route = createFileRoute('/dashboard/shared/_layout/$id')({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData(RecordingApiFactory.Queries.FetchOne(params.id));
    if (!data) throw new Error('Recording not found');
    return data;
  },
});

function RouteComponent() {
  const query = Route.useLoaderData();
  const session = useAuthenticatedSession();

  const chat$ = useRef<IChatMessage[]>([]);
  const bottom$ = useRef<HTMLDivElement>(null);
  const video$ = useRef<HTMLVideoElement>(null);

  const [prompt, setPrompt] = useState('');
  const [chat, setChat] = useState<IChatMessage[]>([]);

  const [dictate, setDictate] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const [speaking, setSpeaking] = useState(false);
  const [isSpeechInitialized, setSpeechInitialized] = useState(false);

  useEffect(() => {
    const detection = EasySpeech.detect();
    if (detection.speechSynthesis) {
      EasySpeech.init({ maxTimeout: 5000, interval: 250 }).then(() => {
        setSpeechInitialized(true);
      });
    }
    return () => {
      if (isSpeechInitialized) {
        EasySpeech.cancel();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDictate = useCallback(
    async (text: string) => {
      if (!isSpeechInitialized || !dictate || !text) return;

      try {
        const cleanText = text
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/`(.*?)`/g, '$1')
          .replace(/\[(.*?)\]\(.*?\)/g, '$1')
          .replace(/#{1,6}\s/g, '')
          .replace(/\n/g, ' ')
          .trim();

        if (cleanText) {
          setSpeaking(true);
          const voice = EasySpeech.voices().find((voice) => voice.name.toLowerCase().includes('aaron'));

          await EasySpeech.speak({
            text: cleanText,
            pitch: 1,
            rate: 0.9,
            voice: voice,
            volume: 1,
            start: () => {
              setSpeaking(true);
            },
            end: () => {
              setSpeaking(false);
            },
            error: () => {
              setSpeaking(false);
            },
          });
        }
      } catch (error) {
        console.error('Failed to speak text:', error);
        setSpeaking(false);
      }
    },
    [isSpeechInitialized, dictate]
  );

  const { mutateAsync: handleFileUpload, isPending: isFileUploadPending } = useMutation({
    mutationFn: async (file: File | Blob) => {
      return UploadApiFactory.Apis.UploadFile(session.user, file);
    },
  });

  const handleStreamErrorState = useCallback((state: IChatMessage[], id: string) => {
    return state.map((message) => {
      if (message.id === id) {
        return {
          ...message,
          message: 'Oops! Something went wrong. Please try again.',
        };
      }
      return message;
    });
  }, []);

  const handleStreamResponse = useCallback((state: IChatMessage[], id: string, content: string) => {
    return state.map((message) => {
      if (message.id === id) {
        return { ...message, message: message.message + content || '&#8203;' };
      }
      return message;
    });
  }, []);

  const { mutateAsync: handleCreateStream } = useMutation({
    mutationFn: ({ prompt }: { prompt: string; id: string }) => {
      return ChatApiFactory.Api.Chat(prompt, session.user.id);
    },
    onSuccess: async (response, { id }) => {
      const updatedState = handleStreamResponse(chat, id, response.message);
      const updatedRef = handleStreamResponse(chat$.current, id, response.message);

      setChat(updatedState);
      chat$.current = updatedRef;

      if (dictate && response.message) {
        await handleDictate(response.message);
      }
    },
    onError: (error, { id }) => {
      setStreaming(false);
      setChat((state) => handleStreamErrorState(state, id));
      chat$.current = handleStreamErrorState(chat$.current, id);
      console.log('~error creating stream~', error);
    },
    onSettled: () => {
      if (bottom$.current) {
        bottom$.current.scrollIntoView({ behavior: 'smooth' });
      }
    },
  });

  useEffect(() => {
    if (bottom$.current) {
      bottom$.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  const handleCaptureCurrentFrame = () => {
    const video = video$.current!;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], nanoid() + '.png', {
            type: 'image/png',
          });
          resolve(file);
        } else {
          reject('Failed to capture current frame');
        }
      }, 'image/png');
    });
  };

  const handleExplainVideoFrame = async () => {
    const blob = await handleCaptureCurrentFrame();
    const uploaded = await handleFileUpload(blob);

    const id = nanoid();
    const url = supabase.storage.from('frames').getPublicUrl(parseUploadedFilePath(uploaded.fullPath));
    const prompt = 'Help me understand what is in this video frame: ' + url.data.publicUrl;

    setChat((state) => [...state, { id: nanoid(), message: 'Help me understand what is in this frame', type: 'user' }, { id, message: '', type: 'agent' }]);
    chat$.current = [...chat$.current, { id: nanoid(), message: 'Help me understand what is in this frame', type: 'user' }, { id, message: '', type: 'agent' }];

    setStreaming(true);
    handleCreateStream({ prompt, id }).finally(() => setStreaming(false));
  };

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;
    const id = nanoid();

    setPrompt('');
    setChat((state) => [...state, { id: nanoid(), message: prompt, type: 'user' }, { id, message: '', type: 'agent' }]);
    chat$.current = [...chat$.current, { id: nanoid(), message: prompt, type: 'user' }, { id, message: '', type: 'agent' }];

    setStreaming(true);
    handleCreateStream({ prompt, id }).finally(() => setStreaming(false));
  };

  const disabled = streaming || isFileUploadPending || speaking;
  const source = supabase.storage.from('recordings').getPublicUrl(parseUploadedFilePath(query.original_file)).data.publicUrl;

  return (
    <Fragment>
      <main className="w-full px-12 h-screen overflow-auto flex flex-col">
        <header className="w-full pt-2.5 sticky top-0 z-10">
          <div className="container w-full max-w-screen-xl mx-auto h-16 flex items-center justify-start">
            <div className="flex">
              <h1 className="text-base font-medium">{query.project_name}</h1>
            </div>
            <div className="ml-auto flex">
              <Button variant="light" className="shrink-0 !ml-8 !mr-4" onClick={() => supabase.auth.signOut()}>
                <Lightning size={16} weight="fill" />
                <span>Upgrade plan</span>
              </Button>
              <Button variant="outline" color="accent" size="icon">
                ?
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center flex-1 shrink-0">
          <VideoPlayer crossOrigin="anonymous" src={source} ref={video$} className="!h-fit !rounded-2xl" />
        </div>
      </main>
      <aside className="h-screen p-2.5 sticky top-0 bg-card-background shrink-0 w-full max-w-xl">
        <div className="w-full h-full shrink-0 flex flex-col border bg-background-light rounded-2xl">
          <div className="flex flex-col gap-6 pt-6 px-6 h-full overflow-y-auto">
            {chat.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={bottom$} className="h-4 w-full opacity-0" />
          </div>
          <footer className="p-4 sticky mt-auto bottom-0 shrink-0 max-w-6xl w-full mx-auto">
            <div className="flex flex-col rounded-xl p-3 gap-2 relative z-10 w-full bg-card-background border">
              <AutosizeTextarea
                minRows={2}
                maxRows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What queries about this video can I help you with?"
                className="w-full text-base !outline-none ring-0 bg-transparent placeholder:text-text-dark/50 resize-none px-2 pt-1"
              />
              <div className="flex items-center gap-3 px-1">
                <div className="flex items-center gap-2">
                  {isSpeechInitialized ? (
                    speaking ? (
                      <Button variant="outline" color="error" onClick={() => EasySpeech.cancel()}>
                        Stop Dictation
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Switch id="dictate" checked={dictate} onCheckedChange={setDictate} />
                        <Label htmlFor="dictate">Dictate</Label>
                      </div>
                    )
                  ) : null}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="outline" className="w-44" disabled={disabled} onClick={handleExplainVideoFrame}>
                    <MagicWand weight="fill" className="size-4 shrink-0" />
                    <span>Explain Frame</span>
                  </Button>
                  <Button type="button" className="w-28 group" disabled={disabled} onClick={handleSendPrompt}>
                    <span>Send</span>
                    <ArrowRight weight="bold" className="size-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </Button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </aside>
    </Fragment>
  );
}

function ChatMessage({ message }: { message: IChatMessage }) {
  switch (message.type) {
    case 'user':
      return (
        <div className="ml-auto w-fit max-w-xs flex flex-col gap-1">
          <p className="text-sm text-text-dark/50 ml-auto">You</p>
          <div className="text-sm bg-card-background rounded-lg py-3 px-5">{message.message}</div>
        </div>
      );

    case 'agent':
      return (
        <div className="flex flex-col gap-1.5">
          <p className="text-sm text-text-dark/50">Assistant</p>
          <div className="prose prose-sm">
            <ReactMarkdown remarkPlugins={[RemarkGfm]}>{message.message || 'Thinking...'}</ReactMarkdown>
          </div>
        </div>
      );
  }
}
