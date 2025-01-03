import clsx from 'clsx';
import css from 'styled-jsx/css';

import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { Divider, theme } from '@rekorder.io/ui';
import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';

import {
  ArrowBendUpLeft,
  ArrowBendUpRight,
  ArrowCounterClockwise,
  ArrowUp,
  Circle,
  Cursor,
  Rectangle,
  Eraser,
  Highlighter,
  PaintBucket,
  PencilSimple,
  TextT,
  TrashSimple,
  Triangle,
} from '@phosphor-icons/react';

import { Actionbar } from './actionbar';
import { ShapesActionbar } from './shapes';

import { ColorPicker } from '../ui/color-picker';
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

    height: ${theme.space(11)};
    border-radius: ${theme.space(3)};
    padding: ${theme.space(2)} ${theme.space(3)};
  }

  .rekorder-drawing-actionbar-group {
    display: flex;
    align-items: center;
    gap: ${theme.space(0.5)};
  }

  .rekorder-drawing-actionbar-divider {
    height: ${theme.space(6)} !important;
    margin-left: ${theme.space(2)};
    margin-right: ${theme.space(2)};
  }

  .rekorder-drawing-actionbar-color {
    width: ${theme.space(4)};
    height: ${theme.space(4)};
    border-radius: ${theme.space(4)};
  }

  .rekorder-drawing-actionbar-width-icon {
    display: flex;
    gap: 2px;
  }

  .rekorder-drawing-actionbar-width-icon span {
    height: ${theme.space(4)};
    background-color: ${theme.colors.accent.main};
  }

  .rekorder-drawing-actionbar-width-icon span:nth-child(1) {
    width: 1px;
  }

  .rekorder-drawing-actionbar-width-icon span:nth-child(2) {
    width: 2px;
  }

  .rekorder-drawing-actionbar-width-icon span:nth-child(3) {
    width: 3px;
  }
`;

const toolbarContainer = document.getElementById('rekorder-toolbar') as HTMLElement;

const ShapeComponents = {
  rectangle: <Rectangle size={16} weight="bold" />,
  triangle: <Triangle size={16} weight="bold" />,
  circle: <Circle size={16} weight="bold" />,
};

const EditorActionbar = observer(() => {
  const handleValueChange = (value: string) => {
    editor.toggleDrawingMode(value as EditorMode);
  };

  return (
    <Fragment>
      {DrawingActionbarCSS.styles}
      <div className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-container')}>
        <ToggleGroup
          type="single"
          value={editor.mode}
          onValueChange={handleValueChange}
          className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-group')}
        >
          <ToolbarAction asChild tooltip="Delete objects">
            <ToggleGroupItem value="delete">
              <TrashSimple size={16} weight="bold" />
            </ToggleGroupItem>
          </ToolbarAction>
          <ToolbarAction asChild tooltip="Select objects">
            <ToggleGroupItem value="select">
              <Cursor size={16} weight="bold" />
            </ToggleGroupItem>
          </ToolbarAction>
          <Divider orientation="vertical" className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-divider')} />
          <ToolbarAction asChild tooltip="Eraser">
            <ToggleGroupItem value="eraser">
              <Eraser size={16} weight="bold" />
            </ToggleGroupItem>
          </ToolbarAction>
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
          <Actionbar indicator="arrow" content={<ShapesActionbar />} container={toolbarContainer}>
            <ToolbarAction asChild tooltip="Shapes">
              <ToggleGroupItem value="shapes">{ShapeComponents[editor.shape]}</ToggleGroupItem>
            </ToolbarAction>
          </Actionbar>
          <ToolbarAction asChild tooltip="Text">
            <ToggleGroupItem value="text">
              <TextT size={16} weight="bold" />
            </ToggleGroupItem>
          </ToolbarAction>
          <ToolbarAction asChild tooltip="Arrow">
            <ToggleGroupItem value="arrow">
              <ArrowUp size={16} weight="bold" />
            </ToggleGroupItem>
          </ToolbarAction>
        </ToggleGroup>
        <Divider orientation="vertical" className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-divider')} />
        <div className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-group')}>
          <ColorPicker color={editor.color} onChange={editor.updateColor}>
            <ToolbarAction tooltip="Color picker">
              <div className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-color')} style={{ background: editor.color }} />
            </ToolbarAction>
          </ColorPicker>
          <ToolbarAction tooltip="Stroke width">
            <div className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-width-icon')}>
              <span className={clsx(DrawingActionbarCSS.className)} />
              <span className={clsx(DrawingActionbarCSS.className)} />
              <span className={clsx(DrawingActionbarCSS.className)} />
            </div>
          </ToolbarAction>
          <ToolbarAction tooltip="Toggle fill">
            <PaintBucket size={16} weight="bold" />
          </ToolbarAction>
        </div>
        <Divider orientation="vertical" className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-divider')} />
        <div className={clsx(DrawingActionbarCSS.className, 'rekorder-drawing-actionbar-group')}>
          <ToolbarAction tooltip="Undo">
            <ArrowBendUpLeft size={16} weight="bold" />
          </ToolbarAction>
          <ToolbarAction tooltip="Redo">
            <ArrowBendUpRight size={16} weight="bold" />
          </ToolbarAction>
          <ToolbarAction tooltip="Clear canvas" onClick={editor.clearCanvas}>
            <ArrowCounterClockwise size={16} weight="bold" />
          </ToolbarAction>
        </div>
      </div>
    </Fragment>
  );
});

export { EditorActionbar };
