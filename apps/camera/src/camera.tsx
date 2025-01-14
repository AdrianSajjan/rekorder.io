import { theme } from '@rekorder.io/ui';
import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import { camera } from './store/camera';

const CAMERA_DIMENTIONS = 1024;

const styles = theme.createStyles({
  container: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  video: {
    objectFit: 'cover',
    display: 'none',
  },
  canvas: {
    top: '50%',
    left: '50%',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.colors.core.black,
  },
});

const CameraPreview = observer(() => {
  const video$ = useRef<HTMLVideoElement>(null);
  const canvas$ = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!video$.current || !canvas$.current) return;

    camera.initialize(video$.current, canvas$.current);
    camera.start();

    return () => camera.dispose();
  }, []);

  useEffect(() => {
    if (!video$.current) return;

    const video = video$.current;
    const handleResize = () => setDimensions({ width: video.videoWidth, height: video.videoHeight });
    handleResize();

    video.addEventListener('loadedmetadata', handleResize);
    return () => video.removeEventListener('loadedmetadata', handleResize);
  }, []);

  const style = {
    width: dimensions.width > dimensions.height ? 'auto' : '100%',
    height: dimensions.width > dimensions.height ? '100%' : 'auto',
  };

  return (
    <div style={styles.container}>
      <canvas ref={canvas$} style={Object.assign({}, style, styles.canvas)} />
      <video muted playsInline ref={video$} height={CAMERA_DIMENTIONS} width={CAMERA_DIMENTIONS} style={styles.video} />
    </div>
  );
});

export { CameraPreview };
