import type { Meta, StoryObj } from '@storybook/react';

import { theme } from '../../theme';
import { LoadingButton } from './loading-button';

const meta: Meta<typeof LoadingButton> = {
  component: LoadingButton,
  title: 'Components/Loading Button',
};

type Story = StoryObj<typeof LoadingButton>;

const styles = theme.createStyles({
  button: {
    width: 300,
  },
});

export const Solid: Story = {
  args: {
    variant: 'solid',
    loading: true,
    style: styles.button,
    children: 'Register Now',
    color: 'info',
  },
};

export const Fancy: Story = {
  args: {
    style: styles.button,
    children: 'Register Now',
    variant: 'fancy',
    loading: true,
  },
};

export const Outline: Story = {
  args: {
    style: styles.button,
    children: 'Register Now',
    variant: 'outline',
    loading: true,
  },
};

export const Light: Story = {
  args: {
    style: styles.button,
    children: 'Register Now',
    variant: 'light',
    loading: true,
  },
};

export const Ghost: Story = {
  args: {
    style: styles.button,
    children: 'Register Now',
    variant: 'ghost',
    loading: true,
  },
};

export default meta;
