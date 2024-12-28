import css from 'styled-jsx/css';
import clsx from 'clsx';

import * as React from 'react';
import { theme, Tooltip } from '@rekorder.io/ui';

interface ToolbarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
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
    justify-content: center;
    align-items: center;

    width: ${theme.space(8)};
    height: ${theme.space(8)};

    cursor: pointer;
    border-radius: 100%;
    background-color: transparent;
    transition: background-color 300ms ease;
  }

  .toolbar-action:hover {
    background-color: ${theme.colors.background.main};
  }
`;

function ToolbarAction({ tooltip, className, children, ...props }: ToolbarActionProps) {
  return tooltip ? (
    <React.Fragment>
      {ToolbarActionCSS.styles}
      <Tooltip content={tooltip} arrow={false} portal={false} sideOffset={12}>
        <button className={clsx(ToolbarActionCSS.className, 'toolbar-action', className)} {...props}>
          {children}
        </button>
      </Tooltip>
    </React.Fragment>
  ) : (
    <React.Fragment>
      {ToolbarActionCSS.styles}
      <button className={clsx(ToolbarActionCSS.className, 'toolbar-action', className)} {...props}>
        {children}
      </button>
    </React.Fragment>
  );
}

export { ToolbarAction };
