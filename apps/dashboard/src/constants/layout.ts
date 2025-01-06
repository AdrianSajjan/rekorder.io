import { ChartDonut, GearSix, MonitorPlay, ShareFat } from '@phosphor-icons/react';

export const navigations = [
  {
    icon: ChartDonut,
    label: 'Dashboard',
    value: 'dashboard',
    href: '/',
  },
  {
    icon: MonitorPlay,
    label: 'My Library',
    value: 'library',
    href: '/library',
  },
  {
    icon: ShareFat,
    label: 'Shared Videos',
    value: 'shared',
    href: '/shared',
  },
  {
    icon: GearSix,
    label: 'Settings',
    value: 'settings',
    href: '/settings',
  },
];
