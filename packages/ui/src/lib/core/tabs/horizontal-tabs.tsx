import clsx from 'clsx';
import css from 'styled-jsx/css';

import * as Tabs from '@radix-ui/react-tabs';
import * as React from 'react';

import { isFunction } from 'lodash';
import { LayoutGroup, motion } from 'framer-motion';
import { useStateObserver } from '@rekorder.io/hooks';

import { theme } from '../../theme';
import { ResolvedStyle } from '../style/resolved-style';

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

  .rekorder-horizontal-tabs-control {
    font-family: ${theme.fonts.default};
  }

  .rekorder-horizontal-tabs-list {
    display: grid;
    gap: ${theme.space(6)};
    grid-auto-columns: 1fr;
    grid-auto-flow: column;

    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior: contain;

    font-weight: 500;
    font-size: 14px;
    border-bottom: 1px solid ${theme.colors.borders.input};

    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .rekorder-horizontal-tabs-list::-webkit-scrollbar {
    display: none;
  }

  .rekorder-horizontal-tabs-list .rekorder-horizontal-tabs-trigger {
    width: 100%;
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .rekorder-horizontal-tabs-trigger:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .rekorder-horizontal-tabs-trigger-content {
    position: relative;
    transition: color 300ms ease;
    z-index: 10;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: ${theme.space(1.5)};
    color: ${theme.colors.accent.dark};
    padding: ${theme.space(3)} ${theme.space(3.5)};
  }

  .rekorder-horizontal-tabs-trigger[data-state='active'] .rekorder-horizontal-tabs-trigger-content {
    color: ${theme.colors.background.text};
  }

  .rekorder-horizontal-tabs-trigger-icon {
    display: flex;
    color: ${theme.colors.accent.dark};
  }

  .rekorder-horizontal-tabs-trigger[data-state='active'] .rekorder-horizontal-tabs-trigger-icon {
    color: ${theme.colors.primary.main};
  }

  .rekorder-horizontal-tabs-indicator {
    position: absolute;
    background-color: ${theme.colors.primary.main};
    border-radius: ${theme.space(0.5)};
    bottom: 0;
    left: 0;
    height: ${theme.space(0.5)};
    width: 100%;
  }
`;

interface SegmenedControl extends React.ForwardRefExoticComponent<HorizontalTabsRootProps & React.RefAttributes<HTMLDivElement>> {
  List: typeof HorizontalTabsList;
  Trigger: typeof HorizontalTabsTrigger;
  Panel: typeof HorizontalTabsPanel;
  TriggerIcon: typeof HorizontalTabsTriggerIcon;
}

interface HorizontalTabsRootProps extends Omit<Tabs.TabsProps, 'orientation'> {
  size?: 'small' | 'medium' | 'large';
}

const HorizontalTabsRoot = React.forwardRef<HTMLDivElement, HorizontalTabsRootProps>(({ className, size = 'medium', ...props }, ref) => {
  return (
    <React.Fragment>
      <ResolvedStyle>{HorizontalTabsCSS}</ResolvedStyle>
      <Tabs.Root ref={ref} className={clsx(HorizontalTabsCSS.className, 'rekorder-horizontal-tabs-control', size, className)} {...props} />
    </React.Fragment>
  );
}) as SegmenedControl;

const HorizontalTabsList = React.forwardRef<HTMLDivElement, Tabs.TabsListProps>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <LayoutGroup id={id}>
      <Tabs.List {...props} ref={ref} className={clsx(HorizontalTabsCSS.className, 'rekorder-horizontal-tabs-list', className)} />
    </LayoutGroup>
  );
});

const HorizontalTabsTrigger = React.forwardRef<HTMLButtonElement, Tabs.TabsTriggerProps>(({ className, children, ...props }, forwardedRef) => {
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
    <Tabs.Trigger ref={handleAssignRefs} className={clsx(HorizontalTabsCSS.className, 'rekorder-horizontal-tabs-trigger', className)} {...props}>
      <div className={clsx(HorizontalTabsCSS.className, 'rekorder-horizontal-tabs-trigger-content')}>{children}</div>
      {state === 'active' ? (
        <motion.div layoutId="rekorder-segmented-controls-indicator" className={clsx(HorizontalTabsCSS.className, 'rekorder-horizontal-tabs-indicator')} />
      ) : null}
    </Tabs.Trigger>
  );
});

const HorizontalTabsTriggerIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => {
  return <span className={clsx(HorizontalTabsCSS.className, 'rekorder-horizontal-tabs-trigger-icon', className)} ref={ref} {...props} />;
});

const HorizontalTabsPanel = React.forwardRef<HTMLDivElement, Tabs.TabsContentProps>(({ className, ...props }, ref) => {
  return <Tabs.Content {...props} ref={ref} className={clsx(HorizontalTabsCSS.className, 'rekorder-horizontal-tabs-panel', className)} />;
});

HorizontalTabsRoot.List = HorizontalTabsList;
HorizontalTabsRoot.Trigger = HorizontalTabsTrigger;
HorizontalTabsRoot.Panel = HorizontalTabsPanel;
HorizontalTabsRoot.TriggerIcon = HorizontalTabsTriggerIcon;

export { HorizontalTabsRoot as HorizontalTabs };
