import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';

import { useCountdown } from '@rekorder.io/hooks';
import { animations, theme } from '@rekorder.io/ui';
import { RecorderConfig } from '@rekorder.io/constants';

import { recorder } from '../store/recorder';
import { AnimatePresence, motion } from 'framer-motion';

const TimerCSS = css.resolve`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  .rekorder-timer-container {
    top: 50%;
    left: 50%;
    position: absolute;

    z-index: 250;
    pointer-events: all;

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, oklch(27.3% 0.09 275), oklch(31.1% 0.146 303), oklch(36.3% 0.127 308));

    gap: ${theme.space(3)};
    width: ${theme.space(45)};
    height: ${theme.space(45)};
    border-radius: ${theme.space(45)};

    font-family: ${theme.fonts.default};
    animation: ${animations['fade-in']} 200ms ease-out forwards;
  }

  .rekorder-timer-text {
    font-size: 72px;
    font-weight: bold;
    font-variant-numeric: tabular-nums;
    color: ${theme.colors.core.white};
  }

  .rekorder-timer-skip {
    all: unset;
    cursor: pointer;
    font-size: 14px;
    color: ${theme.colors.core.white};
  }

  .rekorder-timer-skip:hover {
    text-decoration: underline;
  }
`;

const TimerCountdownHOC = observer(() => {
  if (recorder.status === 'countdown') {
    return <TimerCountdown />;
  } else {
    return null;
  }
});

const TimerCountdown = observer(() => {
  const { time } = useCountdown(RecorderConfig.TimerCountdownSeconds, 1, true);

  return (
    <Fragment>
      {TimerCSS.styles}
      <div className={clsx(TimerCSS.className, 'rekorder-timer-container')}>
        <AnimatePresence>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, x: 40, filter: 'blur(8px)', scale: 2, position: 'absolute' }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            className={clsx(TimerCSS.className, 'rekorder-timer-text')}
            key={time}
          >
            {time}
          </motion.h3>
        </AnimatePresence>
        <button className={clsx(TimerCSS.className, 'rekorder-timer-skip')}>Skip</button>
      </div>
    </Fragment>
  );
});

export { TimerCountdownHOC as TimerCountdown };
