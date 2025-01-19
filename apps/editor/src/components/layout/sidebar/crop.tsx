import { observer } from 'mobx-react';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';

import { Pause, Play } from '@phosphor-icons/react';
import { useVideoControls } from '@rekorder.io/hooks';
import { Button, Input } from '@rekorder.io/ui';
import { formatSecondsToMMSS, unwrapError } from '@rekorder.io/utils';

import { MINIMUM_CROP_SIZE } from '../../../constants/crop';
import { CropCoordinates } from '../../../store/cropper';
import { editor } from '../../../store/editor';

import { Slider } from '../../ui/slider';
import { ActionButton, ActionButtonContent } from '../../ui/modify-button';

const CropSidebar = observer(() => {
  const { controls, handleTogglePlayback, handleSeek } = useVideoControls(editor.elementOrThrow);

  const handleChange = (key: keyof CropCoordinates) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = +event.target.value;
    if (value < 0 || isNaN(value)) return;
    switch (key) {
      case 'x':
        if (value > editor.cropper.originalDimensions.width - MINIMUM_CROP_SIZE) return;
        break;
      case 'y':
        if (value > editor.cropper.originalDimensions.height - MINIMUM_CROP_SIZE) return;
        break;
      case 'width':
        if (value > editor.cropper.originalDimensions.width) return;
        break;
      case 'height':
        if (value > editor.cropper.originalDimensions.height) return;
        break;
    }
    editor.cropper.changeCoordinate(key, value);
  };

  const handleSeekVideo = ([value]: [number]) => {
    handleSeek(value);
  };

  const handleCropVideo = () => {
    editor.cropper.crop().catch((error) => {
      const message = unwrapError(error, 'Oops, something went wrong while cropping the video!');
      toast.error(message.includes('abort') ? 'The process was aborted by the user' : message);
    });
  };

  return (
    <div className="flex flex-col py-6 shrink-0 gap-10">
      <div className="flex flex-col">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold">Crop Video</h3>
          <p className="text-text-muted text-xs leading-normal">
            Cropping a video may take some time, please be patient while we process your video. Switch to our cloud editor to edit videos faster.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-px">
            <label className="text-xs font-medium">X</label>
            <Input min={0} max={editor.cropper.originalDimensions.width - MINIMUM_CROP_SIZE} value={editor.cropper.coordinates.x} onChange={handleChange('x')} type="number" className="w-full" />
          </div>
          <div className="space-y-px">
            <label className="text-xs font-medium">Y</label>
            <Input min={0} max={editor.cropper.originalDimensions.height - MINIMUM_CROP_SIZE} value={editor.cropper.coordinates.y} onChange={handleChange('y')} type="number" className="w-full" />
          </div>
          <div className="space-y-px">
            <label className="text-xs font-medium">Width</label>
            <Input min={MINIMUM_CROP_SIZE} max={editor.cropper.originalDimensions.width} value={editor.cropper.coordinates.width} onChange={handleChange('width')} type="number" className="w-full" />
          </div>
          <div className="space-y-px">
            <label className="text-xs font-medium">Height</label>
            <Input
              min={MINIMUM_CROP_SIZE}
              max={editor.cropper.originalDimensions.height}
              value={editor.cropper.coordinates.height}
              onChange={handleChange('height')}
              type="number"
              className="w-full"
            />
          </div>
        </div>
        <ActionButton container="mt-6" status={editor.cropper.status} progress={editor.cropper.progress} onClick={handleCropVideo} onAbort={editor.cropper.abort}>
          <ActionButtonContent label="Crop Video" status={editor.cropper.status} progress={editor.cropper.progress} />
        </ActionButton>
      </div>
      <div className="flex flex-col">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold">Video Controls</h3>
          <p className="text-text-muted text-xs leading-normal">Control the video playback state from here for more precise cropping and resizing</p>
        </div>
        <div className="flex items-center gap-4 mt-6 relative">
          <Button size="icon" variant="outline" color="accent" onClick={handleTogglePlayback}>
            {controls.playing ? <Pause weight="fill" /> : <Play weight="fill" />}
          </Button>
          <div className="flex items-center gap-3 w-full">
            <p className="text-xs">{formatSecondsToMMSS(controls.seek)}</p>
            <Slider min={0} step={0.01} max={controls.duration} value={[controls.seek]} onValueChange={handleSeekVideo} />
            <p className="text-xs">{formatSecondsToMMSS(controls.duration)}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export { CropSidebar };
