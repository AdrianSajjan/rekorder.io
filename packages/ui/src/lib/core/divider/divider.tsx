import clsx from 'clsx';
import { forwardRef, Fragment } from 'react';
import css from 'styled-jsx/css';

import { theme } from '../../theme';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

const DividerCSS = css.resolve`
  .divider.vertical {
    height: 100%;
    width: 1.5px;
    flex-shrink: 0;
    background-color: ${theme.alpha(theme.colors.borders.input, 1)};
  }

  .divider.horizontal {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    width: 100%;
    position: relative;
    font-family: ${theme.fonts.default};
  }

  .divider.horizontal.line {
    height: 1px;
    background-color: ${theme.alpha(theme.colors.borders.input, 1)};
  }

  .divider.horizontal.text {
    font-size: 12px;
    color: ${theme.colors.accent.main};
    gap: ${theme.space(2.5)};
  }

  .divider.horizontal.text::before,
  .divider.horizontal.text::after {
    content: '';
    flex: 1;
    height: 1px;
    width: 100%;
    background-color: ${theme.alpha(theme.colors.borders.input, 1)};
  }
`;

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', children, ...props }, ref) => {
    const mode = children ? 'text' : 'line';
    return (
      <Fragment>
        {DividerCSS.styles}
        <div
          ref={ref}
          role="separator"
          className={clsx(DividerCSS.className, 'divider', orientation, mode, className)}
          {...props}
        >
          {children}
        </div>
      </Fragment>
    );
  }
);

export { Divider, type DividerProps };
