import type { Meta, StoryObj } from '@storybook/react';
import { Info } from '@phosphor-icons/react';
import { Tooltip } from './tooltip';
import { theme } from '../../theme';

const styles = theme.createStyles({
  root: {
    height: 600,
    width: 600,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: 'Components/Tooltip',
  render: (args) => (
    <div style={styles.root}>
      <Tooltip.Provider>
        <Tooltip {...args} />
      </Tooltip.Provider>
    </div>
  ),
};

type Story = StoryObj<typeof Tooltip>;

export const Arrow: Story = {
  args: {
    arrow: true,
    content: 'This is some very important information',
    children: <Info size={24} weight="fill" />,
  },
};

export const Plain: Story = {
  args: {
    arrow: false,
    content: 'This is some very important information',
    children: <Info size={24} weight="fill" />,
  },
};

export const Left: Story = {
  args: {
    side: 'left',
    content: 'This is some very important information',
    children: <Info size={24} weight="fill" />,
  },
};

export const Right: Story = {
  args: {
    side: 'right',
    content: 'This is some very important information',
    children: <Info size={24} weight="fill" />,
  },
};

export const Bottom: Story = {
  args: {
    side: 'bottom',
    content: 'This is some very important information',
    children: <Info size={24} weight="fill" />,
  },
};

export const Top: Story = {
  args: {
    side: 'top',
    content: 'This is some very important information',
    children: <Info size={24} weight="fill" />,
  },
};

export const Dark: Story = {
  args: {
    colorScheme: 'dark',
    content: 'This is some very important information',
    children: <Info size={24} weight="fill" />,
  },
};

export const Light: Story = {
  args: {
    colorScheme: 'light',
    content: 'This is some very important information',
    children: <Info size={24} weight="fill" />,
  },
};

export default meta;
