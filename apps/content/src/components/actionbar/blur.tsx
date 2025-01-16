import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';

import { ArrowBendUpLeft, Subtract, TrashSimple } from '@phosphor-icons/react';
import { Divider, ResolvedStyle, theme } from '@rekorder.io/ui';

import { blur } from '../../store/blur';
import { ToolbarAction } from '../ui/toolbar-action';

const BlurActionbarCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .rekorder-blur-actionbar-container {
    pointer-events: auto;
    position: relative;

    display: flex;
    align-items: center;
    width: fit-content;

    gap: ${theme.space(1)};
    font-family: ${theme.fonts.default};
  }

  .rekorder-blur-actionbar-divider {
    width: 1px !important;
    height: ${theme.space(6)} !important;
    background-color: ${theme.alpha(theme.colors.borders.input, 0.3)} !important;

    margin-left: ${theme.space(2)};
    margin-right: ${theme.space(2)};
  }
`;

const BlurActionbar = observer(() => {
  return (
    <Fragment>
      <ResolvedStyle>{BlurActionbarCSS}</ResolvedStyle>
      <div className={clsx(BlurActionbarCSS.className, 'rekorder-blur-actionbar-container')}>
        <ToolbarAction data-state="on">
          <Subtract size={16} weight="fill" />
        </ToolbarAction>
        <Divider orientation="vertical" className={clsx(BlurActionbarCSS.className, 'rekorder-blur-actionbar-divider')} />
        <ToolbarAction tooltip="Undo last blur" disabled={!blur.canUndo} onClick={blur.undo}>
          <ArrowBendUpLeft size={16} weight="bold" />
        </ToolbarAction>
        <ToolbarAction tooltip="Clear all blurs" onClick={blur.clear}>
          <TrashSimple size={16} weight="bold" />
        </ToolbarAction>
      </div>
    </Fragment>
  );
});

export { BlurActionbar };
