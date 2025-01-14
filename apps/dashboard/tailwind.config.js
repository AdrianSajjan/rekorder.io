const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { theme } = require('../../packages/constants/src/lib/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    extend: {
      fontFamily: {
        sans: theme.fonts.default,
      },
      colors: {
        ...theme.colors,
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
