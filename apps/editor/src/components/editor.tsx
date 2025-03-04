import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Fragment, useEffect, useState } from 'react';
import { Spinner, theme, VideoPlayer } from '@rekorder.io/ui';

import { Footer } from './layout/footer';
import { Header } from './layout/header';
import { Sidebar } from './layout/sidebar';

import { Cropper } from './cropper';
import { editor } from '../store/editor';
import { FOOTER_HEIGHT, HEADER_HEIGHT, MAIN_PADDING, SIDEBAR_WIDTH } from '../constants/layout';

const OfflineEditor = observer(() => {
  const VISIBLE_FOOTER_HEIGHT = editor.footer === 'none' ? 0 : FOOTER_HEIGHT;

  const main = {
    width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
    height: `calc(100vh - ${HEADER_HEIGHT + VISIBLE_FOOTER_HEIGHT}px)`,
    padding: MAIN_PADDING,
  };

  const container = {
    width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
    marginLeft: SIDEBAR_WIDTH,
  };

  const player = {
    maxWidth: `calc(100vw - ${MAIN_PADDING * 2 + SIDEBAR_WIDTH}px)`,
    maxHeight: `calc(100vh - ${MAIN_PADDING * 2 + HEADER_HEIGHT + VISIBLE_FOOTER_HEIGHT}px)`,
  };

  return (
    <Fragment>
      <Sidebar />
      <section className="h-screen overflow-hidden bg-background-light" style={container}>
        <Header />
        <main className="transition-all duration-300 ease-in-out" style={main}>
          <Player style={player} />
        </main>
        <Footer />
      </section>
    </Fragment>
  );
});

const Player = observer(({ style }: { style?: React.CSSProperties }) => {
  const [source, setSource] = useState('');

  useEffect(() => {
    let url: string;
    const dispose = reaction(
      () => editor.mp4Recording,
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
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Spinner size={32} color={theme.colors.primary.main} className="mx-auto" />
        <p className="font-medium text-sm text-black mt-3">Processing the screen recording</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-screen-md grid place-items-center transition-all duration-300 ease-in-out" style={style}>
      <VideoPlayer ref={editor.initializeElement} src={source} controls={editor.sidebar !== 'crop'}>
        {editor.sidebar === 'crop' ? <Cropper /> : null}
      </VideoPlayer>
    </div>
  );
});

export { OfflineEditor };
