import * as fabric from 'fabric';

import clsx from 'clsx';
import css from 'styled-jsx/css';

import { useCallback, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import { FabricJSCanvas } from '@rekorder.io/canvas';
import { theme } from '@rekorder.io/ui';

import { toolbar } from '../store/toolbar';
import { editor } from '../store/editor';

const EditorAreaCSS = css.resolve`
  .rekorder-editor-area {
    inset: 0;
    position: fixed;
    z-index: ${theme.zIndex(1)};
  }

  .rekorder-editor-area[data-state='enabled'] {
    pointer-events: all;
  }

  .rekorder-editor-area[data-state='disabled'] {
    pointer-events: none;
  }

  .rekorder-editor-canvas {
    width: 100%;
    height: 100%;
  }
`;

const EditorArea = observer(() => {
  const workspace$ = useRef<HTMLDivElement>(null);

  const state = toolbar.actionbarState === 'draw' ? 'enabled' : 'disabled';

  const handleLoad = useCallback(
    (canvas: fabric.Canvas) => {
      if (!workspace$.current) return;
      editor.initialize(canvas, workspace$.current);
      editor.setupFreeDrawingBrush();
      editor.toggleFreeDrawingMode(true);
    },
    [workspace$]
  );

  useEffect(() => {
    return () => {
      editor.dispose();
    };
  }, []);

  return (
    <div ref={workspace$} data-state={state} className={clsx(EditorAreaCSS.className, 'rekorder-editor-area')}>
      {EditorAreaCSS.styles}
      <FabricJSCanvas onLoad={handleLoad} className={clsx(EditorAreaCSS.className, 'rekorder-editor-canvas')} />
    </div>
  );
});

export { EditorArea };
