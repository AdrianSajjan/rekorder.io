import clsx from 'clsx';
import Draggable from 'react-draggable';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
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

  .rekorder-toolbar {
    position: absolute;
    pointer-events: auto;
    font-family: ${theme.fonts.default};
    background-color: ${theme.colors.core.white};

    width: fit-content;
    display: flex;
    align-items: center;

    height: ${theme.space(11)};
    border-radius: ${theme.space(3)};
    border: 1px solid ${theme.colors.borders.input};
    box-shadow: ${theme.shadow(theme.alpha(theme.colors.accent.light, 0.1)).xl};

    padding-top: ${theme.space(2)};
    padding-bottom: ${theme.space(2)};
  }

  .rekorder-toolbar > * {
    border-right: 1.5px solid ${theme.colors.borders.input};
  }

  .rekorder-toolbar > *:last-child {
    border-right: none;
  }

  .rekorder-toolbar-controls {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: ${theme.space(0.5)};
    padding-left: ${theme.space(3)};
    padding-right: ${theme.space(3)};
  }

  .rekorder-toolbar-controls.rekorder-toolbar-handle {
    cursor: grab;
  }

  .rekorder-toolbar-controls.rekorder-toolbar-handle:active {
    cursor: grabbing;
  }

  .rekorder-toolbar-controls.rekorder-toolbar-timer {
    padding-left: ${theme.space(5)};
    padding-right: ${theme.space(5)};
  }
`;

const PluginToolbar = observer(() => {
  const drag = useDragControls<HTMLDivElement>({ position: 'bottom-left', dimension: { height: 40, width: 200 } });

  return (
    <Fragment>
      {PluginToolbarCSS.styles}
      <Draggable nodeRef={drag.ref} bounds={drag.bounds} handle="#rekorder-toolbar-handle" position={drag.position} onStop={drag.onChangePosition}>
        <article ref={drag.ref} id="rekorder-toolbar" className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar')}>
          <Tooltip.Provider disableHoverableContent delayDuration={500}>
            <div id="rekorder-toolbar-handle" className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-controls rekorder-toolbar-handle')}>
              <DotsSixVertical weight="bold" size={20} color={theme.colors.accent.main} />
            </div>
            <ToolbarRecordTimer className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-controls rekorder-toolbar-timer')} />
            <ToolbarRecordingControls className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-controls')} />
            <ToolbarActionbarControls className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-controls')} />
          </Tooltip.Provider>
        </article>
      </Draggable>
    </Fragment>
  );
});

export { PluginToolbar };
