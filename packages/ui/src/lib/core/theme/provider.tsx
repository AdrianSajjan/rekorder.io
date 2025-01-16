import { ReactNode } from 'react';

import { FontsProvider } from '../fonts/provider';
import { AnimationsProvider } from '../animations/provider';

interface ThemeProviderProps {
  children?: ReactNode;
  global?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <FontsProvider>
      <AnimationsProvider {...props}>{children}</AnimationsProvider>
    </FontsProvider>
  );
}
