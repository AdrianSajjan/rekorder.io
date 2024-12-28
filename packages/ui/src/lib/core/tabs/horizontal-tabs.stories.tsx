import type { Meta, StoryObj } from '@storybook/react';
import { Fingerprint, SignIn, UserCircle } from '@phosphor-icons/react';

import { theme } from '../../theme';
import { HorizontalTabs } from './horizontal-tabs';

const meta: Meta<typeof HorizontalTabs> = {
  component: HorizontalTabs,
  title: 'Components/Horizontal Tabs',
};

type Story = StoryObj<typeof HorizontalTabs>;

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

export const Standard: Story = {
  render: (props) => (
    <HorizontalTabs {...props} defaultValue="login" style={styles.root}>
      <HorizontalTabs.List>
        {controls.map((control) => (
          <HorizontalTabs.Trigger key={control.value} value={control.value}>
            {control.label}
          </HorizontalTabs.Trigger>
        ))}
      </HorizontalTabs.List>
    </HorizontalTabs>
  ),
};

export const Icons: Story = {
  render: (props) => (
    <HorizontalTabs {...props} defaultValue="login" style={styles.root}>
      <HorizontalTabs.List>
        {controls.map((control) => (
          <HorizontalTabs.Trigger key={control.value} value={control.value}>
            <HorizontalTabs.TriggerIcon>{control.icon}</HorizontalTabs.TriggerIcon>
            {control.label}
          </HorizontalTabs.Trigger>
        ))}
      </HorizontalTabs.List>
    </HorizontalTabs>
  ),
};

export default meta;
