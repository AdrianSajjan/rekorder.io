import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './status';

const meta: Meta<typeof StatusBadge> = {
  component: StatusBadge,
  title: 'Components/Status Badge',
  render: (props) => <StatusBadge {...props} />,
};

type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {
  args: {
    variant: 'default',
    indicator: 'dot',
    children: 'Default',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    indicator: 'dot',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    indicator: 'dot',
    children: 'Warning',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    indicator: 'dot',
    children: 'Error',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    indicator: 'dot',
    children: 'Info',
  },
};

export default meta;
