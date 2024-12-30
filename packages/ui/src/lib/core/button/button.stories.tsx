import type { Meta, StoryObj } from '@storybook/react';

import { theme } from '../../theme';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
};

type Story = StoryObj<typeof Button>;

const styles = theme.createStyles({
  button: {
    width: 300,
  },
});

export const Solid: Story = {
  args: {
    variant: 'solid',
    style: styles.button,
    children: 'Register Now',
    color: "info"
  },
};

export const Fancy: Story = {
  args: {
    style: styles.button,
    children: 'Register Now',
    variant: 'fancy',
  },
};

export const Outline: Story = {
  args: {
    style: styles.button,
    children: 'Register Now',
    variant: 'outline',
  },
};

export const Light: Story = {
  args: {
    style: styles.button,
    children: 'Register Now',
    variant: 'light',
  },
};

export const Ghost: Story = {
  args: {
    style: styles.button,
    children: 'Register Now',
    variant: 'ghost',
  },
};

export default meta;
