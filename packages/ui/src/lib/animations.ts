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

  @keyframes rekorder-io-zoom-out-fade-in {
    from {
      opacity: 0;
      transform: scale(1.1);
    }
    to {
      opacity: 1;
      transform: scale(1);
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
      transform: translateY(-4px);
    }
  }

  @keyframes rekorder-io-slide-up-fade-out {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(4px);
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
`;

export const animations = {
  'slide-up-fade-in': 'rekorder-io-slide-up-fade-in',
  'slide-down-fade-in': 'rekorder-io-slide-down-fade-in',
  'slide-left-fade-in': 'rekorder-io-slide-left-fade-in',
  'slide-right-fade-in': 'rekorder-io-slide-right-fade-in',
  'zoom-out-fade-in': 'rekorder-io-zoom-out-fade-in',
  'zoom-in-fade-in': 'rekorder-io-zoom-in-fade-in',
  'fade-in': 'rekorder-io-fade-in',
  'fade-out': 'rekorder-io-fade-out',
  'slide-up-fade-out': 'rekorder-io-slide-up-fade-out',
  'slide-down-fade-out': 'rekorder-io-slide-down-fade-out',
  'slide-left-fade-out': 'rekorder-io-slide-left-fade-out',
  'slide-right-fade-out': 'rekorder-io-slide-right-fade-out',
};
