import type { Meta, StoryObj } from '@storybook/react';
import { Fingerprint, SignIn, UserCircle } from '@phosphor-icons/react';

import { theme } from '../../theme';
import { SegmentedControl } from './segmented-control';

const meta: Meta<typeof SegmentedControl> = {
  component: SegmentedControl,
  title: 'Components/Segmented Control',
};

type Story = StoryObj<typeof SegmentedControl>;

const controls = [
  {
    icon: <SignIn size={20} />,
    label: 'Login',
    value: 'login',
  },
  {
    icon: <Fingerprint size={20} />,
    label: 'Register',
    value: 'register',
  },
  {
    icon: <UserCircle size={20} />,
    label: 'Social',
    value: 'social',
  },
];

const styles = theme.createStyles({
  root: {
    width: 500,
  },
});

export const Small: Story = {
  render: (props) => (
    <SegmentedControl {...props} size="small" defaultValue="login" style={styles.root}>
      <SegmentedControl.List>
        {controls.map((control) => (
          <SegmentedControl.Trigger key={control.value} value={control.value}>
            {control.label}
          </SegmentedControl.Trigger>
        ))}
      </SegmentedControl.List>
    </SegmentedControl>
  ),
};

export const Medium: Story = {
  render: (props) => (
    <SegmentedControl {...props} defaultValue="login" style={styles.root}>
      <SegmentedControl.List>
        {controls.map((control) => (
          <SegmentedControl.Trigger key={control.value} value={control.value}>
            {control.label}
          </SegmentedControl.Trigger>
        ))}
      </SegmentedControl.List>
    </SegmentedControl>
  ),
};

export const Large: Story = {
  render: (props) => (
    <SegmentedControl {...props} size="large" defaultValue="login" style={styles.root}>
      <SegmentedControl.List>
        {controls.map((control) => (
          <SegmentedControl.Trigger key={control.value} value={control.value}>
            {control.label}
          </SegmentedControl.Trigger>
        ))}
      </SegmentedControl.List>
    </SegmentedControl>
  ),
};

export const Icon: Story = {
  render: (props) => (
    <SegmentedControl {...props} size="small" defaultValue="login" style={styles.root}>
      <SegmentedControl.List>
        {controls.map((control) => (
          <SegmentedControl.Trigger key={control.value} value={control.value}>
            <SegmentedControl.TriggerIcon>{control.icon}</SegmentedControl.TriggerIcon>
            {control.label}
          </SegmentedControl.Trigger>
        ))}
      </SegmentedControl.List>
    </SegmentedControl>
  ),
};

export default meta;
