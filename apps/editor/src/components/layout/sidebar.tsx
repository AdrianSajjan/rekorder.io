import { toast } from 'sonner';
import { forwardRef } from 'react';
import {
  CaretRight,
  CloudArrowUp,
  Crop,
  Download,
  MagnifyingGlassPlus,
  MusicNotes,
  Panorama,
  Scissors,
  ShareFat,
  Spinner,
  Subtitles,
  Translate,
  UserFocus,
  UserSound,
} from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';

import { supabase } from '@rekorder.io/database';
import { StorageResponse } from '@rekorder.io/types';
import { animate, Brand, CrownIcon } from '@rekorder.io/ui';
import { cn, createFilePath, unwrapError } from '@rekorder.io/utils';
import { extractVideoFileThumbnail } from '@rekorder.io/utils';

import { editor } from '../../store/editor';
import { useAuthenticatedSession } from '../../context/authentication';
import { PremiumFeatureDialog } from '../modal/premium-feature';

interface CloudUploadProps {
  original_file: StorageResponse;
  original_thumbnail: StorageResponse;
  modified_file?: StorageResponse;
  modified_thumbnail?: StorageResponse;
}

export function Sidebar() {
  const { user } = useAuthenticatedSession();

  const handleCloudUpload = useMutation({
    mutationFn: async () => {
      if (!editor.video) throw new Error('Unable to retrieve video file from storage');
      const response = {} as CloudUploadProps;

      if (editor.video.original_blob) {
        Promise.all([
          supabase.storage
            .from('recordings')
            .upload(createFilePath(user, editor.video.original_blob), editor.video.original_blob)
            .then(({ data, error }) => {
              if (error) throw error;
              response.original_file = data;
            }),
          extractVideoFileThumbnail(editor.video.original_blob).then((thumbnail) => {
            supabase.storage
              .from('thumbnails')
              .upload(createFilePath(user, thumbnail), thumbnail)
              .then(({ data, error }) => {
                if (error) throw error;
                response.original_thumbnail = data;
              });
          }),
        ]);
      }

      if (editor.video.modified_blob) {
        Promise.all([
          supabase.storage
            .from('recordings')
            .upload(createFilePath(user, editor.video.modified_blob), editor.video.modified_blob)
            .then(({ data, error }) => {
              if (error) throw error;
              response.modified_file = data;
            }),
          extractVideoFileThumbnail(editor.video.modified_blob).then((thumbnail) => {
            supabase.storage
              .from('thumbnails')
              .upload(createFilePath(user, thumbnail), thumbnail)
              .then(({ data, error }) => {
                if (error) throw error;
                response.modified_thumbnail = data;
              });
          }),
        ]);
      }

      const { error } = await supabase
        .from('recordings')
        .insert({
          name: editor.name,
          original_file: response.original_file.id,
          original_thumbnail: response.original_thumbnail.id,
          modified_file: response.modified_file ? response.modified_file.id : null,
          modified_thumbnail: response.modified_thumbnail ? response.modified_thumbnail.id : null,
        })
        .select();
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('The recording has been uploaded to cloud');
    },
    onError: (error) => {
      toast.error(unwrapError(error, 'Oops! Something went wrong while uploading your video'));
    },
  });

  if (!editor.video) {
    return (
      <aside className="h-screen overflow-auto w-96 shrink-0 bg-card-background border-r border-borders-input flex flex-col px-5">
        <div className="h-16 flex flex-col items-start justify-center shrink-0">
          <Brand mode="expanded" height={30} className="w-fit" />
        </div>
        <div className="flex flex-col gap-8 py-6 shrink-0">
          {Array.from({ length: 3 }, (_, key) => {
            return (
              <div className="flex flex-col gap-3" key={key}>
                <div className="h-4 w-24 rounded-md bg-background-main animate-pulse" />
                {Array.from({ length: 4 }, (_, key) => {
                  return <div className="h-16 bg-background-main rounded-2xl animate-pulse" key={key} />;
                })}
              </div>
            );
          })}
        </div>
      </aside>
    );
  }

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
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold">AI Studio</label>
          <PremiumFeatureDialog>
            <SidebarAction premium icon={<UserSound weight="bold" />} title="Customize voice" description="Choose from a library of AI voices" />
          </PremiumFeatureDialog>
          <PremiumFeatureDialog>
            <SidebarAction premium icon={<Translate weight="bold" />} title="Translate voice" description="Translate your voice to many languages" />
          </PremiumFeatureDialog>
          <PremiumFeatureDialog>
            <SidebarAction premium icon={<UserFocus weight="bold" />} title="Custom avatar" description="Add a live avatar to your video" />
          </PremiumFeatureDialog>
          <PremiumFeatureDialog>
            <SidebarAction premium icon={<Subtitles weight="bold" />} title="Subtitles" description="Generate subtitles for your video" />
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
