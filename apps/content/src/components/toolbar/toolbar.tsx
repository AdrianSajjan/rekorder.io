import clsx from 'clsx';
import css from 'styled-jsx/css';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';
import { Fragment } from 'react';
import { DotsSixVertical } from '@phosphor-icons/react';
import { theme, Tooltip } from '@rekorder.io/ui';

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

    width: fit-content;
    display: flex;
    align-items: center;

    font-family: ${theme.fonts.default};
    background-color: ${theme.colors.core.jetblack};

    height: ${theme.space(12)};
    padding: ${theme.space(3)} 0;
    border-radius: ${theme.space(12)};
  }

  @media (prefers-color-scheme: light) {
    .rekorder-toolbar {
      box-shadow: ${theme.ring({ ring: { width: 3, color: theme.alpha(theme.colors.core.white, 0.3) } })};
    }
  }

  @media (prefers-color-scheme: dark) {
    .rekorder-toolbar {
      box-shadow: ${theme.ring({ ring: { width: 3, color: theme.alpha(theme.colors.core.white, 0.3) } })};
    }
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

  .rekorder-toolbar-controls {
    border-right: 1px solid ${theme.alpha(theme.colors.borders.input, 0.3)};
  }

  .rekorder-toolbar-controls:first-child {
    padding: 0 ${theme.space(2)};
  }

  .rekorder-toolbar-controls:last-child {
    border-right: none;
    padding-right: ${theme.space(3)};
  }

  .rekorder-toolbar-handle {
    cursor: grab;
    display: grid;
    place-items: center;

    width: ${theme.space(8)};
    height: ${theme.space(8)};
    border-radius: ${theme.space(8)};
  }

  .rekorder-toolbar-handle:active {
    cursor: grabbing;
  }

  .rekorder-toolbar-timer {
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
            <div id="rekorder-toolbar-handle" className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-controls')}>
              <div className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-handle')}>
                <DotsSixVertical weight="bold" size={20} color={theme.colors.accent.main} />
              </div>
            </div>
            <ToolbarRecordingControls className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-controls')} />
            <ToolbarActionbarControls className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-controls')} />
          </Tooltip.Provider>
        </article>
      </Draggable>
    </Fragment>
  );
});

export { PluginToolbar };
