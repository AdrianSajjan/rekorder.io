import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { Cursor } from '@phosphor-icons/react';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { Divider, ResolvedStyle, theme } from '@rekorder.io/ui';

import { ToolbarAction } from '../ui/toolbar-action';
import { CursorClickIcon } from '../icons/cursor-click';
import { CursorHighlightIcon } from '../icons/cursor-highlight';
import { CursorSpotlightIcon } from '../icons/cursor-spotlight';
import { cursor, CursorMode } from '../../store/cursor';

const CursorActionbarCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .rekorder-cursor-actionbar-container {
    pointer-events: auto;
    position: relative;

    display: flex;
    align-items: center;
    width: fit-content;

    gap: ${theme.space(1)};
    border-radius: ${theme.space(3)};
    font-family: ${theme.fonts.default};
  }

  .rekorder-cursor-actionbar-divider {
    width: 1px !important;
    height: ${theme.space(6)} !important;
    background-color: ${theme.alpha(theme.colors.borders.input, 0.3)} !important;

    margin-left: ${theme.space(2)};
    margin-right: ${theme.space(2)};
  }
`;

const CursorActionbar = observer(() => {
  const handleChange = (value: string) => {
    cursor.update(value as CursorMode);
  };

  return (
    <Fragment>
      <ResolvedStyle>{CursorActionbarCSS}</ResolvedStyle>

      <ToggleGroup
        type="single"
        value={cursor.mode}
        onValueChange={handleChange}
        className={clsx(CursorActionbarCSS.className, 'rekorder-cursor-actionbar-container')}
      >
        <ToolbarAction asChild tooltip="Default cursor">
          <ToggleGroupItem value="default-cursor">
            <Cursor size={16} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
        <Divider orientation="vertical" className={clsx(CursorActionbarCSS.className, 'rekorder-cursor-actionbar-divider')} />
        <ToolbarAction asChild tooltip="Highlight click">
          <ToggleGroupItem value="highlight-click">
            <CursorClickIcon height={16} width={16} />
          </ToggleGroupItem>
        </ToolbarAction>
        <ToolbarAction asChild tooltip="Highlight cursor">
          <ToggleGroupItem value="highlight-cursor">
            <CursorHighlightIcon height={16} width={16} />
          </ToggleGroupItem>
        </ToolbarAction>
        <ToolbarAction asChild tooltip="Spotlight cursor">
          <ToggleGroupItem value="spotlight-cursor">
            <CursorSpotlightIcon height={16} width={16} />
          </ToggleGroupItem>
        </ToolbarAction>
      </ToggleGroup>
    </Fragment>
  );
});

export { CursorActionbar };
