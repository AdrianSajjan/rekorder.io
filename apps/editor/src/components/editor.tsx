import { CaretRight, CloudArrowUp, Crop, Download, MusicNotes, Panorama, Scissors, Spinner } from '@phosphor-icons/react';
import { animate, Brand } from '@rekorder.io/ui';
import { cn } from '@rekorder.io/utils';
import { observer } from 'mobx-react';

const OfflineEditor = observer(() => {
  return (
    <section className="h-screen w-screen bg-background-light flex">
      <aside className="h-screen overflow-auto w-96 shrink-0 bg-card-background border-r border-borders-input flex flex-col px-5">
        <div className="h-16 flex flex-col items-start justify-center">
          <Brand mode="expanded" height={30} className="w-fit" />
        </div>
        <div className="flex flex-col gap-8 mt-6">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold">Export</label>
            <SidebarAction icon={<CloudArrowUp weight="bold" />} title="Upload to cloud" description="Get access to premium features" />
            <SidebarAction icon={<Download weight="bold" />} title="Export as MP4" description="Download your video in .mp4 format" />
            <SidebarAction icon={<Download weight="bold" />} title="Export as WEBM" description="Download your video in .webm format" />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold">Edit</label>
            <SidebarAction icon={<Scissors weight="bold" />} title="Trim" description="Trim and cut your video" />
            <SidebarAction icon={<Crop weight="bold" />} title="Crop" description="Crop and resize your video" />
            <SidebarAction icon={<MusicNotes weight="bold" />} title="Audio" description="Add or modify the background audio" />
            <SidebarAction icon={<Panorama weight="bold" />} title="Backgrounds" description="Add a background behind your video" />
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-card-background shrink-0 border-b border-borders-input"></header>
        <section className="flex-1"></section>
        <footer className="h-48 bg-card-background shrink-0 border-t border-borders-input"></footer>
      </main>
    </section>
  );
});

interface SidebarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  loading?: boolean;
  description: string;
  icon: React.ReactNode;
}

function SidebarAction({ icon, title, description, loading, className, disabled, ...props }: SidebarActionProps) {
  const style = { animation: animate.spin };

  return (
    <button
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
      <span className="ml-auto">{loading ? <Spinner weight="bold" style={style} /> : <CaretRight size={14} weight="bold" />}</span>
    </button>
  );
}

export { OfflineEditor };
