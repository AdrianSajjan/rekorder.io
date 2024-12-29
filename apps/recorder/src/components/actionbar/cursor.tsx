import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Fragment } from 'react/jsx-runtime';
import { Cursor } from '@phosphor-icons/react';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { Divider, theme } from '@rekorder.io/ui';

import { ToolbarAction } from '../ui/toolbar-action';
import { CursorClickIcon } from '../icons/cursor-click';
import { CursorHighlightIcon } from '../icons/cursor-highlight';
import { CursorSpotlightIcon } from '../icons/cursor-spotlight';

const CursorActionbarCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .container {
    pointer-events: auto;
    position: relative;
    font-family: ${theme.fonts.default};

    display: flex;
    align-items: center;
    width: fit-content;
    gap: ${theme.space(1)};

    height: ${theme.space(13)};
    border-radius: ${theme.space(4)};
    padding: ${theme.space(2)} ${theme.space(3)};
  }

  .divider {
    height: ${theme.space(6)} !important;
    margin-left: ${theme.space(2)};
    margin-right: ${theme.space(2)};
  }
`;

export function CursorActionbar() {
  return (
    <Fragment>
      {CursorActionbarCSS.styles}
      <ToggleGroup type="single" className={clsx(CursorActionbarCSS.className, 'container')}>
        <ToolbarAction asChild tooltip="Default cursor">
          <ToggleGroupItem value="draw">
            <Cursor size={18} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
        <Divider orientation="vertical" className={clsx(CursorActionbarCSS.className, 'divider')} />
        <ToolbarAction asChild tooltip="Highlight click">
          <ToggleGroupItem value="highlight-click">
            <CursorClickIcon height={18} width={18} />
          </ToggleGroupItem>
        </ToolbarAction>
        <ToolbarAction asChild tooltip="Highlight cursor">
          <ToggleGroupItem value="highlight-cursor">
            <CursorHighlightIcon height={18} width={18} />
          </ToggleGroupItem>
        </ToolbarAction>
        <ToolbarAction asChild tooltip="Spotlight cursor">
          <ToggleGroupItem value="spotlight-cursor">
            <CursorSpotlightIcon height={18} width={18} />
          </ToggleGroupItem>
        </ToolbarAction>
      </ToggleGroup>
    </Fragment>
  );
}
