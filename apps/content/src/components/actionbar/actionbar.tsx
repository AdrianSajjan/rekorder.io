import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Popover, PopoverArrow, PopoverContent, PopoverPortal, PopoverProps, PopoverTrigger } from '@radix-ui/react-popover';
import { animations, theme } from '@rekorder.io/ui';

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
    position: relative;
    z-index: ${theme.zIndex(50)};

    border-radius: ${theme.space(3)};
    background-color: ${theme.colors.background.light};
    border: 1px solid ${theme.colors.borders.input};
  }

  .rekorder-actionbar-popover-content[data-indicator='mask'] {
    mask: radial-gradient(circle farthest-side at center 67px, transparent 28px, #000000 20px 100%) 50% 50%/100% 100% no-repeat;
  }

  .rekorder-actionbar-popover-arrow {
    transform: translateY(-50%) rotate(-45deg);
    clip-path: polygon(0 100%, 0 0, 100% 100%);
    border-bottom-left-radius: ${theme.space(0.5)};

    border: 1px solid ${theme.colors.borders.input};
    background-color: ${theme.colors.background.light};

    height: ${theme.space(2.25)};
    width: ${theme.space(2.25)};
  }

  .rekorder-actionbar-popover-content[data-state='open'] {
    animation-name: ${animations['zoom-in-fade-in']};
    animation-timing-function: ease-out;
    animation-duration: 300ms;
  }

  .rekorder-actionbar-popover-content[data-state='closed'] {
    animation-name: ${animations['zoom-out-fade-out']};
    animation-timing-function: ease-out;
    animation-duration: 200ms;
  }
`;

export function Actionbar({ children, content, container, indicator = 'mask', ...props }: ActionbarProps) {
  return (
    <Popover {...props}>
      {ActionbarCSS.styles}
      <PopoverTrigger asChild>
        <div className="popover-area">{children}</div>
      </PopoverTrigger>
      <PopoverPortal container={container}>
        <PopoverContent
          side="top"
          align="center"
          data-indicator={indicator}
          className={clsx(ActionbarCSS.className, 'rekorder-actionbar-popover-content')}
          avoidCollisions={false}
          onOpenAutoFocus={(e) => e.preventDefault()}
          sideOffset={indicator === 'arrow' ? 7 : 14}
        >
          {content}
          {indicator === 'arrow' ? (
            <PopoverArrow asChild>
              <div className={clsx(ActionbarCSS.className, 'rekorder-actionbar-popover-arrow')} />
            </PopoverArrow>
          ) : null}
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
