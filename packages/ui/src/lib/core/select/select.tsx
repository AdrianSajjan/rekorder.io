import clsx from 'clsx';
import css from 'styled-jsx/css';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CaretDown, Check } from '@phosphor-icons/react';

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

const SelectInputCSS = css.resolve`
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

  .rekorder-trigger:focus {
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
`;

const SelectInput = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(({ className, children, placeholder, ...props }, ref) => {
  const { size } = useSelectContext();

  return (
    <React.Fragment>
      {SelectInputCSS.styles}
      <SelectPrimitive.Trigger ref={ref} className={clsx(SelectInputCSS.className, 'rekorder-trigger', theme.createClassName(size), className)} {...props}>
        {children ?? <SelectPrimitive.Value placeholder={placeholder} />}
        <SelectPrimitive.Icon className={clsx(SelectInputCSS.className, 'rekorder-icon')}>
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
}

function isGroup(option: SelectOption): option is ISelectGroup {
  return 'options' in option;
}

const SelectContentCSS = css.resolve`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
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
    gap: ${theme.space(3)};

    padding: ${theme.space(2.5)} ${theme.space(3.5)};
    color: ${theme.colors.background.text};
    border-radius: ${theme.space(1.5)};
    font-size: 14px;

    transition: background-color 200ms ease-in-out;
    cursor: pointer;
  }

  .rekorder-content .rekorder-item:focus {
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
`;

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ viewport, options, children, sideOffset = 8, position = 'popper', ...props }, ref) => {
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

    return (
      <React.Fragment>
        {SelectContentCSS.styles}
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={clsx(SelectContentCSS.className, 'rekorder-content', theme.createClassName(size))}
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
  return <SelectPrimitive.Group className={clsx(SelectContentCSS.className, 'rekorder-group', className)} ref={ref} {...props} />;
});

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectPrimitive.SelectSeparatorProps>(({ className, ...props }, ref) => {
  return <SelectPrimitive.Separator ref={ref} className={clsx(SelectContentCSS.className, 'rekorder-separator', className)} {...props} />;
});

const SelectLabel = React.forwardRef<HTMLDivElement, SelectPrimitive.SelectLabelProps>(({ className, ...props }, ref) => {
  return <SelectPrimitive.Label ref={ref} className={clsx(SelectContentCSS.className, 'rekorder-label', className)} {...props} />;
});

const SelectItem = React.forwardRef<HTMLDivElement, SelectPrimitive.SelectItemProps>(({ children, className, ...props }, ref) => {
  return (
    <SelectPrimitive.Item className={clsx(SelectContentCSS.className, 'rekorder-item', className)} ref={ref} {...props}>
      <SelectPrimitive.ItemText className={clsx(SelectContentCSS.className, 'rekorder-text')}>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className={clsx(SelectContentCSS.className, 'rekorder-indicator')}>
        <Check size={16} weight="bold" color={theme.colors.accent.dark} />
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
