import { ReactNode } from 'react';

import { FontsProvider } from '../fonts/provider';
import { AnimationsProvider } from '../animations/provider';

export function ThemeProvider({ children }: { children?: ReactNode }) {
  return (
    <FontsProvider>
      <AnimationsProvider>{children}</AnimationsProvider>
    </FontsProvider>
  );
}
