import clsx from 'clsx';
import css from 'styled-jsx/css';

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { theme } from '../../theme';
import { animations } from '../../animations';
import { Divider } from '../divider/divider';

const AlertDialogCSS = css.resolve`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: ${theme.fonts.default};
  }

  button {
    all: unset;
  }

  .alert-dialog-overlay {
    inset: 0;
    position: fixed;
    z-index: ${theme.zIndex(250)};
    background-color: ${theme.alpha(theme.colors.core.black, 0.8)};
  }

  .alert-dialog-overlay[data-state='open'] {
    animation: ${animations['fade-in']} cubic-bezier(0.16, 1, 0.3, 1) 150ms;
  }

  .alert-dialog-overlay[data-state='closed'] {
    animation: ${animations['fade-out']} ease-out 100ms;
  }

  .alert-dialog-content {
    top: 50%;
    left: 50%;
    position: fixed;

    display: flex;
    flex-direction: column;

    z-index: ${theme.zIndex(250)};
    border-radius: ${theme.space(5)};

    max-width: ${theme.screens.xs}px;
    box-shadow: ${theme.shadow().lg};
    background-color: ${theme.colors.core.white};
  }

  .alert-dialog-content[data-state='open'] {
    animation: alert-entry cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards;
  }

  .alert-dialog-content[data-state='closed'] {
    animation: alert-exit ease-out 100ms;
  }

  .alert-dialog-header {
    display: flex;
    flex-direction: column;
    gap: ${theme.space(3)};
    padding: ${theme.space(6)};
    text-align: center;
  }

  .alert-dialog-footer {
    display: flex;
    gap: ${theme.space(4)};
    align-items: center;
    flex-direction: row-reverse;
    padding: ${theme.space(4)} ${theme.space(5)};
  }

  .alert-dialog-title {
    font-size: 16px;
    font-weight: 500;
  }

  .alert-dialog-description {
    font-size: 14px;
    color: ${theme.colors.accent.dark};
  }

  .alert-dialog-action {
    flex: 1;
  }

  .alert-dialog-cancel {
    flex: 1;
  }

  @keyframes alert-entry {
    from {
      opacity: 0;
      transform: translate(-50%, -65%) scale(0.9);
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes alert-exit {
    from {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -65%) scale(0.9);
      opacity: 0;
    }
  }
`;

const AlertDialogRoot = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <AlertDialogPrimitive.Overlay className={clsx(AlertDialogCSS.className, 'alert-dialog-overlay', className)} {...props} ref={ref} />
  </React.Fragment>
));

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <AlertDialogPrimitive.Content className={clsx(AlertDialogCSS.className, 'alert-dialog-content', className)} {...props} ref={ref} />
  </React.Fragment>
));

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <div className={clsx(AlertDialogCSS.className, 'alert-dialog-header', className)} {...props} />
  </React.Fragment>
);

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <div className={clsx(AlertDialogCSS.className, 'alert-dialog-footer', className)} {...props} />
  </React.Fragment>
);

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <AlertDialogPrimitive.Title ref={ref} className={clsx(AlertDialogCSS.className, 'alert-dialog-title', className)} {...props} />
  </React.Fragment>
));

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <AlertDialogPrimitive.Description ref={ref} className={clsx(AlertDialogCSS.className, 'alert-dialog-description', className)} {...props} />
  </React.Fragment>
));

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <AlertDialogPrimitive.Action className={clsx(AlertDialogCSS.className, 'alert-dialog-action', className)} ref={ref} {...props} />
  </React.Fragment>
));

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <AlertDialogPrimitive.Cancel className={clsx(AlertDialogCSS.className, 'alert-dialog-cancel', className)} ref={ref} {...props} />
  </React.Fragment>
));

interface AlertDialogProps extends AlertDialogPrimitive.AlertDialogProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}

function AlertDialog({ children, title, description, action, cancel, onConfirm, onCancel, ...props }: AlertDialogProps) {
  return (
    <AlertDialogRoot {...props}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <Divider />
          <AlertDialogFooter>
            <AlertDialogAction onClick={onConfirm}>{action || 'Continue'}</AlertDialogAction>
            <AlertDialogCancel onClick={onCancel}>{cancel || 'Cancel'}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialogRoot>
  );
}

AlertDialog.Root = AlertDialogRoot;
AlertDialog.Trigger = AlertDialogTrigger;
AlertDialog.Portal = AlertDialogPortal;
AlertDialog.Overlay = AlertDialogOverlay;
AlertDialog.Content = AlertDialogContent;
AlertDialog.Header = AlertDialogHeader;
AlertDialog.Footer = AlertDialogFooter;
AlertDialog.Title = AlertDialogTitle;
AlertDialog.Description = AlertDialogDescription;
AlertDialog.Action = AlertDialogAction;
AlertDialog.Cancel = AlertDialogCancel;

export { AlertDialog };
