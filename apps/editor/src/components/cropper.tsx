import { observer } from 'mobx-react';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Draggable, { DraggableData } from 'react-draggable';

import { CropIcon } from './icon/crop';
import { editor } from '../store/editor';
import { MINIMUM_CROP_SIZE } from '../constants/crop';

const Cropper = observer(() => {
  const ref = useRef<HTMLDivElement>(null!);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleResize = useCallback(() => {
    const rect = ref.current.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });
    editor.cropper.initializePosition({ top: 0, left: 0, bottom: rect.height, right: rect.width });
  }, []);

  const handleInitialize = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });
    editor.cropper.initializePosition({ top: 0, left: 0, bottom: rect.height, right: rect.width });
    ref.current = node;
  }, []);

  useEffect(() => {
    const element = ref.current;
    const observer = new ResizeObserver(handleResize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [handleResize]);

  const handleDrag = (mode: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'body') => (_: any, value: DraggableData) => {
    switch (mode) {
      case 'top-left': {
        editor.cropper.changePosition('top', value.y);
        editor.cropper.changePosition('left', value.x);
        break;
      }

      case 'top-right': {
        editor.cropper.changePosition('top', value.y);
        editor.cropper.changePosition('right', value.x);
        break;
      }

      case 'bottom-left': {
        editor.cropper.changePosition('bottom', value.y);
        editor.cropper.changePosition('left', value.x);
        break;
      }

      case 'bottom-right': {
        editor.cropper.changePosition('bottom', value.y);
        editor.cropper.changePosition('right', value.x);
        break;
      }

      case 'body': {
        const width = editor.cropper.position.right - editor.cropper.position.left;
        const height = editor.cropper.position.bottom - editor.cropper.position.top;
        editor.cropper.changePosition('top', value.y);
        editor.cropper.changePosition('left', value.x);
        editor.cropper.changePosition('right', value.x + width);
        editor.cropper.changePosition('bottom', value.y + height);
        break;
      }
    }
  };

  return (
    <Fragment>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute"
          style={{
            top: editor.cropper.position.top,
            left: editor.cropper.position.left,
            width: editor.cropper.position.right - editor.cropper.position.left,
            height: editor.cropper.position.bottom - editor.cropper.position.top,
            boxShadow: '0px 0px 0px 9999px rgba(0, 0, 0, 0.8)',
          }}
        />
      </div>
      <div ref={handleInitialize} className="absolute inset-0">
        <Draggable
          position={{
            x: editor.cropper.position.left,
            y: editor.cropper.position.top,
          }}
          bounds={{
            left: 0,
            top: 0,
            right: dimensions.width - (editor.cropper.position.right - editor.cropper.position.left),
            bottom: dimensions.height - (editor.cropper.position.bottom - editor.cropper.position.top),
          }}
          onDrag={handleDrag('body')}
        >
          <div
            className="absolute bg-transparent border-2 border-core-white/60"
            style={{
              width: editor.cropper.position.right - editor.cropper.position.left,
              height: editor.cropper.position.bottom - editor.cropper.position.top,
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="absolute bg-core-white/30 h-full w-px " style={{ left: 25 * (index + 1) + '%' }} />
            ))}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="absolute bg-core-white/30 w-full h-px " style={{ top: 25 * (index + 1) + '%' }} />
            ))}
          </div>
        </Draggable>
        <Draggable
          position={{
            x: editor.cropper.position.left,
            y: editor.cropper.position.top,
          }}
          bounds={{
            left: 0,
            top: 0,
            right: editor.cropper.position.right - MINIMUM_CROP_SIZE,
            bottom: editor.cropper.position.bottom - MINIMUM_CROP_SIZE,
          }}
          onDrag={handleDrag('top-left')}
        >
          <div id="top-left" className="absolute top-0 left-0">
            <CropIcon className="rotate-0 -translate-x-1.5 -translate-y-1.5" />
          </div>
        </Draggable>
        <Draggable
          position={{
            x: editor.cropper.position.right,
            y: editor.cropper.position.top,
          }}
          bounds={{
            top: 0,
            left: editor.cropper.position.left + MINIMUM_CROP_SIZE,
            bottom: editor.cropper.position.bottom - MINIMUM_CROP_SIZE,
            right: dimensions.width,
          }}
          onDrag={handleDrag('top-right')}
        >
          <div id="top-right" className="absolute top-0 left-0">
            <CropIcon className="rotate-90 -translate-x-3.5 -translate-y-1.5" />
          </div>
        </Draggable>
        <Draggable
          position={{
            x: editor.cropper.position.left,
            y: editor.cropper.position.bottom,
          }}
          bounds={{
            left: 0,
            top: editor.cropper.position.top + MINIMUM_CROP_SIZE,
            right: editor.cropper.position.right - MINIMUM_CROP_SIZE,
            bottom: dimensions.height,
          }}
          onDrag={handleDrag('bottom-left')}
        >
          <div id="bottom-left" className="absolute top-0 left-0">
            <CropIcon className="-rotate-90 -translate-x-1.5 -translate-y-3.5" />
          </div>
        </Draggable>
        <Draggable
          position={{
            x: editor.cropper.position.right,
            y: editor.cropper.position.bottom,
          }}
          bounds={{
            left: editor.cropper.position.left + MINIMUM_CROP_SIZE,
            top: editor.cropper.position.top + MINIMUM_CROP_SIZE,
            right: dimensions.width,
            bottom: dimensions.height,
          }}
          onDrag={handleDrag('bottom-right')}
        >
          <div id="bottom-right" className="absolute top-0 left-0">
            <CropIcon className="rotate-180 -translate-x-3.5 -translate-y-3.5" />
          </div>
        </Draggable>
      </div>
    </Fragment>
  );
});

export { Cropper };
