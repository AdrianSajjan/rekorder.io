import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Fragment } from 'react/jsx-runtime';
import { observer } from 'mobx-react';
import { Divider, theme } from '@rekorder.io/ui';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';

import { PencilSimple } from '@phosphor-icons/react/dist/ssr';
import { Cursor, Eraser, Highlighter, Rectangle, TextT } from '@phosphor-icons/react';

import { ToolbarAction } from '../ui/toolbar-action';
import { editor, EditorMode } from '../../store/editor';

const DrawingActionbarCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .rekorder-drawing-actionbar-container {
    pointer-events: auto;
    position: relative;
    font-family: ${theme.fonts.default};

    display: flex;
    align-items: center;
    width: fit-content;
    gap: ${theme.space(1)};

    height: ${theme.space(11)};
    border-radius: ${theme.space(3)};
    padding: ${theme.space(2)} ${theme.space(3)};
  }

  .rekorder-drawing-actionbar-divider {
    height: ${theme.space(6)} !important;
    margin-left: ${theme.space(2)};
    margin-right: ${theme.space(2)};
  }
`;

const DrawingActionbar = observer(() => {
  const handleValueChange = (value: string) => {
    editor.toggleDrawingMode(value as EditorMode);
  };

  return (
    <Fragment>
      {DrawingActionbarCSS.styles}
      <ToggleGroup
        type="single"
        value={editor.mode}
        onValueChange={handleValueChange}
        className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-container')}
      >
        <ToolbarAction asChild tooltip="Select">
          <ToggleGroupItem value="select">
            <Cursor size={16} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
        <Divider orientation="vertical" className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-divider')} />
        <ToolbarAction asChild tooltip="Pencil">
          <ToggleGroupItem value="pencil">
            <PencilSimple size={16} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
        <ToolbarAction asChild tooltip="Highlighter">
          <ToggleGroupItem value="highlighter">
            <Highlighter size={16} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
        <ToolbarAction asChild tooltip="Eraser">
          <ToggleGroupItem value="eraser">
            <Eraser size={16} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
        <ToolbarAction asChild tooltip="Rectangle">
          <ToggleGroupItem value="rectangle">
            <Rectangle size={16} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
        <ToolbarAction asChild tooltip="Text">
          <ToggleGroupItem value="text">
            <TextT size={16} weight="bold" />
          </ToggleGroupItem>
        </ToolbarAction>
      </ToggleGroup>
    </Fragment>
  );
});

export { DrawingActionbar };
