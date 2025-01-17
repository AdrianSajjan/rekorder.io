import * as Dialog from '@radix-ui/react-dialog';
import { CloudArrowUp, X } from '@phosphor-icons/react';
import { Button } from '@rekorder.io/ui';
import { cn } from '@rekorder.io/utils';

const steps = [
  {
    title: 'Upload video to cloud',
    description: 'The video will be uploaded to the cloud, a copy will be kept in the local editor for offline usage',
  },
  {
    title: 'Subscribe to our plans',
    description: 'The local editor will always remain free, premium cloud features are offered at affordable plans including a free tier',
  },
  {
    title: 'Get access to premium features',
    description: 'Unlock the power AI avatars, AI voices, Custom backgrounds, Sharing & Analytics and other premium features',
  },
];

export function PremiumFeatureDialog({ children, ...props }: Dialog.DialogProps) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        >
          <Dialog.Content
            className={cn(
              'relative w-full max-w-md rounded-2xl bg-card-background shadow-sm focus:outline-none px-8 py-7',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            )}
          >
            <Dialog.Close asChild>
              <Button size="icon" variant="ghost" color="accent" className="absolute top-2 right-2">
                <X weight="bold" />
              </Button>
            </Dialog.Close>
            <header className="space-y-1">
              <Dialog.Title className="capitalize text-lg font-semibold">Cloud only access</Dialog.Title>
              <Dialog.Description className="text-sm font-normal text-accent-dark/80">
                This feature is available only on cloud editor. Upload your video to our cloud dashboard to access this feature.
              </Dialog.Description>
            </header>
            <article className="mt-8 space-y-8">
              {steps.map(({ title, description }, index) => {
                return (
                  <div className="relative" key={index}>
                    <div className="flex items-start gap-4">
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
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
