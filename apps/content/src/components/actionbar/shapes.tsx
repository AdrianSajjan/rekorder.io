import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Circle, Rectangle, Triangle } from '@phosphor-icons/react';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { theme } from '@rekorder.io/ui';
import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';

import { ToolbarAction } from '../ui/toolbar-action';
import { editor, ShapeMode } from '../../store/editor';

const ShapesActionbarCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .rekorder-shapes-actionbar {
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
`;

const shapes = [
  {
    value: 'rectangle',
    tooltip: 'Rectangle',
    icon: <Rectangle size={16} weight="bold" />,
  },
  {
    value: 'triangle',
    tooltip: 'Triangle',
    icon: <Triangle size={16} weight="bold" />,
  },
  {
    value: 'circle',
    tooltip: 'Circle',
    icon: <Circle size={16} weight="bold" />,
  },
];

const ShapesActionbar = observer(() => {
  const handleChange = (value: string) => {
    editor.updateShapeMode(value as ShapeMode);
  };

  return (
    <Fragment>
      {ShapesActionbarCSS.styles}
      <ToggleGroup type="single" value={editor.shape} onValueChange={handleChange} className={clsx(ShapesActionbarCSS.className, 'rekorder-shapes-actionbar')}>
        {shapes.map((shape) => (
          <ToolbarAction asChild key={shape.value} tooltip={shape.tooltip}>
            <ToggleGroupItem value={shape.value}>{shape.icon}</ToggleGroupItem>
          </ToolbarAction>
        ))}
      </ToggleGroup>
    </Fragment>
  );
});

export { ShapesActionbar };
