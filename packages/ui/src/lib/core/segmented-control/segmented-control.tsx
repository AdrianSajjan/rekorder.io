import clsx from 'clsx';
import { LayoutGroup, motion } from 'framer-motion';
import css from 'styled-jsx/css';

import * as Tabs from '@radix-ui/react-tabs';
import * as React from 'react';

import { useStateObserver } from '@rekorder.io/hooks';
import { isFunction } from '@rekorder.io/utils';
import { theme } from '../../theme';

const SegmentedControlCSS = css.resolve`
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
  }

  .list {
    display: grid;
    grid-auto-columns: 1fr;
    overflow: hidden;

    width: 100%;
    font-weight: 500;

    padding: ${theme.space(1)};
    background-color: ${theme.colors.background.main};
    border-radius: ${theme.space(3)};
  }

  .control.small .list {
    font-size: 14px;
  }
  .control.medium .list {
    font-size: 14px;
  }
  .control.large .list {
    font-size: 15px;
  }

  .control.horizontal .list {
    grid-auto-flow: column;
  }
  .control.vertical .list {
    grid-auto-flow: row;
  }

  .trigger {
    width: 100%;
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .control.small .trigger {
    height: ${theme.space(9)};
    border-radius: ${theme.space(1.5)};
  }

  .control.medium .trigger {
    height: ${theme.space(10)};
    border-radius: ${theme.space(2)};
  }

  .control.large .trigger {
    height: ${theme.space(11)};
    border-radius: ${theme.space(2.5)};
  }

  .content {
    position: relative;
    color: ${theme.colors.text.muted};
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
    box-shadow: ${theme.shadow().sm};
    background-color: ${theme.colors.core.white};
    border-radius: ${theme.space(2)};
    inset: 0;
  }
`;

interface SegmenedControl
  extends React.ForwardRefExoticComponent<SegmentedControlRootProps & React.RefAttributes<HTMLDivElement>> {
  List: typeof SegmentedControlList;
  Trigger: typeof SegmentedControlTrigger;
  Panel: typeof SegmentedControlPanel;
  TriggerIcon: typeof SegmentedControlTriggerIcon;
}

interface SegmentedControlRootProps extends Tabs.TabsProps {
  size?: 'small' | 'medium' | 'large';
}

const SegmentedControlRoot = React.forwardRef<HTMLDivElement, SegmentedControlRootProps>(
  ({ className, orientation = 'horizontal', size = 'medium', ...props }, ref) => {
    return (
      <React.Fragment>
        {SegmentedControlCSS.styles}
        <Tabs.Root
          ref={ref}
          orientation={orientation}
          className={clsx(SegmentedControlCSS.className, 'control', orientation, size, className)}
          {...props}
        />
      </React.Fragment>
    );
  }
) as SegmenedControl;

const SegmentedControlList = React.forwardRef<HTMLDivElement, Tabs.TabsListProps>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <LayoutGroup id={id}>
      <Tabs.List {...props} ref={ref} className={clsx(SegmentedControlCSS.className, 'list', className)} />
    </LayoutGroup>
  );
});

const SegmentedControlTrigger = React.forwardRef<HTMLButtonElement, Tabs.TabsTriggerProps>(
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
        className={clsx(SegmentedControlCSS.className, 'trigger', className)}
        {...props}
      >
        <div className={clsx(SegmentedControlCSS.className, 'content')}>{children}</div>
        {state === 'active' ? (
          <motion.div
            layoutId="rekorder-segmented-controls-indictor"
            className={clsx(SegmentedControlCSS.className, 'indicator')}
          />
        ) : null}
      </Tabs.Trigger>
    );
  }
);

const SegmentedControlTriggerIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return <span className={clsx(SegmentedControlCSS.className, 'icon', className)} ref={ref} {...props} />;
  }
);

const SegmentedControlPanel = React.forwardRef<HTMLDivElement, Tabs.TabsContentProps>(
  ({ className, ...props }, ref) => {
    return <Tabs.Content {...props} ref={ref} className={clsx(SegmentedControlCSS.className, 'panel', className)} />;
  }
);

SegmentedControlRoot.List = SegmentedControlList;
SegmentedControlRoot.Trigger = SegmentedControlTrigger;
SegmentedControlRoot.Panel = SegmentedControlPanel;
SegmentedControlRoot.TriggerIcon = SegmentedControlTriggerIcon;

export { SegmentedControlRoot as SegmentedControl };
