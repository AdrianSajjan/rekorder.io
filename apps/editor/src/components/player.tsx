import { MP4Player } from '@rekorder.io/player';
import { useRef, useEffect } from 'react';

interface MP4VideoPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
}

export function MP4VideoPlayer({ src, ...props }: MP4VideoPlayerProps) {
  const container$ = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container$.current) return;
    const player = new MP4Player(src, container$.current);
    return () => {
      player.destroy();
    };
  }, [src]);

  return <div ref={container$} {...props}></div>;
}
