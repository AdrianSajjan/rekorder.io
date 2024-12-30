import clsx from 'clsx';
import css from 'styled-jsx/css';
import { observer } from 'mobx-react';

import { useCountdown } from '@rekorder.io/hooks';
import { animate, theme } from '@rekorder.io/ui';

import { recorder } from '../store/recorder';
import { RECORD_TIMEOUT } from '../constants/recorder';
import { Fragment } from 'react/jsx-runtime';

const TimerCountdown = observer(() => {
  if (recorder.status === 'pending') {
    return <Timer />;
  } else {
    return null;
  }
});

const TimerCSS = css.resolve`
  .rekorder-timer-container {
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: auto;

    top: 50%;
    left: 50%;
    font-family: ${theme.fonts.default};
  }

  .text {
    font-size: 96px;
    font-weight: bold;
    animation: ${animate.ping};
  }
`;

const Timer = observer(() => {
  const { time } = useCountdown(RECORD_TIMEOUT, 1, true);

  return (
    <Fragment>
      {TimerCSS.styles}
      <div className={clsx(TimerCSS.className, 'rekorder-timer-container')}>
        <span className={clsx(TimerCSS.className, 'text')}>{time}</span>
      </div>
    </Fragment>
  );
});

export { TimerCountdown };
