import * as React from 'react';

import css from 'styled-jsx/css';
import clsx from 'clsx';

import { theme, Tooltip } from '@rekorder.io/ui';
import { Slot } from '@radix-ui/react-slot';

interface ToolbarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  asChild?: boolean;
}

const ToolbarActionCSS = css.resolve`
  * {
    box-sizing: border-box;
    margin: 0;
  }

  button {
    all: unset;
  }

  .toolbar-action {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;

    width: ${theme.space(8)};
    height: ${theme.space(8)};

    border-radius: 100%;
    background-color: transparent;
    color: ${theme.colors.text.muted};

    cursor: pointer;
    transition: background-color 250ms ease;
  }

  .toolbar-action:hover {
    background-color: ${theme.colors.background.main};
  }

  .toolbar-action:focus-visible {
    outline: none;
    box-shadow: ${theme.ring({ ring: { width: 2, color: theme.alpha(theme.colors.primary.main, 0.4) } })};
  }
  .toolbar-action[data-state='on'],
  .toolbar-action[aria-pressed='true'],
  .toolbar-action[aria-checked='true'] {
    background-color: ${theme.alpha(theme.colors.primary.main, 0.15)};
    color: ${theme.colors.primary.dark};
  }

  .toolbar-action::before {
    content: '';

    width: 100%;
    height: 50%;
    display: block;
    border-radius: 80px 80px 0% 0%;

    position: absolute;
    z-index: -${theme.zIndex(1)};
    top: -${theme.space(3)};

    border-right: ${theme.space(1)} solid ${theme.colors.core.white};
    border-top: ${theme.space(2)} solid ${theme.colors.core.white};
    border-left: ${theme.space(1)} solid ${theme.colors.core.white};

    opacity: 0;
    background-color: transparent;
    transform: scale(0);
    transition: transform 0.25s ease-out, opacity 0.25s ease-in-out;
  }

  .toolbar-action[data-state='on']::before,
  .toolbar-action[aria-pressed='true']::before,
  .toolbar-action[aria-checked='true']::before {
    transform: scale(1);
    opacity: 1;
  }
`;

function ToolbarAction({ tooltip, className, children, asChild, ...props }: ToolbarActionProps) {
  const Component = asChild ? Slot : 'button';

  return (
    <React.Fragment>
      {ToolbarActionCSS.styles}
      {tooltip ? (
        <Tooltip content={tooltip} arrow={false} portal={false} sideOffset={12}>
          <div className="tooltip-area" aria-label={tooltip}>
            <Component
              aria-label={tooltip}
              className={clsx(ToolbarActionCSS.className, 'toolbar-action', className)}
              {...props}
            >
              {children}
            </Component>
          </div>
        </Tooltip>
      ) : (
        <Component className={clsx(ToolbarActionCSS.className, 'toolbar-action', className)} {...props}>
          {children}
        </Component>
      )}
    </React.Fragment>
  );
}

export { ToolbarAction };
