import type { Meta, StoryObj } from '@storybook/react';

import { AlertDialog } from './alert-dialog';
import { Button } from '../button/button';
import { AnimationsProvider } from '../animations/provider';

const meta: Meta<typeof AlertDialog> = {
  component: AlertDialog,
  title: 'Components/Alert Dialog',
  render: (props) => (
    <AnimationsProvider>
      <AlertDialog {...props} />
    </AnimationsProvider>
  ),
};

type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  args: {
    action: 'Delete',
    cancel: 'Cancel',
    title: 'Are you sure?',
    mode: 'destructive',
    description:
      'You are about to delete this item. It will be permanently removed from our server and you will not be able to recover it. Are you sure you want to continue?',
    children: (
      <Button variant="solid" color="error">
        Delete product
      </Button>
    ),
  },
};

export default meta;
