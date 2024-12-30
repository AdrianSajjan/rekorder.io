import clsx from 'clsx';
import Draggable from 'react-draggable';
import css from 'styled-jsx/css';

import { Fragment } from 'react';
import { DotsSixVertical } from '@phosphor-icons/react';
import { theme, Tooltip } from '@rekorder.io/ui';

import { ToolbarRecordTimer } from './timer';
import { ToolbarActionbarControls } from './actionbar';
import { ToolbarRecordingControls } from './playback';
import { useDragControls } from '../../hooks/use-drag-controls';

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

    height: ${theme.space(11)};
    border-radius: ${theme.space(3)};
    box-shadow: ${theme.shadow(theme.alpha(theme.colors.accent.light, 0.1)).xl};

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
  const drag = useDragControls<HTMLDivElement>({ position: 'bottom-left', dimension: { height: 40, width: 200 } });

  return (
    <Fragment>
      {PluginToolbarCSS.styles}
      <Draggable nodeRef={drag.ref} bounds={drag.bounds} handle="#toolbar-handle" position={drag.position} onStop={drag.onChangePosition}>
        <article ref={drag.ref} className={clsx(PluginToolbarCSS.className, 'toolbar')}>
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
