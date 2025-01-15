import { toast } from 'sonner';
import { CaretRight, CloudArrowUp, Crop, Download, MagnifyingGlassPlus, MusicNotes, Panorama, Scissors, ShareFat, Spinner } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { forwardRef } from 'react';

import { supabase } from '@rekorder.io/database';
import { StorageResponse } from '@rekorder.io/types';
import { animate, Brand, CrownIcon } from '@rekorder.io/ui';
import { cn, createFilePath, unwrapError } from '@rekorder.io/utils';

import { editor } from '../../store/editor';
import { useAuthenticatedSession } from '../../context/authentication';
import { PremiumFeatureDialog } from '../modal/premium-feature';

export function Sidebar() {
  const { user } = useAuthenticatedSession();

  const handleCloudUpload = useMutation({
    mutationFn: async () => {
      if (!editor.video) throw new Error('Unable to retrieve video file from storage');
      const response = {} as { original: StorageResponse; modified?: StorageResponse };

      if (editor.video.original_blob) {
        const { data, error } = await supabase.storage.from('recordings').upload(createFilePath(user, editor.video.original_blob), editor.video.original_blob);
        if (error) throw error;
        response.original = data;
      }

      if (editor.video.modified_blob) {
        const { data, error } = await supabase.storage.from('recordings').upload(createFilePath(user, editor.video.modified_blob), editor.video.modified_blob);
        if (error) throw error;
        response.modified = data;
      }

      const { error, data } = await supabase
        .from('recordings')
        .insert({ name: editor.video.name, original_file: response.original.id, modified_file: response.modified ? response.modified.id : null })
        .select(`*, original_file (*), modified_file (*)`);
      if (error) throw error;

      return data[0];
    },
    onSuccess: (response) => {
      console.log(response);
      toast.success('The recording has been uploaded to cloud');
    },
    onError: (error) => {
      console.warn(error);
      toast.error(unwrapError(error, 'Oops! Something went wrong while uploading your video to cloud'));
    },
  });

  return (
    <aside className="h-screen overflow-auto w-96 shrink-0 bg-card-background border-r border-borders-input flex flex-col px-5">
      <div className="h-16 flex flex-col items-start justify-center shrink-0">
        <Brand mode="expanded" height={30} className="w-fit" />
      </div>
      <div className="flex flex-col gap-8 py-6 shrink-0">
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold">Export</label>
          <SidebarAction
            icon={<CloudArrowUp weight="bold" />}
            title="Upload to cloud"
            description="Get access to premium features"
            loading={handleCloudUpload.isPending}
            onClick={() => handleCloudUpload.mutate()}
          />
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
  );
}

interface SidebarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  premium?: boolean;
  loading?: boolean;
  description: string;
  icon: React.ReactNode;
}

const SidebarAction = forwardRef<HTMLButtonElement, SidebarActionProps>(
  ({ icon, title, description, loading, className, premium, disabled, ...props }, ref) => {
    const style = {
      animation: animate.spin,
    };

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
          {premium ? <CrownIcon className="text-xl" /> : loading ? <Spinner weight="bold" style={style} /> : <CaretRight size={14} weight="bold" />}
        </span>
      </button>
    );
  }
);
