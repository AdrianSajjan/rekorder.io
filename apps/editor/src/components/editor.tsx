import { Spinner } from '@phosphor-icons/react';
import { observer } from 'mobx-react';
import { animate, VideoPlayer } from '@rekorder.io/ui';

import { editor } from '../store/editor';
import { Sidebar } from './layout/sidebar';

const OfflineEditor = observer(() => {
  return (
    <div className="h-screen w-screen bg-background-light flex">
      <Sidebar />
      <section className="flex-1 flex flex-col">
        <header className="h-16 bg-card-background shrink-0 border-b border-borders-input flex items-center justify-center">
          {editor.blobURL ? (
            <input value={editor.name} onChange={(event) => editor.updateName(event.target.value)} className="text-center text-sm w-96" />
          ) : null}
        </header>
        <main className="flex-1 grid place-items-center p-10">
          <div className="h-auto w-full max-w-4xl relative">
            {editor.blobURL ? (
              <VideoPlayer src={editor.blobURL} container="h-auto! w-full! max-w-4xl!" className="h-auto! w-full! max-w-4xl!" />
            ) : (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Spinner size={32} weight="bold" color="black" className="mx-auto" style={{ animation: animate.spin }} />
                <p className="font-medium text-sm text-black mt-2">Processing the recorded video...</p>
              </span>
            )}
          </div>
        </main>
      </section>
    </div>
  );
});

export { OfflineEditor };
