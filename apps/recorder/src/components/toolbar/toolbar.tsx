import clsx from 'clsx';
import Draggable from 'react-draggable';
import css from 'styled-jsx/css';

import { Fragment, useRef } from 'react';
import { DotsSixVertical, Download } from '@phosphor-icons/react';

import { useWindowDimensions } from '@rekorder.io/hooks';
import { theme, Tooltip } from '@rekorder.io/ui';

import { measureElement } from '../../lib/utils';
import { SAFE_AREA_PADDING } from '../../constants/layout';
import { ToolbarAction } from '../ui/toolbar-action';

import { ToolbarRecordTimer } from './timer';
import { ToolbarRecorderPlayback } from './playback';

const PluginToolbarCSS = css.resolve`
  .toolbar {
    position: absolute;
    pointer-events: auto;
    font-family: ${theme.fonts.default};
    background-color: ${theme.colors.core.white};

    width: fit-content;
    display: flex;
    align-items: center;

    border-radius: ${theme.space(2)};
    height: ${theme.space(12)};
    box-shadow: ${theme.shadow().md};
  }

  .toolbar-handle {
    padding-left: ${theme.space(2)};
    padding-right: ${theme.space(2)};
  }

  .toolbar-grab {
    cursor: grab !important;
  }

  .toolbar-grab:active {
    cursor: grabbing !important;
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
            <div id="toolbar-handle" className={clsx(PluginToolbarCSS.className, 'toolbar-handle')}>
              <ToolbarAction className={clsx(PluginToolbarCSS.className, 'toolbar-grab')}>
                <DotsSixVertical weight="bold" size={20} />
              </ToolbarAction>
            </div>
            <ToolbarRecordTimer />
            <div>
              <ToolbarAction tooltip="Download recording">
                <Download weight="fill" size={18} />
              </ToolbarAction>
              <ToolbarRecorderPlayback />
            </div>
          </Tooltip.Provider>
        </article>
      </Draggable>
    </Fragment>
  );
}

export { PluginToolbar };
