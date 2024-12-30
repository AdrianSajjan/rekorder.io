import clsx from 'clsx';
import css from 'styled-jsx/css';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { theme } from '../../theme';

interface Button extends React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>> {
  Icon: typeof ButtonIcon;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'solid' | 'light' | 'outline' | 'ghost' | 'fancy';
  color?: 'primary' | 'error' | 'accent' | 'success' | 'warning' | 'info';
  size?: 'medium' | 'small' | 'large';
}

const ButtonRootCSS = css.resolve`
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
    all: unset;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.space(3)};

    cursor: pointer;
    font-weight: 400;
    font-family: ${theme.fonts.default};
  }

  .button {
    transition: background-color 200ms ease-in-out;
  }
  .button.ghost,
  .button.outline {
    background-color: transparent;
  }
  .button.fancy {
    border: 1px solid;
    border-image-source: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
    background-image: linear-gradient(to bottom, var(--gradient-form), rgba(255, 255, 255, 0));
    box-shadow: 0px 0px 0px 1px var(--fancy-shadow-color), 0px 1px 2px 0px rgb(15, 20, 30, 0.25);
    transition: --gradient-form 200ms ease-in-out, box-shadow 200ms ease-in-out;
  }

  .button.solid.primary {
    color: ${theme.colors.primary.text};
    background-color: ${theme.colors.primary.main};
  }
  .button.solid.error {
    color: ${theme.colors.destructive.text};
    background-color: ${theme.colors.destructive.main};
  }
  .button.solid.accent {
    color: ${theme.colors.accent.text};
    background-color: ${theme.colors.accent.light};
  }
  .button.solid.success {
    color: ${theme.colors.success.text};
    background-color: ${theme.colors.success.main};
  }
  .button.solid.warning {
    color: ${theme.colors.warning.text};
    background-color: ${theme.colors.warning.main};
  }
  .button.solid.info {
    color: ${theme.colors.info.text};
    background-color: ${theme.colors.info.main};
  }

  .button.solid.primary:hover {
    background-color: ${theme.colors.primary.dark};
  }
  .button.solid.error:hover {
    background-color: ${theme.colors.destructive.dark};
  }
  .button.solid.accent:hover {
    background-color: ${theme.colors.accent.dark};
  }
  .button.solid.success:hover {
    background-color: ${theme.colors.success.dark};
  }
  .button.solid.warning:hover {
    background-color: ${theme.colors.warning.dark};
  }
  .button.solid.info:hover {
    background-color: ${theme.colors.info.dark};
  }

  .button.light.primary {
    color: ${theme.colors.primary.main};
    background-color: ${theme.alpha(theme.colors.primary.main, 0.1)};
  }
  .button.light.error {
    color: ${theme.colors.destructive.main};
    background-color: ${theme.alpha(theme.colors.destructive.main, 0.1)};
  }
  .button.light.accent {
    color: ${theme.colors.accent.text};
    background-color: ${theme.alpha(theme.colors.accent.main, 0.2)};
  }
  .button.light.success {
    color: ${theme.colors.success.main};
    background-color: ${theme.alpha(theme.colors.success.main, 0.1)};
  }
  .button.light.warning {
    color: ${theme.colors.warning.main};
    background-color: ${theme.alpha(theme.colors.warning.main, 0.1)};
  }
  .button.light.info {
    color: ${theme.colors.info.main};
    background-color: ${theme.alpha(theme.colors.info.main, 0.1)};
  }

  .button.light.primary:hover {
    background-color: ${theme.alpha(theme.colors.primary.main, 0.2)};
  }
  .button.light.error:hover {
    background-color: ${theme.alpha(theme.colors.destructive.main, 0.2)};
  }
  .button.light.accent:hover {
    background-color: ${theme.alpha(theme.colors.accent.main, 0.3)};
  }
  .button.light.success:hover {
    background-color: ${theme.alpha(theme.colors.success.main, 0.2)};
  }
  .button.light.warning:hover {
    background-color: ${theme.alpha(theme.colors.warning.main, 0.2)};
  }
  .button.light.info:hover {
    background-color: ${theme.alpha(theme.colors.info.main, 0.2)};
  }

  .button.fancy.primary {
    color: ${theme.colors.primary.text};
    background-color: ${theme.colors.primary.main};
    --fancy-shadow-color: ${theme.colors.primary.main};
  }
  .button.fancy.error {
    color: ${theme.colors.destructive.text};
    background-color: ${theme.colors.destructive.main};
    --fancy-shadow-color: ${theme.colors.destructive.main};
  }
  .button.fancy.accent {
    color: ${theme.colors.accent.text};
    background-color: ${theme.colors.accent.light};
    --fancy-shadow-color: ${theme.colors.accent.light};
  }
  .button.fancy.success {
    color: ${theme.colors.success.text};
    background-color: ${theme.colors.success.main};
    --fancy-shadow-color: ${theme.colors.success.main};
  }
  .button.fancy.warning {
    color: ${theme.colors.warning.text};
    background-color: ${theme.colors.warning.main};
    --fancy-shadow-color: ${theme.colors.warning.main};
  }
  .button.fancy.info {
    color: ${theme.colors.info.text};
    background-color: ${theme.colors.info.main};
    --fancy-shadow-color: ${theme.colors.info.main};
  }
  .button.fancy:hover {
    --gradient-form: rgba(255, 255, 255, 0.3);
  }

  .button.outline.primary {
    color: ${theme.colors.primary.main};
    border: 1px solid ${theme.colors.primary.main};
  }
  .button.outline.error {
    color: ${theme.colors.destructive.main};
    border: 1px solid ${theme.colors.destructive.main};
  }
  .button.outline.accent {
    box-shadow: ${theme.shadow().sm};
    color: ${theme.colors.accent.text};
    border: 1px solid ${theme.colors.borders.input};
  }
  .button.outline.success {
    color: ${theme.colors.success.main};
    border: 1px solid ${theme.colors.success.main};
  }
  .button.outline.warning {
    color: ${theme.colors.warning.main};
    border: 1px solid ${theme.colors.warning.main};
  }
  .button.outline.info {
    color: ${theme.colors.info.main};
    border: 1px solid ${theme.colors.info.main};
  }

  .button.ghost.primary {
    color: ${theme.colors.primary.main};
  }
  .button.ghost.error {
    color: ${theme.colors.destructive.main};
  }
  .button.ghost.accent {
    color: ${theme.colors.accent.text};
  }
  .button.ghost.success {
    color: ${theme.colors.success.main};
  }
  .button.ghost.warning {
    color: ${theme.colors.warning.main};
  }
  .button.ghost.info {
    color: ${theme.colors.info.main};
  }

  .button.outline.primary:hover,
  .button.ghost.primary:hover {
    background-color: ${theme.alpha(theme.colors.primary.main, 0.1)};
  }
  .button.outline.error:hover,
  .button.ghost.error:hover {
    background-color: ${theme.alpha(theme.colors.destructive.main, 0.1)};
  }
  .button.outline.accent:hover,
  .button.ghost.accent:hover {
    background-color: ${theme.alpha(theme.colors.accent.main, 0.1)};
  }
  .button.outline.success:hover,
  .button.ghost.success:hover {
    background-color: ${theme.alpha(theme.colors.success.main, 0.1)};
  }
  .button.outline.warning:hover,
  .button.ghost.warning:hover {
    background-color: ${theme.alpha(theme.colors.warning.main, 0.1)};
  }
  .button.outline.info:hover,
  .button.ghost.info:hover {
    background-color: ${theme.alpha(theme.colors.info.main, 0.1)};
  }

  .button:focus {
    outline: none;
  }
  .button.primary:focus {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.primary.main, 0.5) } })};
  }
  .button.error:focus {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.destructive.main, 0.5) } })};
  }
  .button.accent:focus {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.accent.light, 0.5) } })};
  }
  .button.success:focus {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.success.main, 0.5) } })};
  }
  .button.warning:focus {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.warning.main, 0.5) } })};
  }
  .button.info:focus {
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.info.main, 0.5) } })};
  }

  .button.large {
    padding-left: ${theme.space(5.5)};
    padding-right: ${theme.space(5.5)};

    border-radius: ${theme.space(3)};
    height: ${theme.space(11)};
    font-size: 15px;
  }
  .button.medium {
    padding-left: ${theme.space(5)};
    padding-right: ${theme.space(5)};

    border-radius: ${theme.space(2.5)};
    height: ${theme.space(10)};
    font-size: 14px;
  }
  .button.small {
    padding-left: ${theme.space(4.5)};
    padding-right: ${theme.space(4.5)};

    height: ${theme.space(9)};
    border-radius: ${theme.space(2)};
    font-size: 14px;
  }
`;

const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, children, color = 'primary', size = 'medium', variant = 'solid', className, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : 'button';

    return (
      <React.Fragment>
        {ButtonRootCSS.styles}
        <Component ref={forwardedRef} className={clsx(ButtonRootCSS.className, 'button', variant, color, size, className)} {...rest}>
          {children}
        </Component>
      </React.Fragment>
    );
  }
) as Button;

const ButtonIconCSS = css`
  .icon {
    z-index: 10;
    flex-shrink: 0;
    position: relative;
  }

  .icon.medium {
    width: ${theme.space(5)};
    height: ${theme.space(5)};
    margin-inline: -4px;
  }

  .icon.small {
    width: ${theme.space(4)};
    height: ${theme.space(4)};
    margin-inline: -4px;
  }

  .icon.xsmall {
    width: ${theme.space(6)};
    height: ${theme.space(6)};
    margin-inline: -4px;
  }
`;

interface ButtonIconProps extends ButtonProps {
  as?: React.ElementType;
}

function ButtonIcon({ className, size = 'medium', as: Component = 'div', ...rest }: ButtonIconProps) {
  return (
    <React.Fragment>
      <style jsx>{ButtonIconCSS}</style>
      <Component className={clsx('icon', size, className)} {...rest} />
    </React.Fragment>
  );
}

ButtonRoot.Icon = ButtonIcon;
ButtonRoot.displayName = 'Button';
ButtonIcon.displayName = 'ButtonIcon';

export { ButtonRoot as Button, type ButtonProps };
