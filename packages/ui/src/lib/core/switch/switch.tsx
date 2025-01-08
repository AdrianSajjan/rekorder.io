import clsx from 'clsx';
import css from 'styled-jsx/css';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { forwardRef, Fragment } from 'react';
import { theme } from '../../theme';

interface SwitchProps extends SwitchPrimitive.SwitchProps {
  thumb?: SwitchPrimitive.SwitchThumbProps;
  size?: 'small' | 'medium';
}

const SwitchCSS = css.resolve`
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
    display: block;
    flex-shrink: 0;
    border-radius: 999px;
    padding: ${theme.space(0.75)};

    background-color: ${theme.colors.background.dark};
    border: 1px solid ${theme.colors.background.dark};
    transition: background-color 200ms ease, border-color 200ms ease;
  }

  .root.medium {
    width: ${theme.space(10)};
    height: ${theme.space(6)};
  }

  .root.small {
    width: ${theme.space(8)};
    height: ${theme.space(5)};
  }

  .root:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .root:focus-visible {
    outline: none;
    box-shadow: ${theme.ring({ ring: { width: 2, color: theme.alpha(theme.colors.primary.main, 0.4) } })};
  }

  .root:not(:disabled):hover {
    border-color: ${theme.colors.accent.light};
    background-color: ${theme.alpha(theme.colors.accent.main, 0.6)};
  }

  .root:not(:disabled):active {
    --thumb-scale: 0.9;
  }

  .root[data-state='checked'] {
    border-color: ${theme.colors.primary.main} !important;
    background-color: ${theme.colors.primary.main} !important;
  }

  .thumb {
    display: block;
    position: relative;

    border-radius: 100%;
    box-shadow: ${theme.shadow().sm};
    background-color: ${theme.colors.core.white};

    transform: translateX(var(--thumb-x, 0)) scale(var(--thumb-scale, 1));
    transition: transform 200ms ease;
  }

  .thumb.medium {
    width: ${theme.space(4.25)};
    height: ${theme.space(4.25)};
  }

  .thumb.small {
    width: ${theme.space(3.25)};
    height: ${theme.space(3.25)};
  }

  .thumb.medium[data-state='checked'] {
    --thumb-x: ${theme.space(4)};
  }

  .thumb.small[data-state='checked'] {
    --thumb-x: ${theme.space(3)};
  }

  .thumb::before {
    content: '';

    display: flex;
    position: absolute;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    border-radius: 100%;
    transition: background-color 200ms ease;
    background-color: ${theme.colors.background.dark};
  }

  .thumb.medium::before {
    width: ${theme.space(1.5)};
    height: ${theme.space(1.5)};
  }

  .thumb.small::before {
    width: ${theme.space(1)};
    height: ${theme.space(1)};
  }

  .root:not(:disabled):hover .thumb::before {
    background-color: ${theme.alpha(theme.colors.accent.main, 0.6)};
  }

  .root[data-state='checked'] .thumb::before {
    background-color: ${theme.colors.primary.main} !important;
  }
`;

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(({ thumb, size = 'medium', className, ...props }, ref) => (
  <Fragment>
    {SwitchCSS.styles}
    <SwitchPrimitive.Root className={clsx(SwitchCSS.className, 'root', size, className)} ref={ref} {...props}>
      <SwitchPrimitive.Thumb {...thumb} className={clsx(SwitchCSS.className, 'thumb', size, thumb?.className)} />
    </SwitchPrimitive.Root>
  </Fragment>
));

export { Switch };
