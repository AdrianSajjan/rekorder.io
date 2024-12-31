import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Popover, PopoverContent, PopoverProps, PopoverTrigger } from '@radix-ui/react-popover';
import { animations, theme } from '@rekorder.io/ui';

interface ActionbarProps extends PopoverProps {
  content: React.ReactNode;
}

const ActionbarCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .content {
    position: relative;
    z-index: ${theme.zIndex(50)};
    box-shadow: ${theme.shadow().xl};

    border-radius: ${theme.space(3)};
    background-color: ${theme.colors.core.white};
    border: 1px solid ${theme.colors.borders.input};

    mask: radial-gradient(circle farthest-side at center 67px, transparent 28px, #000000 20px 100%) 50% 50%/100% 100% no-repeat;
  }

  .content[data-state='open'] {
    animation-name: ${animations['zoom-in-fade-in']};
    animation-timing-function: ease-out;
    animation-duration: 300ms;
  }

  .content[data-state='closed'] {
    animation-name: ${animations['zoom-out-fade-out']};
    animation-timing-function: ease-out;
    animation-duration: 200ms;
  }
`;

export function Actionbar({ children, content, ...props }: ActionbarProps) {
  return (
    <Popover {...props}>
      {ActionbarCSS.styles}
      <PopoverTrigger asChild>
        <div className="popover-area">{children}</div>
      </PopoverTrigger>
      <PopoverContent side="top" sideOffset={14} align="center" className={clsx(ActionbarCSS.className, 'content')}>
        {content}
      </PopoverContent>
    </Popover>
  );
}
