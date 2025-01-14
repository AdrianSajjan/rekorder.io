import css from 'styled-jsx/css';

export const AnimationCSS = css.global`
  @keyframes rekorder-io-slide-down-fade-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes rekorder-io-slide-up-fade-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes rekorder-io-slide-left-fade-in {
    from {
      opacity: 0;
      transform: translateX(-4px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes rekorder-io-slide-right-fade-in {
    from {
      opacity: 0;
      transform: translateX(4px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes rekorder-io-zoom-in-fade-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes rekorder-io-zoom-out-fade-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  @keyframes rekorder-io-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes rekorder-io-fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes rekorder-io-slide-down-fade-out {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(4px);
    }
  }

  @keyframes rekorder-io-slide-up-fade-out {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-4px);
    }
  }

  @keyframes rekorder-io-slide-left-fade-out {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(-4px);
    }
  }

  @keyframes rekorder-io-slide-right-fade-out {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(4px);
    }
  }

  @keyframes rekorder-io-ping {
    75%,
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes rekorder-io-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes rekorder-io-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const animations = {
  spin: 'rekorder-io-spin',
  ping: 'rekorder-io-ping',
  pulse: 'rekorder-io-pulse',
  'slide-up-fade-in': 'rekorder-io-slide-up-fade-in',
  'slide-down-fade-in': 'rekorder-io-slide-down-fade-in',
  'slide-left-fade-in': 'rekorder-io-slide-left-fade-in',
  'slide-right-fade-in': 'rekorder-io-slide-right-fade-in',
  'zoom-in-fade-in': 'rekorder-io-zoom-in-fade-in',
  'zoom-out-fade-out': 'rekorder-io-zoom-out-fade-out',
  'fade-in': 'rekorder-io-fade-in',
  'fade-out': 'rekorder-io-fade-out',
  'slide-up-fade-out': 'rekorder-io-slide-up-fade-out',
  'slide-down-fade-out': 'rekorder-io-slide-down-fade-out',
  'slide-left-fade-out': 'rekorder-io-slide-left-fade-out',
  'slide-right-fade-out': 'rekorder-io-slide-right-fade-out',
};

export const animate = {
  ping: 'rekorder-io-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  pulse: 'rekorder-io-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  spin: 'rekorder-io-spin 2.5s linear infinite',
};
