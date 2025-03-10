import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { User, Gear as Settings, CreditCard, SignOut as LogOut, PlusCircle, GithubLogo as Github, Lifebuoy as LifeRing } from '@phosphor-icons/react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuNested,
  DropdownMenuNestedTrigger,
  DropdownMenuNestedContent,
  DropdownMenuRadioGroup,
} from './dropdown-menu';
import { Button } from '../button/button';
import { ThemeProvider } from '../theme/provider';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/Dropdown Menu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      defaultValue: 'medium',
      description: 'The size of the dropdown menu',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

/**
 * A basic dropdown menu with various items.
 */
export const Basic: Story = {
  args: {
    size: 'medium',
  },
  render: (args) => (
    <ThemeProvider>
      <DropdownMenu {...args}>
        <DropdownMenuTrigger asChild>
          <Button>Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ThemeProvider>
  ),
};

/**
 * A dropdown menu with nested submenus.
 */
export const WithSubmenu: Story = {
  args: {
    size: 'medium',
  },
  render: (args) => (
    <ThemeProvider>
      <DropdownMenu {...args}>
        <DropdownMenuTrigger asChild>
          <Button>Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuNested>
            <DropdownMenuNestedTrigger>
              <Settings />
              Settings
            </DropdownMenuNestedTrigger>
            <DropdownMenuNestedContent>
              <DropdownMenuItem>
                <User />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuNestedContent>
          </DropdownMenuNested>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <PlusCircle />
            New Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ThemeProvider>
  ),
};

/**
 * A dropdown menu with checkbox items.
 */
export const WithCheckboxItems: Story = {
  args: {
    size: 'medium',
  },
  render: function CheckboxItemsStory(args) {
    const [showStatusBar, setShowStatusBar] = React.useState(true);
    const [showActivityBar, setShowActivityBar] = React.useState(false);
    const [showPanel, setShowPanel] = React.useState(false);

    return (
      <ThemeProvider>
        <DropdownMenu {...args}>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
              Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showActivityBar} onCheckedChange={setShowActivityBar}>
              Activity Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
              Panel
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ThemeProvider>
    );
  },
};

/**
 * A dropdown menu with radio items.
 */
export const WithRadioItems: Story = {
  args: {
    size: 'medium',
  },
  render: function RadioItemsStory(args) {
    const [position, setPosition] = React.useState('bottom');

    return (
      <ThemeProvider>
        <DropdownMenu {...args}>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="left">Left</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ThemeProvider>
    );
  },
};

/**
 * A dropdown menu with disabled items.
 */
export const WithDisabledItems: Story = {
  args: {
    size: 'medium',
  },
  render: (args) => (
    <ThemeProvider>
      <DropdownMenu {...args}>
        <DropdownMenuTrigger asChild>
          <Button>Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings />
            Settings (Disabled)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Github />
            GitHub
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeRing />
            Support
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ThemeProvider>
  ),
};

/**
 * A dropdown menu with inset items.
 */
export const WithInsetItems: Story = {
  args: {
    size: 'medium',
  },
  render: (args) => (
    <ThemeProvider>
      <DropdownMenu {...args}>
        <DropdownMenuTrigger asChild>
          <Button>Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Regular Items</DropdownMenuLabel>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel inset>Inset Items</DropdownMenuLabel>
          <DropdownMenuItem inset>New Tab</DropdownMenuItem>
          <DropdownMenuItem inset>New Window</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ThemeProvider>
  ),
};

/**
 * A dropdown menu with a custom trigger.
 */
export const CustomTrigger: Story = {
  args: {
    size: 'medium',
  },
  render: (args) => (
    <ThemeProvider>
      <DropdownMenu {...args}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" color="accent">
            <Settings />
            Settings
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ThemeProvider>
  ),
};

/**
 * Demonstrates the different size options available for the dropdown menu.
 */
export const Sizes: Story = {
  render: () => (
    <ThemeProvider>
      <div style={{ display: 'flex', gap: '20px' }}>
        <DropdownMenu size="small">
          <DropdownMenuTrigger asChild>
            <Button size="small">Small</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Size: Small</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu size="medium">
          <DropdownMenuTrigger asChild>
            <Button>Medium</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Size: Medium</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu size="large">
          <DropdownMenuTrigger asChild>
            <Button size="large">Large</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Size: Large</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ThemeProvider>
  ),
};
