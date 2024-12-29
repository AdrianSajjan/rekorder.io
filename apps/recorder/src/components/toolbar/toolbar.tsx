import clsx from 'clsx';
import Draggable from 'react-draggable';
import css from 'styled-jsx/css';

import { DotsSixVertical } from '@phosphor-icons/react';
import { Fragment, useRef } from 'react';

import { useWindowDimensions } from '@rekorder.io/hooks';
import { theme, Tooltip } from '@rekorder.io/ui';

import { SAFE_AREA_PADDING } from '../../constants/layout';
import { measureElement } from '../../lib/utils';

import { ToolbarActionbarControls } from './actionbar';
import { ToolbarRecordTimer } from './timer';
import { ToolbarRecordingControls } from './playback';

const PluginToolbarCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .toolbar {
    position: absolute;
    pointer-events: auto;
    font-family: ${theme.fonts.default};
    background-color: ${theme.colors.core.white};

    width: fit-content;
    display: flex;
    align-items: center;

    height: ${theme.space(13)};
    border-radius: ${theme.space(4)};
    box-shadow: ${theme.shadow().md};

    padding-top: ${theme.space(2)};
    padding-bottom: ${theme.space(2)};
  }

  .toolbar > * {
    border-right: 1.5px solid ${theme.colors.borders.input};
  }

  .toolbar > *:last-child {
    border-right: none;
  }

  .toolbar-controls {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: ${theme.space(1)};
    padding-left: ${theme.space(3)};
    padding-right: ${theme.space(3)};
  }

  .toolbar-controls.toolbar-handle {
    cursor: grab;
  }

  .toolbar-controls.toolbar-handle:active {
    cursor: grabbing;
  }

  .toolbar-controls.toolbar-timer {
    padding-left: ${theme.space(5)};
    padding-right: ${theme.space(5)};
  }
`;

function PluginToolbar() {
  const toolbar$ = useRef<HTMLDivElement>(null!);

  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { height: toolbarHeight, width: toolbarWidth } = measureElement(toolbar$.current, { height: 40, width: 200 });

  const defaultPosition = {
    x: SAFE_AREA_PADDING,
    y: screenHeight - SAFE_AREA_PADDING - toolbarHeight,
  };

  const bounds = {
    top: SAFE_AREA_PADDING,
    left: SAFE_AREA_PADDING,
    right: screenWidth - SAFE_AREA_PADDING - toolbarWidth,
    bottom: screenHeight - SAFE_AREA_PADDING - toolbarHeight,
  };

  return (
    <Fragment>
      {PluginToolbarCSS.styles}
      <Draggable nodeRef={toolbar$} handle="#toolbar-handle" defaultPosition={defaultPosition} bounds={bounds}>
        <article ref={toolbar$} className={clsx(PluginToolbarCSS.className, 'toolbar')}>
          <Tooltip.Provider disableHoverableContent delayDuration={500}>
            <div id="toolbar-handle" className={clsx(PluginToolbarCSS.className, 'toolbar-controls toolbar-handle')}>
              <DotsSixVertical weight="bold" size={20} color={theme.colors.accent.main} />
            </div>
            <ToolbarRecordTimer className={clsx(PluginToolbarCSS.className, 'toolbar-controls toolbar-timer')} />
            <ToolbarRecordingControls className={clsx(PluginToolbarCSS.className, 'toolbar-controls')} />
            <ToolbarActionbarControls className={clsx(PluginToolbarCSS.className, 'toolbar-controls')} />
          </Tooltip.Provider>
        </article>
      </Draggable>
    </Fragment>
  );
}

export { PluginToolbar };
