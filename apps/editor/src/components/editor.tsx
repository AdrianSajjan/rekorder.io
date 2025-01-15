import { observer } from 'mobx-react';
import { forwardRef } from 'react';

import { CaretRight, CloudArrowUp, Crop, Download, MagnifyingGlassPlus, MusicNotes, Panorama, Scissors, ShareFat, Spinner, X } from '@phosphor-icons/react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogProps,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';

import { animate, Brand, Button, CrownIcon, VideoPlayer } from '@rekorder.io/ui';
import { cn } from '@rekorder.io/utils';

import { editor } from '../store/editor';

const steps = [
  {
    title: 'Upload video to cloud',
    description: 'The video will be uploaded to the cloud, a copy will be kept in the local editor for offline usage',
  },
  {
    title: 'Subscribe to our plans',
    description: 'The local editor will always remain free of cost, premium cloud features are offered at affordable rates and plans',
  },
  {
    title: 'Get access to premium features',
    description: 'Unlock the power AI avatars, AI voices, Custom backgrounds, Sharing & Analytics and other premium features',
  },
];

const spin = {
  animation: animate.spin,
};

const OfflineEditor = observer(() => {
  return (
    <div className="h-screen w-screen bg-background-light flex">
      <aside className="h-screen overflow-auto w-96 shrink-0 bg-card-background border-r border-borders-input flex flex-col px-5">
        <div className="h-16 flex flex-col items-start justify-center shrink-0">
          <Brand mode="expanded" height={30} className="w-fit" />
        </div>
        <div className="flex flex-col gap-8 py-6 shrink-0">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold">Export</label>
            <SidebarAction icon={<CloudArrowUp weight="bold" />} title="Upload to cloud" description="Get access to premium features" />
            <SidebarAction icon={<Download weight="bold" />} title="Export as MP4" description="Download your video in .mp4 format" />
            <SidebarAction icon={<Download weight="bold" />} title="Export as WEBM" description="Download your video in .webm format" />
            <PremiumFeatureDialog>
              <SidebarAction premium icon={<ShareFat weight="fill" />} title="Share video" description="Share the link of this video with others" />
            </PremiumFeatureDialog>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold">Edit</label>
            <SidebarAction icon={<Scissors weight="bold" />} title="Trim" description="Trim and cut your video" />
            <SidebarAction icon={<Crop weight="bold" />} title="Crop" description="Crop and resize your video" />
            <SidebarAction icon={<MusicNotes weight="bold" />} title="Audio" description="Add or modify the background audio" />
            <PremiumFeatureDialog>
              <SidebarAction premium icon={<Panorama weight="bold" />} title="Backgrounds" description="Add a background behind your video" />
            </PremiumFeatureDialog>
            <PremiumFeatureDialog>
              <SidebarAction premium icon={<MagnifyingGlassPlus weight="bold" />} title="Zoom to point" description="Add a zoom to highlight stuffs" />
            </PremiumFeatureDialog>
          </div>
        </div>
      </aside>
      <section className="flex-1 flex flex-col">
        <header className="h-16 bg-card-background shrink-0 border-b border-borders-input flex items-center justify-center">
          {editor.blobURL ? (
            <input value={editor.name} onChange={(event) => editor.updateName(event.target.value)} className="text-center text-sm w-96" />
          ) : null}
        </header>
        <main className="flex-1 grid place-items-center p-10">
          <div className="h-auto w-full max-w-4xl relative">
            {editor.blobURL ? (
              <VideoPlayer src={editor.blobURL} container="h-auto! w-full! max-w-4xl!" className="h-auto! w-full! max-w-4xl!" />
            ) : (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Spinner size={32} weight="bold" color="black" className="mx-auto" style={spin} />
                <p className="font-medium text-sm text-black mt-2">Processing the recorded video...</p>
              </span>
            )}
          </div>
        </main>
      </section>
    </div>
  );
});

interface SidebarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  premium?: boolean;
  loading?: boolean;
  description: string;
  icon: React.ReactNode;
}

const SidebarAction = forwardRef<HTMLButtonElement, SidebarActionProps>(
  ({ icon, title, description, loading, className, premium, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'text-start flex items-center gap-4 rounded-2xl bg-card-background border border-borders-input px-5 py-3.5 hover:bg-background-light transition-colors',
          'disabled:hover:bg-card-background disabled:cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        <span>{icon}</span>
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-semibold">{title}</h3>
          <p className="text-xs text-accent-dark/80">{description}</p>
        </div>
        <span className="ml-auto">
          {premium ? <CrownIcon className="text-xl" /> : loading ? <Spinner weight="bold" style={spin} /> : <CaretRight size={14} weight="bold" />}
        </span>
      </button>
    );
  }
);

function PremiumFeatureDialog({ children, ...props }: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay
          className={cn(
            'fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        >
          <DialogContent
            className={cn(
              'relative w-full max-w-md rounded-2xl bg-card-background shadow-sm focus:outline-none px-8 py-7',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            )}
          >
            <DialogClose asChild>
              <Button size="icon" variant="ghost" color="accent" className="absolute top-2 right-2">
                <X weight="bold" />
              </Button>
            </DialogClose>
            <header className="space-y-1">
              <DialogTitle className="capitalize text-lg font-semibold">Cloud only access</DialogTitle>
              <DialogDescription className="text-sm font-normal text-accent-dark/80">
                This feature is available only on cloud editor. Upload your video to our cloud dashboard to access this feature.
              </DialogDescription>
            </header>
            <article className="mt-8 space-y-8">
              {steps.map(({ title, description }, index) => {
                return (
                  <div className="relative">
                    <div className="flex items-start gap-4" key={index}>
                      <span className="h-2 w-2 rounded-sm bg-gradient-to-br from-primary-light to-primary-main ring ring-primary-main/20 shrink-0 translate-y-2" />
                      <div className="space-y-1">
                        <h5 className="text-sm font-medium">{title}</h5>
                        <p className="text-xs text-text-muted leading-relaxed">{description}</p>
                      </div>
                    </div>
                    {index < 2 ? <div className="absolute h-full w-px bg-accent-light left-1 top-6 my-1" /> : null}
                  </div>
                );
              })}
            </article>
            <footer className="mt-10">
              <Button className="w-full" variant="fancy">
                <CloudArrowUp weight="bold" size={18} />
                <span>Upload Video</span>
              </Button>
            </footer>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}

export { OfflineEditor };
