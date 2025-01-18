import { ChartDonut, GearSix, MonitorPlay, ShareFat } from '@phosphor-icons/react';

export const navigations = [
  {
    icon: MonitorPlay,
    label: 'My Library',
    value: 'library',
    href: '/dashboard/library',
  },
  {
    icon: ChartDonut,
    label: 'Analytics',
    value: 'analytics',
    href: '/dashboard/analytics',
  },
  {
    icon: ShareFat,
    label: 'Shared Videos',
    value: 'shared',
    href: '/dashboard/shared',
  },
  {
    icon: GearSix,
    label: 'Settings',
    value: 'settings',
    href: '/dashboard/settings',
  },
];
