import clsx from 'clsx';
import css from 'styled-jsx/css';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { theme } from '../../theme';
import { animations } from '../../animations';
import { AnimationsProvider } from '../animations/provider';

interface Tooltip extends React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<HTMLDivElement>> {
  Provider: typeof TooltipPrimitive.TooltipProvider;
  Root: typeof TooltipPrimitive.Root;
  Trigger: typeof TooltipPrimitive.Trigger;
  Arrow: typeof TooltipPrimitive.Arrow;
  Portal: typeof TooltipPrimitive.Portal;
  Content: typeof TooltipContent;
}

interface TooltipProps
  extends TooltipPrimitive.TooltipProps,
    ITooltopContentProps,
    Pick<TooltipPrimitive.TooltipContentProps, 'side' | 'align' | 'sideOffset' | 'alignOffset'> {
  content?: React.ReactNode;
}

const TooltipCSS = css.resolve`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  .content {
    box-shadow: ${theme.shadow().md};
    border-radius: ${theme.space(2)};
    padding: ${theme.space(2)} ${theme.space(3)};

    font-size: 13px;
    font-family: ${theme.fonts.default};
    z-index: ${theme.zIndex(300)};

    animation-duration: 300ms;
    animation-timing-function: ease-out;
  }

  .content.dark {
    color: ${theme.colors.core.white};
    background-color: ${theme.colors.core.black};
  }

  .content.light {
    color: ${theme.colors.background.text};
    background-color: ${theme.colors.core.white};
    border: 1px solid ${theme.colors.borders.input};
  }

  .content[data-side='top'] {
    animation-name: ${animations['slide-up-fade-in']};
  }

  .content[data-side='right'] {
    animation-name: ${animations['slide-left-fade-in']};
  }

  .content[data-side='bottom'] {
    animation-name: ${animations['slide-down-fade-in']};
  }

  .content[data-side='left'] {
    animation-name: ${animations['slide-right-fade-in']};
  }

  .arrow {
    transform: translateY(-50%) rotate(-45deg);
    clip-path: polygon(0 100%, 0 0, 100% 100%);
    border-bottom-left-radius: ${theme.space(0.5)};
  }

  .content.dark .arrow {
    background-color: ${theme.colors.core.black};
    height: ${theme.space(2)};
    width: ${theme.space(2)};
  }

  .content.light .arrow {
    border: 1px solid ${theme.colors.borders.input};
    background-color: ${theme.colors.core.white};
    height: ${theme.space(2.25)};
    width: ${theme.space(2.25)};
  }
`;

const TooltipRoot = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, arrow, portal, side, sideOffset = 4, align, alignOffset, colorScheme, ...props }, ref) => {
    return (
      <AnimationsProvider>
        {TooltipCSS.styles}
        <TooltipPrimitive.Root {...props}>
          <TooltipPrimitive.Trigger asChild>{props.children}</TooltipPrimitive.Trigger>
          <TooltipContent ref={ref} {...{ arrow, portal, side, align, sideOffset, alignOffset, colorScheme }}>
            {content}
          </TooltipContent>
        </TooltipPrimitive.Root>
      </AnimationsProvider>
    );
  }
) as Tooltip;

interface ITooltopContentProps {
  arrow?: boolean;
  portal?: boolean;
  colorScheme?: 'dark' | 'light';
}

interface TooltipContentProps extends TooltipPrimitive.TooltipContentProps, ITooltopContentProps {}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, arrow = true, portal = true, align = 'center', side = 'top', colorScheme = 'dark', ...props }, ref) => {
    const TooltipPortal = portal ? TooltipPrimitive.Portal : React.Fragment;
    return (
      <TooltipPortal>
        <TooltipPrimitive.Content
          ref={ref}
          side={side}
          className={clsx(TooltipCSS.className, 'content', colorScheme)}
          align={align}
          {...props}
        >
          {children}
          {arrow ? <TooltipArrow /> : null}
        </TooltipPrimitive.Content>
      </TooltipPortal>
    );
  }
);

const TooltipArrow = React.forwardRef<SVGSVGElement, TooltipPrimitive.TooltipArrowProps>((props, ref) => {
  return (
    <TooltipPrimitive.Arrow asChild ref={ref} {...props}>
      <div className={clsx(TooltipCSS.className, 'arrow')} />
    </TooltipPrimitive.Arrow>
  );
});

TooltipRoot.Provider = TooltipPrimitive.TooltipProvider;
TooltipRoot.Root = TooltipPrimitive.Root;
TooltipRoot.Trigger = TooltipPrimitive.Trigger;
TooltipRoot.Portal = TooltipPrimitive.Portal;
TooltipRoot.Arrow = TooltipArrow;
TooltipRoot.Content = TooltipContent;

export { TooltipRoot as Tooltip, type TooltipProps, type TooltipContentProps };
