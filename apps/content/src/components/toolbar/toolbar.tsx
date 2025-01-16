import clsx from 'clsx';
import css from 'styled-jsx/css';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';
import { Fragment } from 'react';
import { DotsSixVertical } from '@phosphor-icons/react';
import { Divider, ResolvedStyle, theme, Tooltip } from '@rekorder.io/ui';

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

    padding: ${theme.space(3)};
    height: ${theme.space(12)};
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
    gap: ${theme.space(1)};
  }

  .rekorder-toolbar-handle {
    cursor: grab;
    display: grid;
    place-items: center;

    height: ${theme.space(8)};
    padding-left: ${theme.space(1)};
    border-radius: ${theme.space(8)};
  }

  .rekorder-toolbar-handle:active {
    cursor: grabbing;
  }

  .rekorder-toolbar-divider {
    width: 1px !important;
    height: ${theme.space(6)} !important;
    margin: 0 ${theme.space(3)} !important;
    background-color: ${theme.alpha(theme.colors.borders.input, 0.3)} !important;
  }
`;

const PluginToolbar = observer(() => {
  const drag = useDragControls<HTMLDivElement>({ position: 'bottom-left', dimension: { height: 40, width: 200 } });

  return (
    <Fragment>
      <ResolvedStyle>{PluginToolbarCSS}</ResolvedStyle>
      <Draggable nodeRef={drag.ref} bounds={drag.bounds} position={drag.position} onStop={drag.onChangePosition}>
        <article ref={drag.ref} id="rekorder-toolbar" className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar')}>
          <Tooltip.Provider disableHoverableContent delayDuration={500}>
            <div id="rekorder-toolbar-handle" className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-controls')}>
              <div className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-handle')}>
                <DotsSixVertical weight="bold" size={20} color={theme.colors.accent.main} />
              </div>
            </div>
            <Divider orientation="vertical" className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-divider')} />
            <ToolbarRecordingControls className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-controls')} />
            <Divider orientation="vertical" className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-divider')} />
            <ToolbarActionbarControls className={clsx(PluginToolbarCSS.className, 'rekorder-toolbar-controls')} />
          </Tooltip.Provider>
        </article>
      </Draggable>
    </Fragment>
  );
});

export { PluginToolbar };
