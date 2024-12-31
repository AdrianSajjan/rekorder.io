import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { theme } from '@rekorder.io/ui';

import { camera } from './store/camera';

const styles = theme.createStyles({
  canvas: {
    width: '100%',
    height: '100%',
  },
  video: {
    objectFit: 'cover',
    display: 'none',
  },
});

const CAMERA_DIMENTIONS = 1024;

const CameraPreview = observer(() => {
  const video$ = useRef<HTMLVideoElement>(null);
  const canvas$ = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!video$.current || !canvas$.current) return;
    camera.initializeElements(video$.current, canvas$.current);
    camera.createStream();
  }, []);

  return (
    <Fragment>
      <canvas ref={canvas$} style={styles.canvas} />
      <video playsInline ref={video$} height={CAMERA_DIMENTIONS} width={CAMERA_DIMENTIONS} style={styles.video} muted />
    </Fragment>
  );
});

export { CameraPreview };
