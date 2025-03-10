'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import clsx from 'clsx';
import css from 'styled-jsx/css';
import { Check, CaretRight, Circle } from '@phosphor-icons/react';

import { theme } from '../../theme';
import { animations } from '../../animations';
import { ResolvedStyle } from '../style/resolved-style';

// Add size context similar to select component
interface IDropdownMenuContext {
  size: 'small' | 'medium' | 'large';
}

const DropdownMenuContext = React.createContext<IDropdownMenuContext | null>(null);

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error('This component must be used within the <DropdownMenu /> component.');
  return context;
}

interface DropdownMenuRootProps extends DropdownMenuPrimitive.DropdownMenuProps, Partial<IDropdownMenuContext> {}

const DropdownMenuCSS = css.resolve`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    font-family: ${theme.fonts.default};
  }

  .rekorder-dropdown-menu-content {
    overflow-y: auto;
    overflow-x: hidden;

    z-index: ${theme.zIndex(50)};
    min-width: ${theme.space(40)};
    max-height: var(--radix-dropdown-menu-content-available-height);
    transform-origin: var(--radix-dropdown-menu-content-transform-origin);

    box-shadow: ${theme.shadow().md};
    background-color: ${theme.colors.core.white};
    border: 1px solid ${theme.colors.borders.input};
    padding: ${theme.space(1.5)} ${theme.space(0)};
  }

  .rekorder-dropdown-menu-content.rekorder-large {
    border-radius: ${theme.space(3)};
  }

  .rekorder-dropdown-menu-content.rekorder-medium {
    border-radius: ${theme.space(3)};
  }

  .rekorder-dropdown-menu-content.rekorder-small {
    border-radius: ${theme.space(2.5)};
  }

  .rekorder-dropdown-menu-content[data-state='open'] {
    animation: ${animations['zoom-in-fade-in']} 250ms ease;
  }

  .rekorder-dropdown-menu-content[data-state='closed'] {
    animation: ${animations['zoom-out-fade-out']} 150ms ease;
  }

  .rekorder-dropdown-menu-subcontent {
    overflow: hidden;
    z-index: ${theme.zIndex(50)};
    min-width: ${theme.space(32)};

    padding: ${theme.space(1.5)};
    box-shadow: ${theme.shadow().lg};
    background-color: ${theme.colors.core.white};
    border: 1px solid ${theme.colors.borders.input};
  }

  .rekorder-dropdown-menu-subcontent.rekorder-large {
    border-radius: ${theme.space(3)};
  }

  .rekorder-dropdown-menu-subcontent.rekorder-medium {
    border-radius: ${theme.space(2.5)};
  }

  .rekorder-dropdown-menu-subcontent.rekorder-small {
    border-radius: ${theme.space(2)};
  }

  .rekorder-dropdown-menu-subcontent[data-state='open'] {
    animation: ${animations['zoom-in-fade-in']} 200ms ease-out;
  }

  .rekorder-dropdown-menu-subcontent[data-state='closed'] {
    animation: ${animations['zoom-out-fade-out']} 150ms ease-out;
  }

  .rekorder-dropdown-menu-item {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: flex-start;

    line-height: 1;
    user-select: none;
    font-weight: 500;

    gap: ${theme.space(2)};
    color: ${theme.colors.background.text};
    transition: background-color 200ms ease-out;
  }

  .rekorder-dropdown-menu-item.rekorder-large {
    font-size: 14px;
    height: ${theme.space(10)};
    padding: 0 ${theme.space(4.5)};
  }

  .rekorder-dropdown-menu-item.rekorder-medium {
    font-size: 14px;
    height: ${theme.space(9)};
    padding: 0 ${theme.space(4.5)};
  }

  .rekorder-dropdown-menu-item.rekorder-small {
    font-size: 12px;
    height: ${theme.space(8)};
    padding: 0 ${theme.space(4)};
  }

  .rekorder-dropdown-menu-item:hover {
    outline: none;
    box-shadow: none;
    background-color: ${theme.colors.background.light};
  }

  .rekorder-dropdown-menu-item:focus {
    outline: none;
    box-shadow: none;
    background-color: ${theme.colors.background.light};
  }

  .rekorder-dropdown-menu-item[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  .rekorder-dropdown-menu-item > svg {
    width: ${theme.space(5)};
    height: ${theme.space(5)};
    flex-shrink: 0;
  }

  .rekorder-dropdown-menu-item-inset {
    padding-left: ${theme.space(8)};
  }

  .rekorder-dropdown-menu-subtrigger {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: default;
    user-select: none;
    line-height: 1;
    font-size: 14px;

    gap: ${theme.space(3)};
    height: ${theme.space(9.5)};
    padding: 0 ${theme.space(3.5)};
    border-radius: ${theme.space(1.5)};

    color: ${theme.colors.background.text};
    transition: background-color 200ms ease-out;
  }

  .rekorder-dropdown-menu-subtrigger.rekorder-small {
    font-size: 12px;
    height: ${theme.space(8)};
    padding: 0 ${theme.space(2.5)};
  }

  .rekorder-dropdown-menu-subtrigger:focus {
    outline: none;
    box-shadow: none;
    background-color: ${theme.colors.background.main};
  }

  .rekorder-dropdown-menu-subtrigger:hover {
    outline: none;
    box-shadow: none;
    background-color: ${theme.colors.background.main};
  }

  .rekorder-dropdown-menu-subtrigger[data-state='open'] {
    background-color: ${theme.colors.background.main};
  }

  .rekorder-dropdown-menu-subtrigger svg {
    flex-shrink: 0;
    width: ${theme.space(4)};
    height: ${theme.space(4)};
  }

  .rekorder-dropdown-menu-subtrigger-inset {
    padding-left: ${theme.space(8)};
  }

  .rekorder-dropdown-menu-checkbox-item {
    position: relative;
    display: flex;
    align-items: center;

    cursor: default;
    user-select: none;
    line-height: 1;
    font-size: 14px;

    height: ${theme.space(9.5)};
    padding: 0 ${theme.space(3.5)} 0 ${theme.space(8)};
    border-radius: ${theme.space(1.5)};

    color: ${theme.colors.background.text};
    transition: background-color 200ms ease-out;
  }

  .rekorder-dropdown-menu-checkbox-item.rekorder-small {
    font-size: 12px;
    height: ${theme.space(8)};
    padding: 0 ${theme.space(2.5)} 0 ${theme.space(7)};
  }

  .rekorder-dropdown-menu-checkbox-item:focus {
    outline: none;
    box-shadow: none;
    background-color: ${theme.colors.background.main};
  }

  .rekorder-dropdown-menu-checkbox-item:hover {
    outline: none;
    box-shadow: none;
    background-color: ${theme.colors.background.main};
  }

  .rekorder-dropdown-menu-checkbox-item[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  .rekorder-dropdown-menu-checkbox-indicator {
    left: ${theme.space(2)};
    height: ${theme.space(5)};
    width: ${theme.space(5)};

    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
  }

  .rekorder-dropdown-menu-radio-item {
    position: relative;
    display: flex;
    align-items: center;

    cursor: default;
    user-select: none;
    line-height: 1;
    font-size: 14px;

    height: ${theme.space(9.5)};
    padding: 0 ${theme.space(3.5)} 0 ${theme.space(8)};
    border-radius: ${theme.space(1.5)};

    color: ${theme.colors.background.text};
    transition: background-color 200ms ease-in-out;
  }

  .rekorder-dropdown-menu-radio-item.rekorder-small {
    font-size: 12px;
    height: ${theme.space(8)};
    padding: 0 ${theme.space(2.5)} 0 ${theme.space(7)};
  }

  .rekorder-dropdown-menu-radio-item:focus {
    outline: none;
    box-shadow: none;
    background-color: ${theme.colors.background.main};
  }

  .rekorder-dropdown-menu-radio-item:hover {
    outline: none;
    box-shadow: none;
    background-color: ${theme.colors.background.main};
  }

  .rekorder-dropdown-menu-radio-item[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  .rekorder-dropdown-menu-radio-indicator {
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;

    left: ${theme.space(2)};
    height: ${theme.space(5)};
    width: ${theme.space(5)};
  }

  .rekorder-dropdown-menu-radio-indicator svg {
    height: ${theme.space(2)};
    width: ${theme.space(2)};
    fill: currentColor;
  }

  .rekorder-dropdown-menu-label {
    font-size: 12px;
    font-weight: 600;
    padding: ${theme.space(2)} ${theme.space(3)};
    color: ${theme.colors.primary.dark};
  }

  .rekorder-dropdown-menu-label-inset {
    padding-left: ${theme.space(8)};
  }

  .rekorder-dropdown-menu-separator {
    height: 1px;
    background-color: ${theme.colors.borders.input};
    margin: ${theme.space(1.5)} 0;
  }

  .rekorder-dropdown-menu-shortcut {
    margin-left: auto;
    font-size: 12px;
    letter-spacing: 0.05em;
    opacity: 0.6;
  }
`;

function DropdownMenuRoot({ size = 'medium', ...props }: DropdownMenuRootProps) {
  return (
    <DropdownMenuContext.Provider value={{ size }}>
      <DropdownMenuPrimitive.Root {...props} />
    </DropdownMenuContext.Provider>
  );
}

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuNested = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuNestedTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => {
  const { size } = useDropdownMenuContext();

  return (
    <React.Fragment>
      <ResolvedStyle>{DropdownMenuCSS}</ResolvedStyle>
      <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-subtrigger', theme.createClassName(size), inset && 'rekorder-dropdown-menu-subtrigger-inset', className)}
        {...props}
      >
        {children}
        <CaretRight className="rekorder-dropdown-menu-subtrigger-caret" />
      </DropdownMenuPrimitive.SubTrigger>
    </React.Fragment>
  );
});
DropdownMenuNestedTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuNestedContent = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.SubContent>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>>(
  ({ className, ...props }, ref) => {
    const { size } = useDropdownMenuContext();

    return (
      <React.Fragment>
        <ResolvedStyle>{DropdownMenuCSS}</ResolvedStyle>
        <DropdownMenuPrimitive.SubContent ref={ref} className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-subcontent', theme.createClassName(size), className)} {...props} />
      </React.Fragment>
    );
  }
);
DropdownMenuNestedContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>>(
  ({ className, sideOffset = 8, ...props }, ref) => {
    const { size } = useDropdownMenuContext();

    return (
      <DropdownMenuPrimitive.Portal>
        <React.Fragment>
          <ResolvedStyle>{DropdownMenuCSS}</ResolvedStyle>
          <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-content', theme.createClassName(size), className)}
            {...props}
          />
        </React.Fragment>
      </DropdownMenuPrimitive.Portal>
    );
  }
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => {
  const { size } = useDropdownMenuContext();

  return (
    <React.Fragment>
      <ResolvedStyle>{DropdownMenuCSS}</ResolvedStyle>
      <DropdownMenuPrimitive.Item
        ref={ref}
        className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-item', theme.createClassName(size), inset && 'rekorder-dropdown-menu-item-inset', className)}
        {...props}
      />
    </React.Fragment>
  );
});
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>>(
  ({ className, children, checked, ...props }, ref) => {
    const { size } = useDropdownMenuContext();

    return (
      <React.Fragment>
        <ResolvedStyle>{DropdownMenuCSS}</ResolvedStyle>
        <DropdownMenuPrimitive.CheckboxItem
          ref={ref}
          className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-checkbox-item', theme.createClassName(size), className)}
          checked={checked}
          {...props}
        >
          <span className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-checkbox-indicator')}>
            <DropdownMenuPrimitive.ItemIndicator>
              <Check />
            </DropdownMenuPrimitive.ItemIndicator>
          </span>
          {children}
        </DropdownMenuPrimitive.CheckboxItem>
      </React.Fragment>
    );
  }
);
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>>(
  ({ className, children, ...props }, ref) => {
    const { size } = useDropdownMenuContext();

    return (
      <React.Fragment>
        <ResolvedStyle>{DropdownMenuCSS}</ResolvedStyle>
        <DropdownMenuPrimitive.RadioItem ref={ref} className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-radio-item', theme.createClassName(size), className)} {...props}>
          <span className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-radio-indicator')}>
            <DropdownMenuPrimitive.ItemIndicator>
              <Circle />
            </DropdownMenuPrimitive.ItemIndicator>
          </span>
          {children}
        </DropdownMenuPrimitive.RadioItem>
      </React.Fragment>
    );
  }
);
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <React.Fragment>
    <ResolvedStyle>{DropdownMenuCSS}</ResolvedStyle>
    <DropdownMenuPrimitive.Label ref={ref} className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-label', inset && 'rekorder-dropdown-menu-label-inset', className)} {...props} />
  </React.Fragment>
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Separator>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>>(
  ({ className, ...props }, ref) => (
    <React.Fragment>
      <ResolvedStyle>{DropdownMenuCSS}</ResolvedStyle>
      <DropdownMenuPrimitive.Separator ref={ref} className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-separator', className)} {...props} />
    </React.Fragment>
  )
);
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <React.Fragment>
      <ResolvedStyle>{DropdownMenuCSS}</ResolvedStyle>
      <span className={clsx(DropdownMenuCSS.className, 'rekorder-dropdown-menu-shortcut', className)} {...props} />
    </React.Fragment>
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuNested,
  DropdownMenuNestedContent,
  DropdownMenuNestedTrigger,
  DropdownMenuRadioGroup,
};
