import clsx from 'clsx';
import css from 'styled-jsx/css';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

import { isBoolean, isNil } from 'lodash';
import { CaretDown, CheckCircle } from '@phosphor-icons/react';

import { theme } from '../../theme';
import { animations } from '../../animations';

interface ISelectContext {
  size: 'small' | 'medium' | 'large';
}

const SelectContext = React.createContext<ISelectContext | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('This component must be used within the <Select /> component.');
  return context;
}

interface SelectProps extends SelectPrimitive.SelectProps, Partial<ISelectContext> {}

function SelectRoot({ size = 'medium', ...props }: SelectProps) {
  return (
    <SelectContext.Provider value={{ size }}>
      <SelectPrimitive.Root {...props} />
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends SelectPrimitive.SelectTriggerProps {
  placeholder?: string;
}

const SelectCSS = css.resolve`
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

  .rekorder-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space(4)};

    cursor: pointer;
    font-weight: 400;
    text-align: left;

    font-family: ${theme.fonts.default};
    color: ${theme.colors.background.text};
    background-color: ${theme.colors.core.white};

    box-shadow: ${theme.shadow().xs};
    border: 1px solid ${theme.colors.borders.input};
    transition: background-color 200ms ease-in-out, border-color 200ms ease-in-out;
  }

  .rekorder-trigger[data-placeholder] {
    color: ${theme.colors.accent.dark};
  }

  .rekorder-trigger:hover {
    background-color: ${theme.colors.background.light};
  }

  .rekorder-trigger:focus-visible {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.primary.main, 0.25) } })};
  }

  .rekorder-trigger.rekorder-large {
    height: ${theme.space(11)};
    padding-left: ${theme.space(3.5)};
    padding-right: ${theme.space(3.5)};
    border-radius: ${theme.space(3)};
    font-size: 16px;
  }

  .rekorder-trigger.rekorder-medium {
    height: ${theme.space(10)};
    padding-left: ${theme.space(3.5)};
    padding-right: ${theme.space(3.5)};
    border-radius: ${theme.space(2.5)};
    font-size: 14px;
  }

  .rekorder-trigger.rekorder-small {
    height: ${theme.space(9)};
    padding-left: ${theme.space(3.5)};
    padding-right: ${theme.space(3.5)};
    border-radius: ${theme.space(2)};
    font-size: 14px;
  }

  .rekorder-trigger .rekorder-icon {
    display: inline-flex;
    color: ${theme.colors.accent.main};
  }

  .rekorder-content {
    box-shadow: ${theme.shadow().md};
    min-width: var(--radix-select-trigger-width);
    background-color: ${theme.colors.core.white};

    padding: ${theme.space(1.5)};
    font-family: ${theme.fonts.default};
    border: 1px solid ${theme.colors.borders.input};
    z-index: ${theme.zIndex(100)};
  }

  .rekorder-content[data-state='open'] {
    animation-name: ${animations['slide-down-fade-in']};
    animation-duration: 250ms;
  }

  .rekorder-content.rekorder-large {
    border-radius: ${theme.space(3)};
  }

  .rekorder-content.rekorder-medium {
    border-radius: ${theme.space(2.5)};
  }

  .rekorder-content.rekorder-small {
    border-radius: ${theme.space(2)};
  }

  .rekorder-content .rekorder-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    line-height: 1;
    cursor: pointer;
    font-size: 14px;

    gap: ${theme.space(3)};
    height: ${theme.space(9.5)};
    padding: 0 ${theme.space(3.5)};
    border-radius: ${theme.space(1.5)};

    color: ${theme.colors.background.text};
    transition: background-color 200ms ease-in-out;
  }

  .rekorder-content .rekorder-item:focus-visible {
    outline: none;
    background-color: ${theme.colors.background.main};
  }

  .rekorder-content .rekorder-item:hover {
    outline: none;
    background-color: ${theme.colors.background.main};
  }

  .rekorder-content .rekorder-label {
    font-size: 12px;
    font-weight: 600;
    padding: ${theme.space(2)} ${theme.space(3)};
    color: ${theme.colors.primary.dark};
  }

  .rekorder-content .rekorder-separator {
    height: 1px;
    background-color: ${theme.colors.borders.input};
    margin: ${theme.space(1.5)} 0;
  }

  .rekorder-content .rekorder-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SelectInput = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(({ className, children, placeholder, ...props }, ref) => {
  const { size } = useSelectContext();

  return (
    <React.Fragment>
      {SelectCSS.styles}
      <SelectPrimitive.Trigger ref={ref} className={clsx(SelectCSS.className, 'rekorder-trigger', theme.createClassName(size), className)} {...props}>
        <SelectPrimitive.Value placeholder={placeholder}>{children}</SelectPrimitive.Value>
        <SelectPrimitive.Icon className={clsx(SelectCSS.className, 'rekorder-icon')}>
          <CaretDown size={14} weight="bold" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    </React.Fragment>
  );
});

interface ISelectGroup {
  title: string;
  options: ISelectOption[];
}

interface ISelectOption {
  value: string;
  disabled?: boolean;
  label: React.ReactNode;
}

type SelectOption = ISelectGroup | ISelectOption;

interface SelectContentProps extends SelectPrimitive.SelectContentProps {
  viewport?: React.RefObject<HTMLDivElement>;
  options?: Array<SelectOption>;
  portal?: boolean | null | HTMLElement | DocumentFragment;
}

function isGroup(option: SelectOption): option is ISelectGroup {
  return 'options' in option;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ viewport, options, children, sideOffset = 8, position = 'popper', portal = true, ...props }, ref) => {
    const { size } = useSelectContext();

    const renderOption = React.useCallback(
      (option: SelectOption, index: number) => {
        if (isGroup(option)) {
          return (
            <React.Fragment key={String([option.title, index])}>
              <SelectGroup>
                <SelectLabel>{option.title}</SelectLabel>
                {option.options.map(renderOption)}
              </SelectGroup>
              {!options || index === options.length - 1 ? null : <SelectSeparator />}
            </React.Fragment>
          );
        } else {
          return (
            <SelectItem key={option.value} disabled={option.disabled} value={option.value}>
              {option.label}
            </SelectItem>
          );
        }
      },
      [options]
    );

    const container = isBoolean(portal) || isNil(portal) ? null : portal;

    return (
      <React.Fragment>
        {SelectCSS.styles}
        <SelectPrimitive.Portal container={container}>
          <SelectPrimitive.Content
            className={clsx(SelectCSS.className, 'rekorder-content', theme.createClassName(size))}
            position={position}
            sideOffset={sideOffset}
            ref={ref}
            {...props}
          >
            <SelectPrimitive.ScrollUpButton />
            <SelectPrimitive.Viewport ref={viewport}>{options ? options.map(renderOption) : children}</SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton />
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </React.Fragment>
    );
  }
);

const SelectGroup = React.forwardRef<HTMLDivElement, SelectPrimitive.SelectGroupProps>(({ className, ...props }, ref) => {
  return <SelectPrimitive.Group className={clsx(SelectCSS.className, 'rekorder-group', className)} ref={ref} {...props} />;
});

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectPrimitive.SelectSeparatorProps>(({ className, ...props }, ref) => {
  return <SelectPrimitive.Separator ref={ref} className={clsx(SelectCSS.className, 'rekorder-separator', className)} {...props} />;
});

const SelectLabel = React.forwardRef<HTMLDivElement, SelectPrimitive.SelectLabelProps>(({ className, ...props }, ref) => {
  return <SelectPrimitive.Label ref={ref} className={clsx(SelectCSS.className, 'rekorder-label', className)} {...props} />;
});

const SelectItem = React.forwardRef<HTMLDivElement, SelectPrimitive.SelectItemProps>(({ children, className, ...props }, ref) => {
  return (
    <SelectPrimitive.Item className={clsx(SelectCSS.className, 'rekorder-item', className)} ref={ref} {...props}>
      <SelectPrimitive.ItemText className={clsx(SelectCSS.className, 'rekorder-text')}>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className={clsx(SelectCSS.className, 'rekorder-indicator')}>
        <CheckCircle size={20} weight="fill" color={theme.colors.primary.main} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

SelectRoot.Input = SelectInput;
SelectRoot.Content = SelectContent;
SelectRoot.Group = SelectGroup;
SelectRoot.Separator = SelectSeparator;
SelectRoot.Label = SelectLabel;
SelectRoot.Item = SelectItem;

SelectRoot.displayName = 'Select';
SelectInput.displayName = 'SelectInput';
SelectContent.displayName = 'SelectContent';
SelectGroup.displayName = 'SelectGroup';
SelectSeparator.displayName = 'SelectSeparator';
SelectLabel.displayName = 'SelectLabel';
SelectItem.displayName = 'SelectItem';

export { SelectRoot as Select, type SelectOption, type SelectProps };
