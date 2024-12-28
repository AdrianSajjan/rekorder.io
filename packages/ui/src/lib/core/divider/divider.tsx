import clsx from 'clsx';
import { forwardRef, Fragment } from 'react';
import css from 'styled-jsx/css';

import { theme } from '../../theme';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

const DividerCSS = css.resolve`
  .divider {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    width: 100%;
    position: relative;
    font-family: ${theme.fonts.default};
  }

  .divider.line {
    height: 1px;
    background-color: ${theme.alpha(theme.colors.borders.input, 0.6)};
  }

  .divider.text {
    font-size: 12px;
    color: ${theme.colors.accent.main};
    gap: ${theme.space(2.5)};
  }

  .divider.text::before,
  .divider.text::after {
    content: '';
    flex: 1;
    height: 1px;
    width: 100%;
    background-color: ${theme.alpha(theme.colors.borders.input, 0.6)};
  }
`;

const Divider = forwardRef<HTMLDivElement, DividerProps>(({ className, children, ...props }, ref) => {
  const mode = children ? 'text' : 'line';
  return (
    <Fragment>
      {DividerCSS.styles}
      <div ref={ref} role="separator" className={clsx(DividerCSS.className, 'divider', mode, className)} {...props}>
        {children}
      </div>
    </Fragment>
  );
});

export { Divider, type DividerProps };
