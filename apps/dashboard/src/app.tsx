import { MagnifyingGlass, VideoCamera } from '@phosphor-icons/react';
import { Lightning } from '@phosphor-icons/react/dist/ssr';
import { AnimationsProvider, Button, SegmentedControl } from '@rekorder.io/ui';
import { Sidebar } from './components/layout/sidebar';

export function App() {
  return (
    <AnimationsProvider>
      <section className="h-full w-full flex bg-card-background">
        <Sidebar />
        <section className="flex flex-col flex-1 px-2.5">
          <header className="w-full pt-2.5 sticky top-0">
            <div className="container w-full max-w-screen-xl mx-auto h-16 flex items-center justify-start">
              <Button variant="outline" color="accent" size="medium" className="flex-1 font-normal !text-text-muted !justify-start !text-left !gap-3 !pl-3">
                <MagnifyingGlass size={20} />
                <span>Search for videos or stuffs</span>
                <span className="text-muted-foreground ml-auto">⌘K</span>
              </Button>
              <Button variant="fancy" className="shrink-0 !ml-8 !mr-4">
                <Lightning size={16} weight="fill" />
                <span>Upgrade plan</span>
              </Button>
              <Button variant="outline" color="accent" size="icon">
                ?
              </Button>
            </div>
          </header>
          <main className="w-full pb-2.5">
            <div className="container w-full max-w-screen-xl mx-auto h-full">
              <div className="flex items-center w-full pt-10 gap-5">
                <h3 className="text-2xl font-semibold ">My Library</h3>
                <Button variant="fancy" className="shrink-0 !ml-auto">
                  <VideoCamera size={18} weight="fill" />
                  <span>Record a new video</span>
                </Button>
              </div>
              <SegmentedControl size="small" className="w-full pt-4">
                <SegmentedControl.List className="max-w-96">
                  <SegmentedControl.Trigger value="videos">Videos</SegmentedControl.Trigger>
                  <SegmentedControl.Trigger value="folders">Folders</SegmentedControl.Trigger>
                  <SegmentedControl.Trigger value="archived">Archived</SegmentedControl.Trigger>
                </SegmentedControl.List>
              </SegmentedControl>
            </div>
          </main>
        </section>
      </section>
    </AnimationsProvider>
  );
}
