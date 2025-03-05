import { useCallback } from 'react';
import { observer } from 'mobx-react';
import { useDropzone } from 'react-dropzone';

import { theme } from '@rekorder.io/ui';
import { CloudArrowUp, FileAudio, Trash } from '@phosphor-icons/react';

import { editor } from '../../../store/editor';
import { ActionButton, ActionButtonContent } from '../../ui/modify-button';

const AudioSidebar = observer(() => {
  const handleSelectFile = useCallback(async (files: File[]) => {
    await Promise.allSettled(files.map((file) => editor.audio.createAudioFile(file)));
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
        {editor.audio.files.length ? (
          <div className="mt-8 flex flex-col">
            {editor.audio.files.map((file) => (
              <div key={file.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileAudio weight="bold" size={24} color={theme.colors.accent.dark} />
                    <div className="text-sm font-medium">{file.file.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trash weight="bold" size={24} color={theme.colors.accent.dark} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <ActionButton container="mt-8" status="idle" progress={0}>
          <ActionButtonContent label="Modify Audio" status="idle" progress={0} />
        </ActionButton>
      </div>
    </div>
  );
});

export { AudioSidebar };
