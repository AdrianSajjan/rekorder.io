import clsx from 'clsx';
import css from 'styled-jsx/css';

import { ArrowUp, LineSegment } from '@phosphor-icons/react';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { ResolvedStyle, theme } from '@rekorder.io/ui';
import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';

import { editor, LineMode } from '../../store/editor';
import { ToolbarAction } from '../ui/toolbar-action';

const LinesActionbarCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .rekorder-lines-actionbar {
    pointer-events: auto;
    position: relative;

    display: flex;
    align-items: center;
    width: fit-content;

    gap: ${theme.space(1)};
    font-family: ${theme.fonts.default};
  }
`;

const lines = [
  {
    value: 'arrow',
    tooltip: 'Arrow',
    icon: <ArrowUp size={16} weight="bold" />,
  },
  {
    value: 'line',
    tooltip: 'Line',
    icon: <LineSegment size={16} weight="bold" />,
  },
];

const LinesActionbar = observer(() => {
  const handleChange = (value: string) => {
    editor.updateLineMode(value as LineMode);
  };

  return (
    <Fragment>
      <ResolvedStyle>{LinesActionbarCSS}</ResolvedStyle>
      <ToggleGroup type="single" value={editor.line} onValueChange={handleChange} className={clsx(LinesActionbarCSS.className, 'rekorder-lines-actionbar')}>
        {lines.map((line) => (
          <ToolbarAction asChild key={line.value} tooltip={line.tooltip}>
            <ToggleGroupItem value={line.value}>{line.icon}</ToggleGroupItem>
          </ToolbarAction>
        ))}
      </ToggleGroup>
    </Fragment>
  );
});

export { LinesActionbar };
