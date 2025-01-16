import React from 'react';
import css from 'styled-jsx/css';

import { FontsProvider } from '../fonts/provider';
import { AnimationsProvider } from '../animations/provider';
import { ResolvedStyle } from '../style/resolved-styled';

interface ThemeProviderProps {
  global?: boolean;
  children?: React.ReactNode;
}

const GlobalResetCSS = css.resolve`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  p {
    text-wrap: pretty;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    text-wrap: balance;
  }
`;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <FontsProvider>
      <ResolvedStyle>{GlobalResetCSS}</ResolvedStyle>
      <AnimationsProvider {...props}>{children}</AnimationsProvider>
    </FontsProvider>
  );
}
