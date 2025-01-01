import clsx from 'clsx';
import Draggable from 'react-draggable';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment, useMemo, useState } from 'react';

import { ArrowsOutSimple, X } from '@phosphor-icons/react';
import { animations, theme } from '@rekorder.io/ui';

import { useDragControls } from '../hooks/use-drag-controls';
import { camera } from '../store/camera';

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

  .rekorder-close-button,
  .rekorder-resize-button {
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

  .rekorder-close-button {
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }

  .rekorder-resize-button {
    right: 0;
    bottom: 0;
    transform: translate(50%, 50%) rotate(90deg);
  }

  .rekorder-close-button:hover,
  .rekorder-resize-button:hover {
    background-color: ${theme.alpha(theme.colors.core.black, 0.8)};
  }

  .rekorder-camera-container:hover .rekorder-close-button,
  .rekorder-camera-container:hover .rekorder-resize-button {
    opacity: 1;
    pointer-events: auto;
  }

  .rekorder-camera-handle {
    cursor: move;
    overflow: hidden;
    position: relative;
    border-radius: 100%;

    animation: ${animations['zoom-in-fade-in']} 0.5s;
    box-shadow: ${theme.shadow(theme.alpha(theme.colors.accent.main, 0.1)).xl};
  }

  .rekorder-camera-controls {
    position: absolute;
    pointer-events: none;
  }

  .rekorder-camera-iframe {
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
  }

  .rekorder-camera-iframe[data-flip='true'] {
    transform: translate(-50%, -50%) scaleX(-1);
  }

  .rekorder-camera-iframe[data-flip='false'] {
    transform: translate(-50%, -50%) scaleX(1);
  }
`;

const CameraPreviewHOC = observer(() => {
  if (camera.device === 'n/a' || !camera.enabled) {
    return null;
  } else {
    return <CameraPreview />;
  }
});

const CameraPreview = observer(() => {
  const [cameraSize, setCameraSize] = useState(200);

  const drag = useDragControls<HTMLDivElement>({ position: 'top-left' });

  const styles = useMemo(() => {
    const position = (cameraSize - cameraSize / Math.sqrt(2)) / 2;
    return theme.createStyles({
      handle: { width: cameraSize, height: cameraSize },
      control: { width: cameraSize, height: cameraSize, top: position, left: position },
    });
  }, [cameraSize]);

  return (
    <Fragment>
      {CameraPreviewCSS.styles}
      <Draggable handle="#rekorder-camera-handle" nodeRef={drag.ref} position={drag.position} bounds={drag.bounds} onStop={drag.onChangePosition}>
        <div ref={drag.ref} className={clsx(CameraPreviewCSS.className, 'rekorder-camera-container')}>
          <div id="rekorder-camera-handle" className={clsx(CameraPreviewCSS.className, 'rekorder-camera-handle')} style={styles.handle}>
            <iframe
              allow="camera"
              title="Camera Preview"
              src={chrome.runtime.getURL('build/camera.html')}
              className={clsx(CameraPreviewCSS.className, 'rekorder-camera-iframe')}
              data-flip={String(camera.flip)}
            />
          </div>
          <div className={clsx(CameraPreviewCSS.className, 'rekorder-camera-controls')} style={styles.control}>
            <button onClick={() => camera.changeDevice('n/a')} className={clsx(CameraPreviewCSS.className, 'rekorder-close-button')}>
              <X size={16} weight="bold" color={theme.colors.core.white} />
            </button>
            <button className={clsx(CameraPreviewCSS.className, 'rekorder-resize-button')} onClick={() => setCameraSize(cameraSize === 200 ? 400 : 200)}>
              <ArrowsOutSimple weight="bold" size={16} color={theme.colors.core.white} />
            </button>
          </div>
        </div>
      </Draggable>
    </Fragment>
  );
});

export { CameraPreviewHOC as CameraPreview };
