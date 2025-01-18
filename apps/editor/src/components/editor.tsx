import { Spinner, VideoPlayer } from '@rekorder.io/ui';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';

import { editor } from '../store/editor';
import { Header } from './layout/header';
import { Sidebar } from './layout/sidebar';
import { Cropper } from './cropper';

const OfflineEditor = observer(() => {
  return (
    <div className="h-screen w-screen bg-background-light flex">
      <Sidebar />
      <section className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center p-10">
          <div className="w-fit h-fit">
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
    <div className="relative w-fit h-fit">
      <VideoPlayer ref={editor.initializeElement} src={source} className="!h-auto !w-full !max-w-4xl" />
      {crop ? <Cropper /> : null}
    </div>
  );
});

export { OfflineEditor };
