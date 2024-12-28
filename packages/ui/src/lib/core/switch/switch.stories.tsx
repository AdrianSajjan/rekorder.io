import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'Components/Switch',
  render: (props) => <Switch {...props} />,
};

type Story = StoryObj<typeof Switch>;

export const Unchecked: Story = {
  args: { defaultChecked: false },
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const DisabledUnchecked: Story = {
  args: { disabled: true, defaultChecked: false },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};

export default meta;
