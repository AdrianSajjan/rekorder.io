import { ChangeEvent } from 'react';
import { observer } from 'mobx-react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';

import { CheckCircle } from '@phosphor-icons/react';
import { Input } from '@rekorder.io/ui';
import { Slider, SliderRange, SliderThumb, SliderTrack } from '@radix-ui/react-slider';

import { MINIMUM_CROP_SIZE } from '../../../constants/crop';
import { CropCoordinates, CropStatus } from '../../../store/cropper';
import { editor } from '../../../store/editor';

const CropSidebar = observer(() => {
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

  return (
    <div className="flex flex-col py-6 shrink-0 gap-10">
      <div className="flex flex-col">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold">Crop Video</h3>
          <p className="text-text-muted text-xs leading-normal">
            Cropping a video may take some time, please be patient while we process your video. Switch to our cloud editor to crop your video faster.
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
        <div className="mt-6">
          <button
            onClick={editor.cropper.crop}
            disabled={editor.cropper.status !== 'idle'}
            className="h-10 w-full rounded-[0.62rem] bg-primary-main text-sm font-medium text-primary-text relative overflow-hidden hover:bg-primary-dark disabled:pointer-events-none disabled:bg-background-main transition-colors duration-300"
          >
            <MotionConfig transition={{ duration: 0.5, type: 'spring' }}>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  className="relative z-10 h-full w-full flex items-center px-4"
                  key={editor.cropper.status}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                >
                  <CropButtonContent status={editor.cropper.status} progress={editor.cropper.progress} />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence initial={false}>
                {editor.cropper.status !== 'idle' ? (
                  <motion.div
                    exit={{ y: 40, opacity: 0 }}
                    animate={{ width: editor.cropper.status === 'processing' ? editor.cropper.progress + '%' : '100%' }}
                    className="z-0 absolute top-0 left-0 h-full bg-success-main"
                  />
                ) : null}
              </AnimatePresence>
            </MotionConfig>
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold">Video Controls</h3>
          <p className="text-text-muted text-xs leading-normal">Control the video playback state from here for more precise cropping and resizing</p>
        </div>
        <div className="bg-red w-full">
          <Slider>
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </div>
      </div>
    </div>
  );
});

const CropButtonContent = observer(({ status, progress }: { status: CropStatus; progress: number }) => {
  switch (status) {
    case 'idle':
      return <div className="mx-auto">Crop Video</div>;
    case 'processing':
      return <div className="ml-auto text-text-dark">{progress}%</div>;
    case 'completed':
      return <CheckCircle size={24} weight="regular" className="mx-auto" />;
  }
});

export { CropSidebar };
