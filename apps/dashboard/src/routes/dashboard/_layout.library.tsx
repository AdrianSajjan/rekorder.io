import { Clock, VideoCamera } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';

import { Button } from '@rekorder.io/ui';
import { supabase, Tables } from '@rekorder.io/database';
import { parseUploadedFilePath } from '@rekorder.io/utils';

import { RouterContext } from '../../types/common';
import { Heading } from '../../components/layout/heading';

export const Route = createFileRoute('/dashboard/_layout/library')({
  loader: (props) => {
    const context = props.context as RouterContext;
    return context.queryClient.ensureQueryData({
      queryKey: ['recordings'],
      queryFn: async () => {
        const recordings = await supabase.from('recordings').select('*').throwOnError();
        return recordings.data || [];
      },
    });
  },
  component: LibraryPage,
});

function LibraryPage() {
  const { data } = useSuspenseQuery({
    queryKey: ['recordings'],
    queryFn: async () => {
      const recordings = await supabase.from('recordings').select('*').throwOnError();
      return recordings.data || [];
    },
  });

  return (
    <div className="container @container w-full max-w-screen-xl mx-auto h-full pt-10">
      <Heading title="My Library" description="Manage and edit your recordings and videos" className="items-end">
        <Button variant="solid" className="shrink-0 !ml-auto">
          <VideoCamera size={18} weight="fill" />
          <span>Record a new video</span>
        </Button>
      </Heading>
      <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4 gap-6 mt-8">
        {data.map((recording) => (
          <RecordingCard key={recording.id} recording={recording} />
        ))}
      </div>
    </div>
  );
}

function RecordingCard({ recording }: { recording: Tables<'recordings'> }) {
  const thumbnail = recording.original_thumbnail ? supabase.storage.from('thumbnails').getPublicUrl(parseUploadedFilePath(recording.original_thumbnail)) : null;

  return (
    <div className="group relative bg-card-background rounded-xl overflow-hidden border border-borders-input transition-all duration-200 hover:shadow-xl hover:shadow-gray-100/35">
      <div className="aspect-video bg-primary-light/5 relative border-b border-primary-light/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <VideoCamera size={36} weight="fill" className="text-primary-main" />
        </div>
        {thumbnail ? <img src={thumbnail.data.publicUrl} alt={recording.project_name} className="w-full h-full object-cover relative z-10" /> : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-card-text text-sm truncate">{recording.project_name}</h3>
        </div>
        <div className="flex items-center mt-1.5 text-xs text-text-muted">
          <Clock size={14} className="mr-1 text-text-muted" />
          <span>{format(new Date(recording.created_at), 'MMM d, yyyy')}</span>
          {recording.modified_file ? <span className="ml-3 px-2 py-0.5 text-xs rounded-full bg-primary-light text-primary-main">Edited</span> : null}
        </div>
      </div>
    </div>
  );
}
