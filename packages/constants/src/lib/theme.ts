export interface Ring {
  width: number;
  color: string;
}

export const theme = {
  colors: {
    primary: {
      light: '#6366f1',
      main: '#4f46e5',
      dark: '#4338ca',
      text: '#fff',
    },
    destructive: {
      light: '#ef4444',
      main: '#dc2626',
      dark: '#b91c1c',
      text: '#fff',
    },
    accent: {
      light: '#d3d3d3',
      main: '#a3a3a3',
      dark: '#5c5c5c',
      text: '#000',
    },
    success: {
      light: '#22c55e',
      main: '#16a34a',
      dark: '#15803d',
      text: '#fff',
    },
    info: {
      light: '#0ea5e9',
      main: '#0284c7',
      dark: '#0369a1',
      text: '#ffffff',
    },
    warning: {
      light: '#f59e0b',
      main: '#d97706',
      dark: '#b45309',
      text: '#ffffff',
    },
    background: {
      light: '#f5f5f5',
      main: '#eaeaea',
      dark: '#d6d6d6',
      text: '#000000',
    },
    borders: {
      input: '#e1e4ea',
    },
    core: {
      black: '#0a0d14',
      white: '#ffffff',
      jetblack: '#1a1a1a',
    },
    card: {
      background: '#ffffff',
      text: '#000000',
    },
    text: {
      muted: '#969696',
      dark: '#000000',
      light: '#ffffff',
    },
  },

  fonts: {
    default: ['Inter', 'sans-serif'].join(', '),
    sans: ['Inter', 'sans-serif'].join(', '),
  },

  screens: {
    xxs: 320,
    xs: 420,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  shadow(_color?: string) {
    const color = _color || theme.alpha(this.colors.core.black, 0.05);
    const darker = _color || theme.alpha(this.colors.core.black, 0.25);
    return {
      xs: `0px 1px 2px 0px ${color}`,
      sm: `0 1px 3px 0px ${color}, 0 1px 2px -1px ${color}`,
      md: `0 4px 6px -1px ${color}, 0 2px 4px -2px ${color}`,
      lg: `0 10px 15px -3px ${color}, 0 4px 6px -4px ${color}`,
      xl: `0 20px 25px -5px ${color}, 0 8px 10px -6px ${color}`,
      '2xl': `0 25px 50px -12px ${darker}`,
      inner: `inset 0 2px 4px 0 ${color}`,
    };
  },

  space(multiplier: number) {
    return multiplier * 4 + 'px';
  },

  ring(props?: { ring?: Partial<Ring>; offset?: Partial<Ring> }) {
    const ringWidth = props?.ring?.width || 2;
    const ringOffsetWidth = props?.offset?.width || 0;
    const ringOffsetColor = props?.offset?.color || this.colors.core.white;
    const ringColor = props?.ring?.color || this.alpha(this.colors.borders.input, 0.75);
    return `0 0 0 ${ringOffsetWidth}px ${ringOffsetColor}, 0 0 0 ${ringWidth + ringOffsetWidth}px ${ringColor}`;
  },

  alpha(hex: string, opacity: number) {
    if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex)) {
      throw new Error('Invalid HEX color format');
    }

    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }

    const clamped = Math.min(1, Math.max(0, opacity));
    const alpha = Math.round(clamped * 255)
      .toString(16)
      .padStart(2, '0');

    return `${hex}${alpha}`;
  },

  zIndex: (multiplier: number) => {
    return 9999 + multiplier;
  },
} as const;
