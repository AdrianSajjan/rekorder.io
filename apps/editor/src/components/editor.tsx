import { observer } from 'mobx-react';
import { Spinner, VideoPlayer } from '@rekorder.io/ui';
import { useEffect, useState } from 'react';

import { editor } from '../store/editor';
import { Sidebar } from './layout/sidebar';
import { Header } from './layout/header';

const OfflineEditor = observer(() => {
  return (
    <div className="h-screen w-screen bg-background-light flex">
      <Sidebar />
      <section className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center p-10">
          <div className="h-auto w-full max-w-4xl relative">
            <Player blob={editor.recording} />
          </div>
        </main>
      </section>
    </div>
  );
});

const Player = observer(({ blob }: { blob: Blob | null }) => {
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

  return <VideoPlayer src={source} container="h-auto! w-full! max-w-4xl!" className="h-auto! w-full! max-w-4xl!" />;
});

export { OfflineEditor };
