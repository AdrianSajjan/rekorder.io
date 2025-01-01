import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { theme } from '@rekorder.io/ui';

import { camera } from './store/camera';

const styles = theme.createStyles({
  container: {
    position: 'relative',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
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
    <div style={styles.container}>
      <canvas ref={canvas$} style={styles.canvas} />
      <video playsInline ref={video$} height={CAMERA_DIMENTIONS} width={CAMERA_DIMENTIONS} style={styles.video} muted />
    </div>
  );
});

export { CameraPreview };
