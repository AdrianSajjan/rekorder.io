import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';

import { useCountdown } from '@rekorder.io/hooks';
import { animations, theme } from '@rekorder.io/ui';

import { RECORD_TIMEOUT } from '../constants/recorder';
import { recorder } from '../store/recorder';

const TimerCSS = css.resolve`
  .rekorder-timer-container {
    top: 50%;
    position: absolute;
    left: 50%;

    display: grid;
    place-items: center;
    pointer-events: none;
    transform: translate(-50%, -50%);

    z-index: 250;
    font-family: ${theme.fonts.default};
    animation: ${animations['fade-in']} 200ms ease-out forwards;
  }

  .rekorder-timer-shape {
    width: auto;
    grid-area: 1 / 1;

    height: ${theme.space(40)};
    animation: rekorder-timer-pulse 2s cubic-bezier(0.4, 0, 0.5, 1) infinite;
  }

  .rekorder-timer-container[data-state='hidden'] .rekorder-timer-shape {
    animation-play-state: paused;
  }

  .rekorder-timer-container[data-state='visible'] .rekorder-timer-text {
    animation-play-state: running;
  }

  .rekorder-timer-text {
    font-size: 72px;
    position: relative;
    z-index: 10;

    grid-area: 1 / 1;
    font-weight: bold;
    color: ${theme.colors.core.black};
  }

  @keyframes rekorder-timer-pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const TimerCountdownHOC = observer(() => {
  if (recorder.status === 'pending') {
    return <TimerCountdown />;
  } else {
    return null;
  }
});

const TimerCountdown = observer(() => {
  const { time } = useCountdown(RECORD_TIMEOUT, 1, true);

  return (
    <Fragment>
      {TimerCSS.styles}
      <div className={clsx(TimerCSS.className, 'rekorder-timer-container')}>
        <svg className={clsx(TimerCSS.className, 'rekorder-timer-shape')} viewBox="0 0 830 930" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M126.5 263.5C333.224 159.786 336.5 -50.1667 486 13C535.5 33.9147 528.8 94.0998 652 88.4998C775.2 82.8998 815.333 275.5 785 411C750 579 854.246 482.865 827 719C785 1083 -125.687 917.5 126.5 719C149.833 693.333 -167.5 411 126.5 263.5Z"
            fill={theme.alpha(theme.colors.primary.main, 0.3)}
          />
        </svg>
        <span className={clsx(TimerCSS.className, 'rekorder-timer-text')}>{time}</span>
      </div>
    </Fragment>
  );
});

export { TimerCountdownHOC as TimerCountdown };
