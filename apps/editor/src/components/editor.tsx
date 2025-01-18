import Draggable, { DraggableData } from 'react-draggable';
import { Spinner, VideoPlayer } from '@rekorder.io/ui';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CropIcon } from './icon/crop';
import { Header } from './layout/header';
import { Sidebar } from './layout/sidebar';
import { editor } from '../store/editor';

const OfflineEditor = observer(() => {
  return (
    <div className="h-screen w-screen bg-background-light flex">
      <Sidebar />
      <section className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center p-10">
          <div className="h-auto w-full max-w-4xl relative">
            <Player blob={editor.recording} crop={editor.sidebar === 'crop'} />
          </div>
        </main>
      </section>
    </div>
  );
});

const Player = observer(({ blob, crop }: { blob: Blob | null; crop?: boolean }) => {
  const [source, setSource] = useState('');

  useEffect(() => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    setSource(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  if (!source) {
    return (
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner size={32} color="black" className="mx-auto" />
        <p className="font-medium text-sm text-black mt-2">Processing the recorded video...</p>
      </span>
    );
  }

  return (
    <div className="relative">
      <VideoPlayer ref={editor.initializeElement} src={source} container="h-auto! w-full! max-w-4xl!" className="h-auto! w-full! max-w-4xl!" />
      {crop ? <Cropper /> : null}
    </div>
  );
});

function Cropper() {
  const ref = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ top: 0, left: 0, bottom: 0, right: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleResize = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    console.log('Resize', rect);
    setDimensions({ width: rect.width, height: rect.height });
    setPosition((state) => ({ ...state, bottom: rect.height, right: rect.width }));
  }, []);

  const handleInitialize = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });
    setPosition((state) => ({ ...state, bottom: rect.height, right: rect.width }));
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(handleResize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [handleResize]);

  const handleDrag = (mode: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => (_: any, value: DraggableData) => {
    switch (mode) {
      case 'top-left':
        setPosition((state) => ({ ...state, top: value.y, left: value.x }));
        break;
      case 'top-right':
        setPosition((state) => ({ ...state, top: value.y, right: value.x }));
        break;
      case 'bottom-left':
        setPosition((state) => ({ ...state, bottom: value.y, left: value.x }));
        break;
      case 'bottom-right':
        setPosition((state) => ({ ...state, bottom: value.y, right: value.x }));
        break;
    }
  };

  return (
    <div ref={handleInitialize} className="absolute inset-0">
      <div
        className="absolute bg-black/60 border-2 border-core-white/60"
        style={{
          top: position.top,
          left: position.left,
          width: position.right - position.left,
          height: position.bottom - position.top,
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="absolute bg-core-white/30 h-full w-px " style={{ left: 25 * (index + 1) + '%' }} />
        ))}
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="absolute bg-core-white/30 w-full h-px " style={{ top: 25 * (index + 1) + '%' }} />
        ))}
      </div>
      <Draggable
        position={{
          x: position.left,
          y: position.top,
        }}
        bounds={{
          left: 0,
          top: 0,
          right: dimensions.width,
          bottom: dimensions.height,
        }}
        onDrag={handleDrag('top-left')}
      >
        <div id="top-left" className="absolute top-0 left-0">
          <CropIcon className="rotate-0 -translate-x-1.5 -translate-y-1.5" />
        </div>
      </Draggable>
      <Draggable
        position={{
          x: position.right,
          y: position.top,
        }}
        bounds={{
          left: 0,
          top: 0,
          right: dimensions.width,
          bottom: dimensions.height,
        }}
        onDrag={handleDrag('top-right')}
      >
        <div id="top-right" className="absolute top-0 left-0">
          <CropIcon className="rotate-90 -translate-x-3.5 -translate-y-1.5" />
        </div>
      </Draggable>
      <Draggable
        position={{
          x: position.left,
          y: position.bottom,
        }}
        bounds={{
          left: 0,
          top: 0,
          right: dimensions.width,
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
          x: position.right,
          y: position.bottom,
        }}
        bounds={{
          left: 0,
          top: 0,
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
  );
}

export { OfflineEditor };
