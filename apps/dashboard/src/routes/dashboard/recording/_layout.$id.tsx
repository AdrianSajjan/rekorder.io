import AutosizeTextarea from 'react-textarea-autosize';

import { nanoid } from 'nanoid';
import { useCallback, useRef, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, MagicWand } from '@phosphor-icons/react';

import { parseUploadedFilePath } from '@rekorder.io/utils';
import { Button, VideoPlayer } from '@rekorder.io/ui';
import { supabase } from '@rekorder.io/database';

import { ChatApiFactory } from '../../../apis/chat';
import { UploadApiFactory } from '../../../apis/upload';
import { RecordingApiFactory } from '../../../apis/recordings';

import { checkAgentStreamStatus } from '../../../libs/stream-helper';
import { useAuthenticatedSession } from '../../../store/authentication';

interface ChatMessage {
  id: string;
  message: string;
}

export const Route = createFileRoute('/dashboard/recording/_layout/$id')({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData(RecordingApiFactory.Queries.FetchOne(params.id));
    if (!data) throw new Error('Recording not found');

    const signed = await supabase.storage.from('recordings').createSignedUrl(parseUploadedFilePath(data.original_file), 60 * 60);
    if (!signed.data) throw new Error('Failed to get signed url');

    return {
      recording: data,
      source: signed.data?.signedUrl,
    };
  },
});

function RouteComponent() {
  const query = Route.useLoaderData();
  const session = useAuthenticatedSession();

  const chat$ = useRef<ChatMessage[]>([]);
  const video$ = useRef<HTMLVideoElement>(null);

  const [prompt, setPrompt] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);

  const { mutateAsync: handleFileUpload } = useMutation({
    mutationFn: async (file: File | Blob) => {
      return UploadApiFactory.Apis.UploadFile(file);
    },
  });

  const handleCleanupStreamState = useCallback((state: ChatMessage[], id: string) => {
    return state.map((message) => {
      if (message.id === id) {
        return { ...message, message: message.message || '&#8203;' };
      }
      return message;
    });
  }, []);

  const handleStreamErrorState = useCallback((state: ChatMessage[], id: string) => {
    return state.map((message) => {
      if (message.id === id) {
        return { ...message, message: 'Oops! Something went wrong. Please try again.' };
      }
      return message;
    });
  }, []);

  const handleStreamCleanup = useCallback(
    (id: string) => {
      setStreaming(false);
      setChat((state) => handleCleanupStreamState(state, id));
      chat$.current = handleCleanupStreamState(chat$.current, id);
    },
    [handleCleanupStreamState]
  );

  const handleStreamResponse = useCallback((state: ChatMessage[], id: string, content: string) => {
    return state.map((message) => {
      if (message.id === id) {
        return { ...message, message: message.message + content };
      }
      return message;
    });
  }, []);

  const { mutateAsync: handleCreateStream } = useMutation({
    mutationFn: ({ prompt }: { prompt: string; id: string }) => {
      return ChatApiFactory.Api.Chat(prompt, session.user.id);
    },
    onSuccess: async (body, { id }) => {
      let buffer = '';
      const reader = body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        try {
          const result = await reader.read();

          if (result.done) {
            console.log('Stream completed, cleaning up!');
            handleStreamCleanup(id);
            break;
          }

          buffer += decoder.decode(result.value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const raw of lines) {
            const line = raw.trim();
            if (!line.startsWith('data:')) continue;
            const content = line.replace(/^data:\s*/, '');

            try {
              if (!checkAgentStreamStatus(content)) {
                console.log('Received sentinel, aborting stream!');
                handleStreamCleanup(id);
                break;
              }

              setChat((state) => handleStreamResponse(state, id, content));
              chat$.current = handleStreamResponse(chat$.current, id, content);
            } catch (error) {
              console.log('=== error parsing payload ===');
              console.log({ error, line });
            }
          }
        } catch (error) {
          console.log('=== error decoding response ===');
          console.log(error);
        }
      }
    },
    onError: (error, { id }) => {
      setStreaming(false);
      setChat((state) => handleStreamErrorState(state, id));
      chat$.current = handleStreamErrorState(chat$.current, id);
      console.log('~error creating stream~', error);
    },
  });

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
          const file = new File([blob], nanoid() + '.png', { type: 'image/png' });
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
    const prompt = 'Help me understand what is in this video frame: ' + uploaded.url;

    setChat((state) => [...state, { id, message: '' }]);
    chat$.current = [...chat$.current, { id, message: '' }];

    setStreaming(true);
    handleCreateStream({ prompt, id }).finally(() => setStreaming(false));
  };

  const handleSendPrompt = () => {
    const id = nanoid();

    setPrompt('');
    setChat((state) => [...state, { id, message: '' }]);
    chat$.current = [...chat$.current, { id, message: '' }];

    setStreaming(true);
    handleCreateStream({ prompt, id }).finally(() => setStreaming(false));
  };

  return (
    <Fragment>
      <aside className="w-full max-w-xl shrink-0 flex flex-col h-full border-l bg-card-background border-r">
        <div className="flex flex-col gap-2 p-4 h-full overflow-y-auto">
          {chat.map((message) => (
            <div key={message.id}>{message.message || 'Thinking...'}</div>
          ))}
        </div>
        <footer className="px-6 pb-4 sticky mt-auto bottom-0 shrink-0 max-w-6xl w-full mx-auto">
          <div className="flex flex-col rounded-2xl p-3 gap-2 relative z-10 w-full bg-background-light border">
            <AutosizeTextarea
              minRows={3}
              maxRows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What queries about this video can I help you with?"
              className="w-full text-base !outline-none ring-0 bg-transparent placeholder:text-text-dark/50 resize-none px-2 pt-1"
            />
            <div className="flex items-center gap-3 px-1">
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" className="w-44" disabled={streaming} onClick={handleExplainVideoFrame}>
                  <MagicWand weight="fill" className="size-4 shrink-0" />
                  <span>Explain Frame</span>
                </Button>
                <Button type="button" className="w-28 group" disabled={streaming} onClick={handleSendPrompt}>
                  <span>Send</span>
                  <ArrowRight weight="bold" className="size-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </aside>
      <main className="w-full p-12">
        <div className="flex flex-col items-center justify-center h-full">
          <VideoPlayer crossOrigin="anonymous" src={query.source} ref={video$} className="!h-fit" />
        </div>
      </main>
    </Fragment>
  );
}
