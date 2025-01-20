import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Spinner, theme, VideoPlayer } from '@rekorder.io/ui';

import { Cropper } from './cropper';
import { Footer } from './layout/footer';
import { Header } from './layout/header';
import { Sidebar } from './layout/sidebar';

import { editor } from '../store/editor';
import { FOOTER_HEIGHT, HEADER_HEIGHT, MAIN_PADDING, SIDEBAR_WIDTH } from '../constants/layout';

const OfflineEditor = observer(() => {
  const VISIBLE_FOOTER_HEIGHT = editor.footer === 'none' ? 0 : FOOTER_HEIGHT;

  return (
    <div className="h-screen w-screen bg-background-light flex">
      <Sidebar />
      <section className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main
          className="flex items-center justify-center transition-all duration-300 ease-in-out"
          style={{ padding: MAIN_PADDING, height: `calc(100vh - ${HEADER_HEIGHT + VISIBLE_FOOTER_HEIGHT}px)`, width: `calc(100vw - ${SIDEBAR_WIDTH}px)` }}
        >
          <Player style={{ maxWidth: `calc(100vw - ${MAIN_PADDING * 2 + SIDEBAR_WIDTH}px)`, maxHeight: `calc(100vh - ${MAIN_PADDING * 2 + HEADER_HEIGHT + VISIBLE_FOOTER_HEIGHT}px)` }} />
        </main>
        <Footer />
      </section>
    </div>
  );
});

const Player = observer(({ style }: { style: React.CSSProperties }) => {
  const [source, setSource] = useState('');

  useEffect(() => {
    let url: string;
    const dispose = reaction(
      () => editor.recording,
      (blob) => {
        if (url) URL.revokeObjectURL(url);
        if (!blob) return;
        url = URL.createObjectURL(blob);
        setSource(url);
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
    <div className="relative h-fit w-fit max-w-full max-h-full">
      <VideoPlayer controls={editor.sidebar === 'default'} ref={editor.initializeElement} src={source} className="transition-all duration-300 ease-in-out" style={style} />
      {editor.sidebar === 'crop' ? <Cropper /> : null}
    </div>
  );
});

export { OfflineEditor };
