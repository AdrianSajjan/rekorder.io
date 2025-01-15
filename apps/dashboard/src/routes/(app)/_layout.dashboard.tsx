import { VideoCamera } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import { Button, SegmentedControl } from '@rekorder.io/ui';

import { useAuthenticatedSession } from '../../store/authentication';

export const Route = createFileRoute('/(app)/_layout/dashboard')({
  component: HomePage,
});

function HomePage() {
  const session = useAuthenticatedSession();

  return (
    <div className="container w-full max-w-screen-xl mx-auto h-full">
      <div className="flex items-center w-full pt-10 gap-5">
        <h3 className="text-2xl font-semibold ">My Library</h3>
        <Button variant="solid" className="shrink-0 !ml-auto">
          <VideoCamera size={18} weight="fill" />
          <span>Record a new video</span>
        </Button>
      </div>
      <SegmentedControl defaultValue="videos" size="small" className="w-full pt-4">
        <SegmentedControl.List className="max-w-96">
          <SegmentedControl.Trigger value="videos">Videos</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value="folders">Folders</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value="archived">Archived</SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl>
      <div className="mt-10">{JSON.stringify(session.user, null, 4)}</div>
    </div>
  );
}
