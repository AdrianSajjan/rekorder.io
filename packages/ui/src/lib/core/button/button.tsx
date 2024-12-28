import clsx from 'clsx';
import css from 'styled-jsx/css';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { theme } from '../../theme';

interface Button extends React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>> {
  Icon: typeof ButtonIcon;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'error' | 'accent' | 'success' | 'warning' | 'info';
  size?: 'medium' | 'small' | 'large';
  asChild?: boolean;
}

const ButtonRootCSS = css.resolve`
  @property --gradient-form {
    syntax: '<color>';
    initial-value: rgba(255, 255, 255, 0.15);
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
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.space(3)};

    border: 1px solid;
    border-image-source: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
    background-image: linear-gradient(to bottom, var(--gradient-form), rgba(255, 255, 255, 0));

    cursor: pointer;
    font-weight: 500;
    font-family: ${theme.fonts.default};
    transition: --gradient-form 200ms ease-in-out;
  }
  .button:hover {
    --gradient-form: rgba(255, 255, 255, 0.25);
  }

  .button.primary {
    color: ${theme.colors.primary.text};
    background-color: ${theme.colors.primary.main};
    box-shadow: 0px 0px 0px 1px ${theme.colors.primary.main}, 0px 1px 2px 0px rgb(15, 20, 30, 0.25);
  }
  .button.error {
    color: ${theme.colors.destructive.text};
    background-color: ${theme.colors.destructive.main};
    box-shadow: 0px 0px 0px 1px ${theme.colors.destructive.main}, 0px 1px 2px 0px rgb(15, 20, 30, 0.25);
  }
  .button.accent {
    color: ${theme.colors.accent.text};
    background-color: ${theme.colors.accent.light};
    box-shadow: 0px 0px 0px 1px ${theme.colors.accent.light}, 0px 1px 2px 0px rgb(15, 20, 30, 0.25);
  }
  .button.success {
    color: ${theme.colors.success.text};
    background-color: ${theme.colors.success.main};
    box-shadow: 0px 0px 0px 1px ${theme.colors.success.main}, 0px 1px 2px 0px rgb(15, 20, 30, 0.25);
  }
  .button.warning {
    color: ${theme.colors.warning.text};
    background-color: ${theme.colors.warning.main};
    box-shadow: 0px 0px 0px 1px ${theme.colors.warning.main}, 0px 1px 2px 0px rgb(15, 20, 30, 0.25);
  }
  .button.info {
    color: ${theme.colors.info.text};
    background-color: ${theme.colors.info.main};
    box-shadow: 0px 0px 0px 1px ${theme.colors.info.main}, 0px 1px 2px 0px rgb(15, 20, 30, 0.25);
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
  ({ asChild, children, variant = 'primary', size = 'medium', className, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : 'button';

    return (
      <React.Fragment>
        {ButtonRootCSS.styles}
        <Component
          ref={forwardedRef}
          className={clsx(ButtonRootCSS.className, 'button', variant, size, className)}
          {...rest}
        >
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

export { ButtonRoot as Button };
