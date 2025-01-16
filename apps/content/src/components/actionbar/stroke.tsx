import clsx from 'clsx';
import css from 'styled-jsx/css';

import { theme } from '@rekorder.io/ui';
import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';

import { editor } from '../../store/editor';
import { ToolbarAction } from '../ui/toolbar-action';

const StrokeWidthActionbarCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .rekorder-stroke-width-actionbar {
    pointer-events: auto;
    position: relative;

    display: flex;
    align-items: center;
    width: fit-content;

    gap: ${theme.space(1)};
    font-family: ${theme.fonts.default};
  }
`;

const styles = theme.createStyles({
  width: {
    borderRadius: 1000,
    backgroundColor: theme.colors.borders.input,
  },
});

const strokes = [2, 4, 6, 8, 10, 12, 16, 24].map((value) => ({
  value: String(value),
  icon: <div style={Object.assign({}, styles.width, { height: value, width: value })} />,
}));

const StrokeWidthActionbar = observer(() => {
  const handleChange = (value: string) => {
    if (!isNaN(+value)) {
      editor.updateWidth(+value);
    }
  };

  return (
    <Fragment>
      {StrokeWidthActionbarCSS.styles}
      <ToggleGroup
        type="single"
        value={String(editor.width)}
        onValueChange={handleChange}
        className={clsx(StrokeWidthActionbarCSS.className, 'rekorder-stroke-width-actionbar')}
      >
        {strokes.map((shape) => (
          <ToolbarAction asChild key={shape.value}>
            <ToggleGroupItem value={shape.value}>{shape.icon}</ToggleGroupItem>
          </ToolbarAction>
        ))}
      </ToggleGroup>
    </Fragment>
  );
});

export { StrokeWidthActionbar };
