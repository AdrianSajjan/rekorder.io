import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';

import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { Brain, Lightning, MagicWand } from '@phosphor-icons/react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { supabase } from '@rekorder.io/database';
import { Button, Input, SegmentedControl, VideoPlayer } from '@rekorder.io/ui';
import { parseUploadedFilePath } from '@rekorder.io/utils';

import { ChatApiFactory } from '../../../apis/chat';
import { RecordingApiFactory } from '../../../apis/recordings';

export const Route = createFileRoute('/dashboard/recording/_layout/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const knowledge$ = useRef<HTMLInputElement>(null);

  const [isLinkCopied, setLinkCopied] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<string>('');

  const { data: recording } = useSuspenseQuery(RecordingApiFactory.Queries.FetchOne(params.id));

  const { mutate: setupSemanticSearch, isPending: isSetupSemanticSearchPending } = useMutation({
    mutationFn: (docs: string) => ChatApiFactory.Api.SetupSemanticSearch(params.id, docs),
  });

  const handleSetupSemanticSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const content = reader.result as string;
        setupSemanticSearch(content, {
          onSuccess() {
            setKnowledgeBase(content);
          },
          onError() {
            toast.error('Failed to setup semantic search');
          },
        });
      });
      reader.readAsText(file);
    } else {
      toast.error('No file selected');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href.replace('/recording/', '/shared/'));
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const source = supabase.storage.from('recordings').getPublicUrl(parseUploadedFilePath(recording.original_file)).data.publicUrl;

  return (
    <Fragment>
      <main className="w-full px-12 h-screen overflow-auto flex flex-col">
        <header className="w-full pt-2.5 sticky top-0 z-10">
          <div className="container w-full max-w-screen-xl mx-auto h-16 flex items-center justify-start">
            <div className="flex">
              <h1 className="text-base font-medium">{recording.project_name}</h1>
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
          <VideoPlayer crossOrigin="anonymous" src={source} className="!h-fit rounded-2xl" />
        </div>
      </main>
      <aside className="h-screen p-2.5 sticky top-0 bg-card-background shrink-0 w-full max-w-3xl">
        <div className="w-full h-full shrink-0 flex flex-col border bg-background-light rounded-2xl p-6 overflow-y-auto">
          <SegmentedControl defaultValue="document">
            <SegmentedControl.List className="!bg-background-main">
              <SegmentedControl.Trigger value="document">Auto Docs</SegmentedControl.Trigger>
              <SegmentedControl.Trigger value="knowledge">Knowledge Base</SegmentedControl.Trigger>
              <SegmentedControl.Trigger value="shareable">Shareable Link</SegmentedControl.Trigger>
            </SegmentedControl.List>
            <SegmentedControl.Panel value="document" className="pt-6">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-medium">Auto Docs</h3>
                <p className="text-sm text-text-dark/50">Automatically generate a readable document from the video.</p>
              </div>
              <div className="mt-6">
                {recording.document_markdown ? (
                  <div className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[RemarkGfm]}>{recording.document_markdown}</ReactMarkdown>
                  </div>
                ) : (
                  <Button disabled={isSetupSemanticSearchPending}>
                    <MagicWand size={16} weight="fill" />
                    <span>Generate Document Now</span>
                  </Button>
                )}
              </div>
            </SegmentedControl.Panel>
            <SegmentedControl.Panel value="knowledge" className="pt-6">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-medium">Knowledge Base</h3>
                <p className="text-sm text-text-dark/50">Attach a knowledge base to the video to help the AI understand the context of the video.</p>
              </div>
              <div className="mt-6">
                {knowledgeBase ? (
                  <div className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[RemarkGfm]}>{knowledgeBase}</ReactMarkdown>
                  </div>
                ) : (
                  <div>
                    <input type="file" accept=".txt" ref={knowledge$} className="hidden" onChange={handleSetupSemanticSearch} />
                    <Button onClick={() => knowledge$.current?.click()} disabled={isSetupSemanticSearchPending}>
                      <Brain size={16} weight="fill" />
                      <span>Setup Knowledge Base</span>
                    </Button>
                  </div>
                )}
              </div>
            </SegmentedControl.Panel>
            <SegmentedControl.Panel value="shareable" className="pt-6">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-medium">Shareable Link</h3>
                <p className="text-sm text-text-dark/50">Share the video with others.</p>
              </div>
              <div className="mt-6">
                <div className="flex gap-2">
                  <Input type="text" value={window.location.href.replace('/recording/', '/shared/')} readOnly className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background-main" />
                  <Button onClick={handleCopyLink} disabled={isLinkCopied} className="!w-32">
                    <span>{isLinkCopied ? 'Copied' : 'Copy Link'}</span>
                  </Button>
                </div>
              </div>
            </SegmentedControl.Panel>
          </SegmentedControl>
        </div>
      </aside>
    </Fragment>
  );
}
