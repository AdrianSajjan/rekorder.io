import { Spinner, theme, VideoPlayer } from '@rekorder.io/ui';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';

import { editor } from '../store/editor';
import { Header } from './layout/header';
import { Sidebar } from './layout/sidebar';
import { Cropper } from './cropper';
import { reaction } from 'mobx';

const OfflineEditor = observer(() => {
  return (
    <div className="h-screen w-screen bg-background-light flex">
      <Sidebar />
      <section className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center p-10">
          <div className="w-fit h-fit">
            <Player />
          </div>
        </main>
      </section>
    </div>
  );
});

const Player = observer(() => {
  const [source, setSource] = useState('');

  useEffect(() => {
    let url: string;
    const dispose = reaction(
      () => editor.recording,
      (blob) => {
        if (blob) {
          url = URL.createObjectURL(blob);
          setSource(url);
        }
      },
      { fireImmediately: true }
    );
    return () => {
      dispose();
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  if (!source) {
    return (
      <div className="w-fit h-fit">
        <Spinner size={32} color={theme.colors.primary.main} className="mx-auto" />
        <p className="font-medium text-sm text-black mt-3">Processing the screen recording</p>
      </div>
    );
  }

  return (
    <div className="relative w-fit h-fit">
      <VideoPlayer ref={editor.initializeElement} src={source} className="!h-auto !w-full !max-w-4xl" />
      {editor.sidebar === 'crop' ? <Cropper /> : null}
    </div>
  );
});

export { OfflineEditor };
