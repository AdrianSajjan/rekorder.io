import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import clsx from 'clsx';
import css from 'styled-jsx/css';

import { theme } from '../../theme';

const AlertDialogCSS = css.resolve`
  .alert-dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: ${theme.zIndex(250)};
    background-color: rgba(0, 0, 0, 0.8);
    animation: fade-in 0.2s ease-out;
  }

  .alert-dialog-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: ${theme.zIndex(250)};
    background-color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    animation: fade-in 0.2s ease-out;
  }

  .alert-dialog-header {
    margin-bottom: 1rem;
  }

  .alert-dialog-footer {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  .alert-dialog-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .alert-dialog-description {
    margin-top: 0.5rem;
    font-size: 1rem;
    color: rgba(107, 114, 128, 1);
  }

  .alert-dialog-action {
    background-color: rgba(59, 130, 246, 1);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .alert-dialog-action:hover {
    background-color: rgba(37, 99, 235, 1);
  }

  .alert-dialog-cancel {
    background-color: rgba(229, 231, 235, 1);
    color: rgba(55, 65, 81, 1);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .alert-dialog-cancel:hover {
    background-color: rgba(209, 213, 219, 1);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
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
    <AlertDialogPrimitive.Overlay
      className={clsx(AlertDialogCSS.className, 'alert-dialog-overlay', className)}
      {...props}
      ref={ref}
    />
  </React.Fragment>
));

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <AlertDialogPrimitive.Content
      className={clsx(AlertDialogCSS.className, 'alert-dialog-content', className)}
      {...props}
      ref={ref}
    />
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
    <AlertDialogPrimitive.Title
      ref={ref}
      className={clsx(AlertDialogCSS.className, 'alert-dialog-title', className)}
      {...props}
    />
  </React.Fragment>
));

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <AlertDialogPrimitive.Description
      ref={ref}
      className={clsx(AlertDialogCSS.className, 'alert-dialog-description', className)}
      {...props}
    />
  </React.Fragment>
));

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <AlertDialogPrimitive.Action
      ref={ref}
      className={clsx(AlertDialogCSS.className, 'alert-dialog-action', className)}
      {...props}
    />
  </React.Fragment>
));

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <React.Fragment>
    {AlertDialogCSS.styles}
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={clsx(AlertDialogCSS.className, 'alert-dialog-cancel', className)}
      {...props}
    />
  </React.Fragment>
));

interface AlertDialogProps extends AlertDialogPrimitive.AlertDialogProps {
  title: string;
  description: string;
  onAction: () => void;
  onDontShowAgain?: () => void;
  isDontShowAgainVisible?: boolean;
}

function AlertDialog({ children, title, description, onAction, ...props }: AlertDialogProps) {
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
            <AlertDialogAction onClick={onAction}>Action</AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
