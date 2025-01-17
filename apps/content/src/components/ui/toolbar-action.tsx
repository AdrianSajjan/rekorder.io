import * as React from 'react';

import css from 'styled-jsx/css';
import clsx from 'clsx';

import { ResolvedStyle, theme, Tooltip } from '@rekorder.io/ui';
import { Slot } from '@radix-ui/react-slot';
import { shadowRootElementById } from '../../lib/utils';

interface ToolbarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  asChild?: boolean;
  actionbarIndicator?: boolean;
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
    background-color: ${theme.alpha(theme.colors.accent.dark, 0.2)};
  }

  .toolbar-action:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toolbar-action:focus-visible {
    outline: none;
    box-shadow: ${theme.ring({ ring: { width: 2, color: theme.alpha(theme.colors.primary.main, 0.4) } })};
  }

  .toolbar-action[data-state='on'],
  .toolbar-action[data-state='open'],
  .toolbar-action[aria-pressed='true'],
  .toolbar-action[aria-checked='true'] {
    background-color: ${theme.colors.primary.dark};
    color: ${theme.colors.primary.text};
  }
`;

function ToolbarAction({ tooltip, className, children, actionbarIndicator, asChild, ...props }: ToolbarActionProps) {
  const Component = asChild ? Slot : 'button';

  return (
    <React.Fragment>
      <ResolvedStyle>{ToolbarActionCSS}</ResolvedStyle>
      {tooltip ? (
        <Tooltip content={tooltip} arrow={false} sideOffset={16} portal={shadowRootElementById('rekorder-area')}>
          <div className="tooltip-area" aria-label={tooltip}>
            <Component
              aria-label={tooltip}
              className={clsx(ToolbarActionCSS.className, actionbarIndicator ? 'actionbar-indicator' : null, 'toolbar-action', className)}
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

export { ToolbarAction, ToolbarActionCSS };
