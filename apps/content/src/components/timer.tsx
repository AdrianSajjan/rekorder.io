import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { AnimatePresence, motion, Variants } from 'motion/react';

import { useCountdown } from '@rekorder.io/hooks';
import { animations, ResolvedStyle, theme } from '@rekorder.io/ui';
import { RecorderConfig } from '@rekorder.io/constants';

import { recorder } from '../store/recorder';

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
  switch (recorder.status) {
    case 'countdown':
      return <TimerCountdown />;
    default:
      return null;
  }
});

const TimerCountdown = observer(() => {
  const { time } = useCountdown(RecorderConfig.TimerCountdownSeconds, 1, true);

  return (
    <Fragment>
      <ResolvedStyle>{TimerCSS}</ResolvedStyle>
      <div className={clsx(TimerCSS.className, 'rekorder-timer-container')}>
        <AnimatePresence initial={false}>
          <motion.h3 key={time} variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className={clsx(TimerCSS.className, 'rekorder-timer-text')}>
            {time}
          </motion.h3>
        </AnimatePresence>
        <button className={clsx(TimerCSS.className, 'rekorder-timer-skip')}>Skip</button>
      </div>
    </Fragment>
  );
});

const variants: Variants = {
  initial: {
    y: 10,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    x: 40,
    y: -40,
    scale: 2,
    opacity: 0,
    filter: 'blur(8px)',
    position: 'absolute',
  },
};

const transition = {
  type: 'spring',
  stiffness: 100,
  damping: 10,
};

export { TimerCountdownHOC as TimerCountdown };
