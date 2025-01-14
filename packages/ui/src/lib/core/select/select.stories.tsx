import { Fragment } from 'react/jsx-runtime';
import type { Meta, StoryObj } from '@storybook/react';

import { Select, SelectOption } from './select';
import { ThemeProvider } from '../theme/provider';
import { theme } from '../../theme';

const meta: Meta<typeof Select> = {
  component: Select,
  title: 'Components/Select',
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

type Story = StoryObj<typeof Select>;

const options: SelectOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
];

const styles = theme.createStyles({
  input: {
    width: 300,
  },
});

export const SelectField: Story = {
  args: {
    size: 'medium',
    children: (
      <Fragment>
        <Select.Input style={styles.input} placeholder="Select your favourite fruit..." />
        <Select.Content options={options} />
      </Fragment>
    ),
  },
};

const group: SelectOption[] = [
  {
    title: 'Fruits',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' },
      { label: 'Date', value: 'date' },
    ],
  },
  {
    title: 'Vegetables',
    options: [
      { label: 'Artichoke', value: 'artichoke' },
      { label: 'Broccoli', value: 'broccoli' },
      { label: 'Carrot', value: 'carrot' },
      { label: 'Daikon', value: 'daikon' },
    ],
  },
];

export const SelectFieldGroup: Story = {
  args: {
    size: 'medium',
    children: (
      <Fragment>
        <Select.Input style={styles.input} placeholder="Select a fruit or vegetable..." />
        <Select.Content options={group} />
      </Fragment>
    ),
  },
};

export default meta;
