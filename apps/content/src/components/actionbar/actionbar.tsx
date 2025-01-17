import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Popover, PopoverContent, PopoverPortal, PopoverProps, PopoverTrigger } from '@radix-ui/react-popover';
import { animations, ResolvedStyle, theme } from '@rekorder.io/ui';

interface ActionbarProps extends PopoverProps {
  content: React.ReactNode;
  container?: HTMLElement;
  indicator?: 'mask' | 'arrow';
}

const ActionbarCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .rekorder-actionbar-popover-content {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;

    height: ${theme.space(12)};
    z-index: ${theme.zIndex(50)};
    padding: ${theme.space(3)};

    border-radius: ${theme.space(12)};
    background-color: ${theme.colors.core.jetblack};
  }

  @media (prefers-color-scheme: light) {
    .rekorder-actionbar-popover-content {
      box-shadow: ${theme.ring({ ring: { width: 3, color: theme.alpha(theme.colors.core.white, 0.3) } })};
    }
  }

  @media (prefers-color-scheme: dark) {
    .rekorder-actionbar-popover-content {
      box-shadow: ${theme.ring({ ring: { width: 3, color: theme.alpha(theme.colors.core.white, 0.3) } })};
    }
  }

  .rekorder-actionbar-popover-content[data-state='open'] {
    animation-name: ${animations['slide-up-fade-in']};
    animation-timing-function: ease-out;
    animation-duration: 200ms;
  }

  .rekorder-actionbar-popover-content[data-state='closed'] {
    animation-name: ${animations['slide-down-fade-out']};
    animation-timing-function: ease-out;
    animation-duration: 150ms;
  }
`;

export function Actionbar({ children, content, container, indicator = 'mask', ...props }: ActionbarProps) {
  return (
    <Popover {...props}>
      <ResolvedStyle>{ActionbarCSS}</ResolvedStyle>
      <PopoverTrigger asChild>
        <div className="popover-area">{children}</div>
      </PopoverTrigger>
      <PopoverPortal container={container}>
        <PopoverContent
          side="top"
          align="center"
          sideOffset={20}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={clsx(ActionbarCSS.className, 'rekorder-actionbar-popover-content')}
        >
          {content}
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
