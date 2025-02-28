import { observer } from 'mobx-react';
import { forwardRef } from 'react';
import { toast } from 'sonner';
import { CaretRight, CloudArrowUp, Crop, Download, MagnifyingGlassPlus, MusicNotes, Panorama, Scissors, ShareFat, Subtitles, Translate, UserFocus, UserSound } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';

import { supabase } from '@rekorder.io/database';
import { StorageResponse } from '@rekorder.io/types';
import { CrownIcon, Spinner, theme } from '@rekorder.io/ui';
import { cn, createFilePath, extractVideoFileThumbnail, unwrapError } from '@rekorder.io/utils';

import { authenticateSession, fileDownloadBlob } from '../../../lib/utils';
import { editor } from '../../../store/editor';
import { useSession } from '../../../context/session';

import { PremiumFeatureDialog } from '../../modal/premium-feature';
import { CircularProgress } from '../../ui/circular-progress';

interface CloudUploadProps {
  original_file: StorageResponse;
  original_thumbnail: StorageResponse;
  modified_file?: StorageResponse;
  modified_thumbnail?: StorageResponse;
}

const DefaultSidebar = observer(() => {
  const session = useSession();

  const handleUploadVideo = async (blob: Blob) => {
    const { data, error } = await supabase.storage.from('recordings').upload(createFilePath(session!, blob), blob);
    if (error) throw error;
    return data;
  };

  const handleUploadThumbnail = async (blob: Blob) => {
    const thumbnail = await extractVideoFileThumbnail(blob);
    const { data, error } = await supabase.storage.from('thumbnails').upload(createFilePath(session!, thumbnail), thumbnail);
    if (error) throw error;
    return data;
  };

  const handleCloudUpload = useMutation({
    mutationFn: async () => {
      if (!session) return;
      const response = {} as CloudUploadProps;

      if (editor.originalMp4) {
        await Promise.all([
          handleUploadVideo(editor.originalMp4).then((data) => (response.original_file = data)),
          handleUploadThumbnail(editor.originalMp4).then((data) => (response.original_thumbnail = data)),
        ]);
      }

      if (editor.modifiedMp4) {
        await Promise.all([
          handleUploadVideo(editor.modifiedMp4).then((data) => (response.modified_file = data)),
          handleUploadThumbnail(editor.modifiedMp4).then((data) => (response.modified_thumbnail = data)),
        ]);
      }

      await supabase
        .from('recordings')
        .insert({
          user_id: session.id,
          project_name: editor.name,
          original_file: response.original_file.fullPath,
          original_thumbnail: response.original_thumbnail.fullPath,
          modified_file: response.modified_file ? response.modified_file.fullPath : null,
          modified_thumbnail: response.modified_thumbnail ? response.modified_thumbnail.fullPath : null,
        })
        .select()
        .throwOnError();
    },
    onSuccess: () => {
      toast.success('The recording has been uploaded to cloud');
    },
    onError: (error) => {
      toast.error(unwrapError(error, 'Oops! Something went wrong while uploading your video'));
    },
  });

  const handleDownloadMP4 = useMutation({
    mutationFn: async () => {
      fileDownloadBlob(editor.mp4RecordingOrThrow, editor.name, '.mp4');
    },
    onError: (error) => {
      toast.error(unwrapError(error, 'Oops! Something went wrong while converting your video'));
    },
  });

  const handleDownloadWEBM = useMutation({
    mutationFn: async () => {
      fileDownloadBlob(editor.webmRecordingOrThrow, editor.name, '.webm');
    },
    onError: (error) => {
      toast.error(unwrapError(error, 'Oops! Something went wrong while downloading your video'));
    },
  });

  return (
    <div className="flex flex-col gap-8 py-6 shrink-0">
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold">Export</label>
        <SidebarAction
          icon={<CloudArrowUp weight="bold" />}
          title="Upload to cloud"
          description="Get access to premium features"
          status={handleCloudUpload.isPending ? 'loading' : null}
          onClick={() => (session ? handleCloudUpload.mutate() : authenticateSession())}
        />
        <SidebarAction
          icon={<Download weight="bold" />}
          title="Export as MP4"
          description="Download your video in .mp4 format"
          status={handleDownloadMP4.isPending ? 'progress' : null}
          onClick={() => handleDownloadMP4.mutate()}
        />
        <SidebarAction
          icon={<Download weight="bold" />}
          title="Export as WEBM"
          description="Download your video in .webm format"
          status={handleDownloadWEBM.isPending ? 'loading' : null}
          onClick={() => handleDownloadWEBM.mutate()}
        />
        <PremiumFeatureDialog>
          <SidebarAction premium icon={<ShareFat weight="fill" />} title="Share video" description="Share the link of this video with others" />
        </PremiumFeatureDialog>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold">Edit</label>
        <SidebarAction icon={<Scissors weight="bold" />} title="Trim" description="Trim and cut your video" />
        <SidebarAction onClick={() => editor.changeSidebar('crop')} icon={<Crop weight="bold" />} title="Crop" description="Crop and resize your video" />
        <SidebarAction onClick={() => editor.changeSidebar('audio')} icon={<MusicNotes weight="bold" />} title="Audio" description="Add or modify the background audio" />
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
  );
});

interface SidebarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  premium?: boolean;
  progress?: number;
  status?: 'loading' | 'progress' | null;
}

const SidebarAction = forwardRef<HTMLButtonElement, SidebarActionProps>(({ icon, title, description, status, progress, className, premium, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'text-start flex items-center gap-4 rounded-2xl bg-card-background border border-borders-input px-5 py-3.5 hover:bg-background-light transition-colors',
        'disabled:hover:bg-card-background disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled || !!status}
      {...props}
    >
      <span className="flex">{icon}</span>
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-semibold">{title}</h3>
        <p className="text-xs text-accent-dark/80">{description}</p>
      </div>
      <span className="ml-auto flex">
        {premium ? <CrownIcon className="text-xl" /> : status ? <SidebarActionStatus status={status} progress={progress} /> : <CaretRight size={14} weight="bold" />}
      </span>
    </button>
  );
});

function SidebarActionStatus({ status, progress }: { status: 'loading' | 'progress'; progress?: number }) {
  switch (status) {
    case 'loading':
      return <Spinner color={theme.colors.core.black} />;
    case 'progress':
      return <CircularProgress progress={progress || 0} />;
    default:
      return null;
  }
}

export { DefaultSidebar };
