import clsx from 'clsx';
import css from 'styled-jsx/css';

import * as Tabs from '@radix-ui/react-tabs';
import * as React from 'react';

import { LayoutGroup, motion } from 'framer-motion';
import { useStateObserver } from '@rekorder.io/hooks';
import { isFunction } from '@rekorder.io/utils';

import { theme } from '../../theme';

const HorizontalTabsCSS = css.resolve`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  button {
    all: unset;
  }

  .control {
    font-family: ${theme.fonts.default};
    border-bottom: 1px solid ${theme.colors.borders.input};
  }

  .list {
    display: grid;
    gap: ${theme.space(6)};
    grid-auto-columns: 1fr;
    grid-auto-flow: column;

    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior: contain;

    font-weight: 500;
    font-size: 14px;
  }

  .trigger {
    width: 100%;
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    position: relative;
    color: ${theme.colors.accent.dark};
    padding: ${theme.space(3)} 0;
    transition: color 300ms ease;
    z-index: 10;

    display: flex;
    align-items: center;
    gap: ${theme.space(1.5)};
    justify-content: center;
  }

  .trigger[data-state='active'] .content {
    color: ${theme.colors.background.text};
  }

  .icon {
    display: flex;
    color: ${theme.colors.accent.dark};
  }

  .trigger[data-state='active'] .icon {
    color: ${theme.colors.primary.main};
  }

  .indicator {
    position: absolute;
    background-color: ${theme.colors.primary.main};
    border-radius: ${theme.space(0.5)};
    bottom: 0;
    left: 0;
    height: ${theme.space(0.5)};
    width: 100%;
  }
`;

interface SegmenedControl
  extends React.ForwardRefExoticComponent<HorizontalTabsRootProps & React.RefAttributes<HTMLDivElement>> {
  List: typeof HorizontalTabsList;
  Trigger: typeof HorizontalTabsTrigger;
  Panel: typeof HorizontalTabsPanel;
  TriggerIcon: typeof HorizontalTabsTriggerIcon;
}

interface HorizontalTabsRootProps extends Omit<Tabs.TabsProps, 'orientation'> {
  size?: 'small' | 'medium' | 'large';
}

const HorizontalTabsRoot = React.forwardRef<HTMLDivElement, HorizontalTabsRootProps>(
  ({ className, size = 'medium', ...props }, ref) => {
    return (
      <React.Fragment>
        {HorizontalTabsCSS.styles}
        <Tabs.Root ref={ref} className={clsx(HorizontalTabsCSS.className, 'control', size, className)} {...props} />
      </React.Fragment>
    );
  }
) as SegmenedControl;

const HorizontalTabsList = React.forwardRef<HTMLDivElement, Tabs.TabsListProps>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <LayoutGroup id={id}>
      <Tabs.List {...props} ref={ref} className={clsx(HorizontalTabsCSS.className, 'list', className)} />
    </LayoutGroup>
  );
});

const HorizontalTabsTrigger = React.forwardRef<HTMLButtonElement, Tabs.TabsTriggerProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLButtonElement | null>(null);

    const handleAssignRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        if (forwardedRef) {
          if (isFunction(forwardedRef)) forwardedRef(node);
          else forwardedRef.current = node;
        }
        ref.current = node;
      },
      [forwardedRef]
    );

    const state = useStateObserver(ref, {
      options: {
        attributes: true,
        attributeFilter: ['data-state'],
      },
      onGetState: (element) => element.getAttribute('data-state'),
      onCheckState: (mutation) => mutation.type === 'attributes' && mutation.attributeName === 'data-state',
    });

    return (
      <Tabs.Trigger
        ref={handleAssignRefs}
        className={clsx(HorizontalTabsCSS.className, 'trigger', className)}
        {...props}
      >
        <div className={clsx(HorizontalTabsCSS.className, 'content')}>{children}</div>
        {state === 'active' ? (
          <motion.div
            layoutId="rekorder-segmented-controls-indictor"
            className={clsx(HorizontalTabsCSS.className, 'indicator')}
          />
        ) : null}
      </Tabs.Trigger>
    );
  }
);

const HorizontalTabsTriggerIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return <span className={clsx(HorizontalTabsCSS.className, 'icon', className)} ref={ref} {...props} />;
  }
);

const HorizontalTabsPanel = React.forwardRef<HTMLDivElement, Tabs.TabsContentProps>(({ className, ...props }, ref) => {
  return <Tabs.Content {...props} ref={ref} className={clsx(HorizontalTabsCSS.className, 'panel', className)} />;
});

HorizontalTabsRoot.List = HorizontalTabsList;
HorizontalTabsRoot.Trigger = HorizontalTabsTrigger;
HorizontalTabsRoot.Panel = HorizontalTabsPanel;
HorizontalTabsRoot.TriggerIcon = HorizontalTabsTriggerIcon;

export { HorizontalTabsRoot as HorizontalTabs };
