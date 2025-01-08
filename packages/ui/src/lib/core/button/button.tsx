import clsx from 'clsx';
import css from 'styled-jsx/css';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { theme } from '../../theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: 'medium' | 'small' | 'large' | 'icon';
  variant?: 'solid' | 'light' | 'outline' | 'ghost' | 'fancy';
  color?: 'primary' | 'secondary' | 'error' | 'accent' | 'success' | 'warning' | 'info';
}

const ButtonCSS = css.resolve`
  @property --gradient-form {
    syntax: '<color>';
    initial-value: rgba(255, 255, 255, 0.2);
    inherits: false;
  }

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
    border: unset;
  }

  .rekorder-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.space(3)};

    cursor: pointer;
    font-weight: 400;
    font-family: ${theme.fonts.default};
    transition: background-color 200ms ease-in-out;
  }

  .rekorder-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .rekorder-button.rekorder-ghost,
  .rekorder-button.rekorder-outline {
    background-color: transparent;
  }
  .rekorder-button.rekorder-fancy {
    border: 1px solid;
    border-image-source: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
    background-image: linear-gradient(to bottom, var(--gradient-form), rgba(255, 255, 255, 0));
    box-shadow: 0px 0px 0px 1px var(--fancy-shadow-color), 0px 1px 2px 0px rgb(15, 20, 30, 0.25);
    transition: --gradient-form 200ms ease-in-out, box-shadow 200ms ease-in-out;
  }

  .rekorder-button.rekorder-solid.rekorder-primary {
    color: ${theme.colors.primary.text};
    background-color: ${theme.colors.primary.main};
  }
  .rekorder-button.rekorder-solid.rekorder-error {
    color: ${theme.colors.destructive.text};
    background-color: ${theme.colors.destructive.main};
  }
  .rekorder-button.rekorder-solid.rekorder-secondary {
    color: ${theme.colors.core.white};
    background-color: ${theme.colors.core.black};
  }
  .rekorder-button.rekorder-solid.rekorder-accent {
    color: ${theme.colors.accent.text};
    background-color: ${theme.colors.accent.light};
  }
  .rekorder-button.rekorder-solid.rekorder-success {
    color: ${theme.colors.success.text};
    background-color: ${theme.colors.success.main};
  }
  .rekorder-button.rekorder-solid.rekorder-warning {
    color: ${theme.colors.warning.text};
    background-color: ${theme.colors.warning.main};
  }
  .rekorder-button.rekorder-solid.rekorder-info {
    color: ${theme.colors.info.text};
    background-color: ${theme.colors.info.main};
  }

  .rekorder-button.rekorder-solid.rekorder-primary:hover {
    background-color: ${theme.colors.primary.dark};
  }
  .rekorder-button.rekorder-solid.rekorder-error:hover {
    background-color: ${theme.colors.destructive.dark};
  }
  .rekorder-button.rekorder-solid.rekorder-accent:hover {
    background-color: ${theme.colors.accent.dark};
  }
  .rekorder-button.rekorder-solid.rekorder-success:hover {
    background-color: ${theme.colors.success.dark};
  }
  .rekorder-button.rekorder-solid.rekorder-warning:hover {
    background-color: ${theme.colors.warning.dark};
  }
  .rekorder-button.rekorder-solid.rekorder-info:hover {
    background-color: ${theme.colors.info.dark};
  }

  .rekorder-button.rekorder-light.rekorder-primary {
    color: ${theme.colors.primary.main};
    background-color: ${theme.alpha(theme.colors.primary.main, 0.1)};
  }
  .rekorder-button.rekorder-light.rekorder-error {
    color: ${theme.colors.destructive.main};
    background-color: ${theme.alpha(theme.colors.destructive.main, 0.1)};
  }
  .rekorder-button.rekorder-light.rekorder-accent {
    color: ${theme.colors.accent.text};
    background-color: ${theme.alpha(theme.colors.accent.main, 0.2)};
  }
  .rekorder-button.rekorder-light.rekorder-success {
    color: ${theme.colors.success.main};
    background-color: ${theme.alpha(theme.colors.success.main, 0.1)};
  }
  .rekorder-button.rekorder-light.rekorder-warning {
    color: ${theme.colors.warning.main};
    background-color: ${theme.alpha(theme.colors.warning.main, 0.1)};
  }
  .rekorder-button.rekorder-light.rekorder-info {
    color: ${theme.colors.info.main};
    background-color: ${theme.alpha(theme.colors.info.main, 0.1)};
  }

  .rekorder-button.rekorder-light.rekorder-primary:hover {
    background-color: ${theme.alpha(theme.colors.primary.main, 0.2)};
  }
  .rekorder-button.rekorder-light.rekorder-error:hover {
    background-color: ${theme.alpha(theme.colors.destructive.main, 0.2)};
  }
  .rekorder-button.rekorder-light.rekorder-accent:hover {
    background-color: ${theme.alpha(theme.colors.accent.main, 0.3)};
  }
  .rekorder-button.rekorder-light.rekorder-success:hover {
    background-color: ${theme.alpha(theme.colors.success.main, 0.2)};
  }
  .rekorder-button.rekorder-light.rekorder-warning:hover {
    background-color: ${theme.alpha(theme.colors.warning.main, 0.2)};
  }
  .rekorder-button.rekorder-light.rekorder-info:hover {
    background-color: ${theme.alpha(theme.colors.info.main, 0.2)};
  }

  .rekorder-button.rekorder-fancy.rekorder-primary {
    color: ${theme.colors.primary.text};
    background-color: ${theme.colors.primary.main};
    --fancy-shadow-color: ${theme.colors.primary.main};
  }
  .rekorder-button.rekorder-fancy.rekorder-secondary {
    color: ${theme.colors.core.white};
    background-color: ${theme.colors.core.black};
    --fancy-shadow-color: ${theme.colors.core.black};
  }
  .rekorder-button.rekorder-fancy.rekorder-error {
    color: ${theme.colors.destructive.text};
    background-color: ${theme.colors.destructive.main};
    --fancy-shadow-color: ${theme.colors.destructive.main};
  }
  .rekorder-button.rekorder-fancy.rekorder-accent {
    color: ${theme.colors.accent.text};
    background-color: ${theme.colors.accent.light};
    --fancy-shadow-color: ${theme.colors.accent.light};
  }
  .rekorder-button.rekorder-fancy.rekorder-success {
    color: ${theme.colors.success.text};
    background-color: ${theme.colors.success.main};
    --fancy-shadow-color: ${theme.colors.success.main};
  }
  .rekorder-button.rekorder-fancy.rekorder-warning {
    color: ${theme.colors.warning.text};
    background-color: ${theme.colors.warning.main};
    --fancy-shadow-color: ${theme.colors.warning.main};
  }
  .rekorder-button.rekorder-fancy.rekorder-info {
    color: ${theme.colors.info.text};
    background-color: ${theme.colors.info.main};
    --fancy-shadow-color: ${theme.colors.info.main};
  }
  .rekorder-button.rekorder-fancy:hover {
    --gradient-form: rgba(255, 255, 255, 0.3);
  }

  .rekorder-button.rekorder-outline.rekorder-primary {
    color: ${theme.colors.primary.main};
    border: 1px solid ${theme.colors.primary.main};
  }
  .rekorder-button.rekorder-outline.rekorder-error {
    color: ${theme.colors.destructive.main};
    border: 1px solid ${theme.colors.destructive.main};
  }
  .rekorder-button.rekorder-outline.rekorder-accent {
    box-shadow: ${theme.shadow().sm};
    color: ${theme.colors.accent.text};
    border: 1px solid ${theme.colors.borders.input};
  }
  .rekorder-button.rekorder-outline.rekorder-success {
    color: ${theme.colors.success.main};
    border: 1px solid ${theme.colors.success.main};
  }
  .rekorder-button.rekorder-outline.rekorder-warning {
    color: ${theme.colors.warning.main};
    border: 1px solid ${theme.colors.warning.main};
  }
  .rekorder-button.rekorder-outline.rekorder-info {
    color: ${theme.colors.info.main};
    border: 1px solid ${theme.colors.info.main};
  }

  .rekorder-button.rekorder-ghost.rekorder-primary {
    color: ${theme.colors.primary.main};
  }
  .rekorder-button.rekorder-ghost.rekorder-error {
    color: ${theme.colors.destructive.main};
  }
  .rekorder-button.rekorder-ghost.rekorder-accent {
    color: ${theme.colors.accent.text};
  }
  .rekorder-button.rekorder-ghost.rekorder-success {
    color: ${theme.colors.success.main};
  }
  .rekorder-button.rekorder-ghost.rekorder-warning {
    color: ${theme.colors.warning.main};
  }
  .rekorder-button.rekorder-ghost.rekorder-info {
    color: ${theme.colors.info.main};
  }

  .rekorder-button.rekorder-outline.rekorder-primary:hover,
  .rekorder-button.rekorder-ghost.rekorder-primary:hover {
    background-color: ${theme.alpha(theme.colors.primary.main, 0.1)};
  }
  .rekorder-button.rekorder-outline.rekorder-error:hover,
  .rekorder-button.rekorder-ghost.rekorder-error:hover {
    background-color: ${theme.alpha(theme.colors.destructive.main, 0.1)};
  }
  .rekorder-button.rekorder-outline.rekorder-accent:hover,
  .rekorder-button.rekorder-ghost.rekorder-accent:hover {
    background-color: ${theme.alpha(theme.colors.accent.main, 0.1)};
  }
  .rekorder-button.rekorder-outline.rekorder-success:hover,
  .rekorder-button.rekorder-ghost.rekorder-success:hover {
    background-color: ${theme.alpha(theme.colors.success.main, 0.1)};
  }
  .rekorder-button.rekorder-outline.rekorder-warning:hover,
  .rekorder-button.rekorder-ghost.rekorder-warning:hover {
    background-color: ${theme.alpha(theme.colors.warning.main, 0.1)};
  }
  .rekorder-button.rekorder-outline.rekorder-info:hover,
  .rekorder-button.rekorder-ghost.rekorder-info:hover {
    background-color: ${theme.alpha(theme.colors.info.main, 0.1)};
  }

  .rekorder-button:focus-visible {
    outline: none;
  }
  .rekorder-button.rekorder-primary:focus-visible {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.primary.main, 0.5) } })};
  }
  .rekorder-button.rekorder-error:focus-visible {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.destructive.main, 0.5) } })};
  }
  .rekorder-button.rekorder-accent:focus-visible {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.accent.light, 0.5) } })};
  }
  .rekorder-button.rekorder-success:focus-visible {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.success.main, 0.5) } })};
  }
  .rekorder-button.rekorder-warning:focus-visible {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.warning.main, 0.5) } })};
  }
  .rekorder-button.rekorder-info:focus-visible {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.info.main, 0.5) } })};
  }

  .rekorder-button.rekorder-large {
    padding-left: ${theme.space(5.5)};
    padding-right: ${theme.space(5.5)};

    border-radius: ${theme.space(3)};
    height: ${theme.space(11)};
    font-size: 15px;
  }
  .rekorder-button.rekorder-medium {
    padding-left: ${theme.space(5)};
    padding-right: ${theme.space(5)};

    border-radius: ${theme.space(2.5)};
    height: ${theme.space(10)};
    font-size: 14px;
  }
  .rekorder-button.rekorder-small {
    padding-left: ${theme.space(4.5)};
    padding-right: ${theme.space(4.5)};

    height: ${theme.space(9)};
    border-radius: ${theme.space(2)};
    font-size: 14px;
  }

  .rekorder-button.rekorder-icon {
    padding: 0;
    width: ${theme.space(10)};
    height: ${theme.space(10)};
    border-radius: ${theme.space(2.5)};
  }
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, children, color = 'primary', size = 'medium', variant = 'solid', className, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : 'button';

    return (
      <React.Fragment>
        {ButtonCSS.styles}
        <Component
          ref={forwardedRef}
          className={clsx(
            ButtonCSS.className,
            'rekorder-button',
            theme.createClassName(variant),
            theme.createClassName(color),
            theme.createClassName(size),
            className
          )}
          {...rest}
        >
          {children}
        </Component>
      </React.Fragment>
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps };
