import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';

import { Button } from './button';
import { theme } from '../../theme';

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

export const Primary: Story = {
  args: {
    style: styles.button,
    children: 'Register Now',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Register Now/gi)).toBeTruthy();
  },
};

export const Accent: Story = {
  args: {
    style: styles.button,
    children: 'Sign In',
    variant: 'accent',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Sign In/gi)).toBeTruthy();
  },
};

export const Error: Story = {
  args: {
    style: styles.button,
    children: 'Delete',
    variant: 'error',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Delete/gi)).toBeTruthy();
  },
};

export const Success: Story = {
  args: {
    style: styles.button,
    children: 'Save',
    variant: 'success',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Save/gi)).toBeTruthy();
  },
};

export const Warning: Story = {
  args: {
    style: styles.button,
    children: 'Cancel',
    variant: 'warning',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Cancel/gi)).toBeTruthy();
  },
};

export const Info: Story = {
  args: {
    style: styles.button,
    children: 'Help',
    variant: 'info',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Help/gi)).toBeTruthy();
  },
};

export default meta;
