import { observer } from 'mobx-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { CloudArrowUp, FileAudio } from '@phosphor-icons/react';
import { Input, Switch, theme } from '@rekorder.io/ui';

import { Slider } from '../../ui/slider';
import { ActionButton, ActionButtonContent } from '../../ui/modify-button';

const AudioSidebar = observer(() => {
  const handleSelectFile = useCallback((files: File[]) => {
    console.log(files);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleSelectFile,
    accept: {
      'audio/*': ['.mp3', '.wav', '.aac', '.ogg'],
    },
  });

  return (
    <div className="flex flex-col py-6 shrink-0">
      <div className="flex flex-col">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold">Edit Audio</h3>
          <p className="text-text-muted text-xs leading-normal">Modifying audio may take some time, please be patient while we process your audio. Switch to our cloud editor to edit videos faster.</p>
        </div>
        <div className="mt-6">
          <div
            className="w-full rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-borders-input p-6 hover:bg-background-light transition-colors cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? <FileAudio weight="bold" size={24} color={theme.colors.accent.dark} /> : <CloudArrowUp weight="bold" size={24} color={theme.colors.accent.dark} />}
            <div className="space-y-1.5 text-center mt-4 mb-5">
              <h4 className="text-sm font-medium">{isDragActive ? 'Drop your audio here' : 'Browse a file or drag & drop it here'}</h4>
              <p className="text-xs text-text-muted">MP3, WAV, AAC, and OGG formats are supported</p>
            </div>
            <div className="text-sm px-5 py-2 rounded-lg border border-borders-input bg-card-background">Browse Audio</div>
          </div>
        </div>
        <div className="mt-8">
          <div className="space-y-px">
            <label className="text-sm font-semibold">Audio Timeline</label>
            <p className="text-text-muted text-xs leading-normal">Set the start and end time of the audio in minutes</p>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Input min={0} step={0.01} placeholder="00.00" type="number" className="w-full" />
            <span className="text-sm text-accent-dark">to</span>
            <Input min={0} step={0.01} placeholder="00.00" type="number" className="w-full" />
          </div>
        </div>
        <div className="mt-8">
          <div className="space-y-px">
            <label className="text-sm font-semibold">Audio Volume</label>
            <p className="text-text-muted text-xs leading-normal">Adjust the voume of the uploaded audio to your liking</p>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Input type="number" className="w-24" placeholder="100%" />
            <Slider />
          </div>
        </div>
        <div className="flex items-center justify-between gap-8 mt-8">
          <div className="space-y-px">
            <label className="text-sm font-semibold">Replace Current Audio</label>
            <p className="text-text-muted text-xs leading-normal">This will remove the existing audio completely</p>
          </div>
          <Switch size="medium" />
        </div>
        <ActionButton container="mt-8" status="idle" progress={0}>
          <ActionButtonContent label="Modify Audio" status="idle" progress={0} />
        </ActionButton>
      </div>
    </div>
  );
});

export { AudioSidebar };
