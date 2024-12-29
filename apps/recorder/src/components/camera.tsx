import clsx from 'clsx';
import Draggable from 'react-draggable';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment, useEffect, useRef, useState } from 'react';

import { ArrowsOutSimple, X } from '@phosphor-icons/react';
import { animations, theme } from '@rekorder.io/ui';

import { CAMERA_DIMENTIONS } from '../constants/layout';
import { camera } from '../store/camera';
import { useDragControls } from '../hooks/use-drag-controls';

const CameraPreviewHOC = observer(() => {
  if (camera.device === 'n/a' || !camera.enabled) {
    return null;
  } else {
    return <CameraPreview />;
  }
});

const CameraPreviewCSS = css.resolve`
  * {
    margin: 0;
  }

  button {
    all: unset;
  }

  .rekorder-camera-container {
    position: absolute;
    pointer-events: all;
  }

  .close-button,
  .resize-button {
    height: 32px;
    width: 32px;
    border-radius: 100%;

    position: absolute;
    display: grid;
    place-items: center;
    background-color: ${theme.colors.core.black};

    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  .close-button {
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }

  .resize-button {
    right: 0;
    bottom: 0;
    transform: translate(50%, 50%) rotate(90deg);
  }

  .close-button:hover,
  .resize-button:hover {
    background-color: ${theme.alpha(theme.colors.core.black, 0.8)};
  }

  .rekorder-camera-container:hover .close-button,
  .rekorder-camera-container:hover .resize-button {
    opacity: 1;
    pointer-events: auto;
  }

  .camera-handle {
    cursor: move;
    overflow: hidden;
    border-radius: 100%;
    animation: ${animations['zoom-in-fade-in']} 0.5s;
    box-shadow: ${theme.shadow(theme.alpha(theme.colors.accent.main, 0.1)).xl};
  }

  .camera-controls {
    position: absolute;
    pointer-events: none;
  }

  .canvas {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }

  .video {
    object-fit: cover;
    display: none;
  }
`;

const CameraPreview = observer(() => {
  const video$ = useRef<HTMLVideoElement>(null);
  const canvas$ = useRef<HTMLCanvasElement>(null);

  const [cameraSize, setCameraSize] = useState(200);
  const drag = useDragControls<HTMLDivElement>({ position: 'top-left' });

  useEffect(() => {
    if (!video$.current || !canvas$.current) return;
    camera.initializeElements(video$.current, canvas$.current).createStream();
  }, []);

  const boxSize = cameraSize / Math.sqrt(2);
  const boxPosition = (cameraSize - boxSize) / 2;

  return (
    <Fragment>
      {CameraPreviewCSS.styles}
      <Draggable
        handle="#camera-handle"
        nodeRef={drag.ref}
        position={drag.position}
        bounds={drag.bounds}
        onStop={drag.onChangePosition}
      >
        <div ref={drag.ref} className={clsx(CameraPreviewCSS.className, 'rekorder-camera-container')}>
          <div
            id="camera-handle"
            className={clsx(CameraPreviewCSS.className, 'camera-handle')}
            style={{ width: cameraSize, height: cameraSize }}
          >
            <canvas ref={canvas$} className={clsx(CameraPreviewCSS.className, 'canvas')} />
            <video
              playsInline
              ref={video$}
              height={CAMERA_DIMENTIONS}
              width={CAMERA_DIMENTIONS}
              className={clsx(CameraPreviewCSS.className, 'video')}
              muted
            />
          </div>
          <div
            className={clsx(CameraPreviewCSS.className, 'camera-controls')}
            style={{ width: boxSize, height: boxSize, top: boxPosition, left: boxPosition }}
          >
            <button
              onClick={() => camera.changeDevice('n/a')}
              className={clsx(CameraPreviewCSS.className, 'close-button')}
            >
              <X size={16} weight="bold" color={theme.colors.core.white} />
            </button>
            <button
              className={clsx(CameraPreviewCSS.className, 'resize-button')}
              onClick={() => setCameraSize(cameraSize === 200 ? 400 : 200)}
            >
              <ArrowsOutSimple weight="bold" size={16} color={theme.colors.core.white} />
            </button>
          </div>
        </div>
      </Draggable>
    </Fragment>
  );
});

export { CameraPreviewHOC as CameraPreview };
