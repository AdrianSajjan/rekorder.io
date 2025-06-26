import AutosizeTextarea from 'react-textarea-autosize';

import { useRef, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, MagicWand } from '@phosphor-icons/react';

import { parseUploadedFilePath } from '@rekorder.io/utils';
import { Button, VideoPlayer } from '@rekorder.io/ui';
import { supabase } from '@rekorder.io/database';

import { ChatApiFactory } from '../../../apis/chat';
import { RecordingApiFactory } from '../../../apis/recordings';
import { useAuthenticatedSession } from '../../../store/authentication';
import { UploadApiFactory } from '../../../apis/upload';
import { nanoid } from 'nanoid';

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

  const video$ = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);

  const { mutateAsync: handleFileUpload } = useMutation({
    mutationFn: async (file: File | Blob) => {
      return UploadApiFactory.Apis.UploadFile(file);
    },
  });

  const { mutateAsync: handleCreateStream } = useMutation({
    mutationFn: (prompt: string) => {
      return ChatApiFactory.Api.Chat(prompt, session.user.id);
    },
    onSuccess: (body) => {
      const reader = body.getReader();
      const decoder = new TextDecoder();
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
    const prompt = 'Help me understand what is in this video frame: ' + uploaded.url;

    setStreaming(true);
    handleCreateStream(prompt).finally(() => setStreaming(false));
  };

  return (
    <Fragment>
      <aside className="w-full max-w-2xl shrink-0 flex flex-col h-full border-l bg-card-background border-r">
        <footer className="px-6 pb-4 sticky mt-auto bottom-0 shrink-0 max-w-6xl w-full mx-auto">
          <div className="flex flex-col rounded-2xl p-3 gap-2 relative z-10 w-full bg-background-light">
            <AutosizeTextarea minRows={2} maxRows={6} placeholder="What doubts do you have?" className="w-full text-base !outline-none ring-0 bg-transparent resize-none px-2 pt-1" />
            <div className="flex items-center gap-3 px-1">
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" className="w-32" disabled={streaming} onClick={handleExplainVideoFrame}>
                  <MagicWand className="size-4" />
                  <span>Explain</span>
                </Button>
                <Button type="button" className="w-24 group" disabled={streaming}>
                  <span>Send</span>
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </aside>
      <main className="w-full p-12">
        <div className="flex flex-col items-center justify-center h-full">
          <VideoPlayer crossOrigin="anonymous" src={query.source} ref={video$} />
        </div>
      </main>
    </Fragment>
  );
}
