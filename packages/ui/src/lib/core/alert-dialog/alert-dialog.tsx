import clsx from 'clsx';
import css from 'styled-jsx/css';

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { theme } from '../../theme';
import { animations } from '../../animations';
import { Button, ButtonProps } from '../button/button';
import { ResolvedStyle } from '../style/resolved-styled';

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

  .rekorder-alert-dialog-overlay {
    inset: 0;
    position: fixed;

    z-index: ${theme.zIndex(250)};
    background-color: ${theme.alpha(theme.colors.core.black, 0.8)};
  }

  .rekorder-alert-dialog-overlay[data-state='open'] {
    animation: ${animations['fade-in']} cubic-bezier(0.2, 0.5, 0.1, 0.8) 150ms;
  }

  .rekorder-alert-dialog-overlay[data-state='closed'] {
    animation: ${animations['fade-out']} ease-out 100ms;
  }

  .rekorder-alert-dialog-content {
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

  .rekorder-alert-dialog-content[data-state='open'] {
    animation: alert-entry cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards;
  }

  .rekorder-alert-dialog-content[data-state='closed'] {
    animation: alert-exit ease-out 100ms;
  }

  .rekorder-alert-dialog-header {
    display: flex;
    flex-direction: column;
    text-align: center;

    gap: ${theme.space(2.5)};
    padding: ${theme.space(6)};
  }

  .rekorder-alert-dialog-footer {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;

    gap: ${theme.space(4)};
    padding: ${theme.space(4)} ${theme.space(5)};
    border-top: 1px solid ${theme.colors.borders.input};
  }

  .rekorder-alert-dialog-title {
    font-size: 16px;
    font-weight: 500;
    color: ${theme.colors.background.text};
  }

  .rekorder-alert-dialog-description {
    font-size: 14px;
    line-height: 1.3;
    color: ${theme.colors.accent.dark};
  }

  .rekorder-alert-dialog-action {
    flex: 1;
  }

  .rekorder-alert-dialog-cancel {
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
      transform: translate(-50%, -60%) scale(0.9);
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
    <ResolvedStyle>{AlertDialogCSS}</ResolvedStyle>
    <AlertDialogPrimitive.Overlay className={clsx(AlertDialogCSS.className, 'rekorder-alert-dialog-overlay', className)} {...props} ref={ref} />
  </React.Fragment>
));

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    <ResolvedStyle>{AlertDialogCSS}</ResolvedStyle>
    <AlertDialogPrimitive.Content className={clsx(AlertDialogCSS.className, 'rekorder-alert-dialog-content', className)} {...props} ref={ref} />
  </React.Fragment>
));

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(AlertDialogCSS.className, 'rekorder-alert-dialog-header', className)} {...props} />
);

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(AlertDialogCSS.className, 'rekorder-alert-dialog-footer', className)} {...props} />
);

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={clsx(AlertDialogCSS.className, 'rekorder-alert-dialog-title', className)} {...props} />
));

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={clsx(AlertDialogCSS.className, 'rekorder-alert-dialog-description', className)} {...props} />
));

const AlertDialogAction = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Action>, ButtonProps>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action asChild>
    <Button className={clsx(AlertDialogCSS.className, 'rekorder-alert-dialog-action', className)} ref={ref} {...props} />
  </AlertDialogPrimitive.Action>
));

const AlertDialogCancel = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Cancel>, ButtonProps>(
  ({ className, variant = 'light', color = 'accent', ...props }, ref) => (
    <AlertDialogPrimitive.Cancel asChild>
      <Button className={clsx(AlertDialogCSS.className, 'rekorder-alert-dialog-cancel', className)} variant={variant} color={color} ref={ref} {...props} />
    </AlertDialogPrimitive.Cancel>
  )
);

interface AlertDialogProps extends AlertDialogPrimitive.AlertDialogProps {
  title: string;
  description: string;
  mode?: 'destructive' | 'default';
  action?: React.ReactNode;
  cancel?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}

function AlertDialog({ children, title, description, action, cancel, mode = 'default', onConfirm, onCancel, ...props }: AlertDialogProps) {
  const actionColor = mode === 'destructive' ? 'error' : 'primary';

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
          <AlertDialogFooter>
            <AlertDialogAction color={actionColor} onClick={onConfirm}>
              {action || 'Continue'}
            </AlertDialogAction>
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
