import clsx from 'clsx';
import css from 'styled-jsx/css';

import { forwardRef, Fragment } from 'react';
import { Slot } from '@radix-ui/react-slot';

import { theme } from '../../theme';
import { ResolvedStyle } from '../style/resolved-style';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  indicator?: 'dot' | 'icon';
  asChild?: boolean;
}

const StatusBadgeCSS = css.resolve`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  button {
    font: inherit;
  }

  .root {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    font-size: 12px;
    font-weight: 500;
    font-family: ${theme.fonts.default};

    height: ${theme.space(6)};
    padding-left: ${theme.space(2)};
    padding-right: ${theme.space(2.5)};
    border-radius: ${theme.space(2)};
  }

  .root:has(.dot) {
    gap: ${theme.space(1.5)};
  }

  .root:has(.icon) {
    gap: ${theme.space(2)};
  }

  .root.default {
    color: ${theme.colors.accent.dark};
    background-color: ${theme.alpha(theme.colors.accent.light, 0.4)};
  }

  .root.success {
    color: ${theme.colors.success.dark};
    background-color: ${theme.alpha(theme.colors.success.light, 0.3)};
  }

  .root.warning {
    color: ${theme.colors.warning.dark};
    background-color: ${theme.alpha(theme.colors.warning.light, 0.3)};
  }

  .root.error {
    color: ${theme.colors.destructive.dark};
    background-color: ${theme.alpha(theme.colors.destructive.light, 0.3)};
  }

  .root.info {
    color: ${theme.colors.info.dark};
    background-color: ${theme.alpha(theme.colors.info.light, 0.3)};
  }

  .dot {
    border-radius: 100%;
    width: ${theme.space(1.25)};
    height: ${theme.space(1.25)};
  }

  .dot.default {
    background-color: ${theme.colors.accent.main};
  }

  .dot.success {
    background-color: ${theme.colors.success.main};
  }

  .dot.warning {
    background-color: ${theme.colors.warning.main};
  }

  .dot.error {
    background-color: ${theme.colors.destructive.main};
  }

  .dot.info {
    background-color: ${theme.colors.info.main};
  }
`;

const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(({ asChild, variant = 'default', indicator = 'dot', children, className, ...props }, ref) => {
  const Component = asChild ? Slot : 'div';

  return (
    <Fragment>
      <ResolvedStyle>{StatusBadgeCSS}</ResolvedStyle>
      <Component ref={ref} className={clsx(StatusBadgeCSS.className, 'root', variant, className)} {...props}>
        {indicator === 'dot' ? (
          <span className={clsx(StatusBadgeCSS.className, 'dot', variant)} aria-hidden="true" />
        ) : (
          <span className={clsx(StatusBadgeCSS.className, 'icon', variant)} aria-hidden="true"></span>
        )}
        <span>{children}</span>
      </Component>
    </Fragment>
  );
});

export { StatusBadge, type StatusBadgeProps };
