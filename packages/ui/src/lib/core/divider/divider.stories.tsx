import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './divider';
import { theme } from '../../theme';
import { StatusBadge } from '../badge/status';

const styles = theme.createStyles({
  container: {
    width: 500,
    padding: 20,
  },
});

const meta: Meta<typeof Divider> = {
  component: Divider,
  title: 'Components/Divider',
  render: (args) => (
    <div style={styles.container}>
      <Divider {...args} />
    </div>
  ),
};

type Story = StoryObj<typeof Divider>;

export const Line: Story = {
  args: {},
};

export const Text: Story = {
  args: {
    children: 'OR',
  },
};

export const Content: Story = {
  args: {
    children: <StatusBadge variant="success">Okay</StatusBadge>,
  },
};

export default meta;
