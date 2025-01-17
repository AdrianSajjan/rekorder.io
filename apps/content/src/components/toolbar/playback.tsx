import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Pause, Play, Trash } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { ResolvedStyle, theme } from '@rekorder.io/ui';

import { framerMotionParentDOM } from '../../lib/utils';
import { recorder } from '../../store/recorder';
import { ToolbarAction } from '../ui/toolbar-action';

const disabled = ['idle', 'saving', 'countdown', 'pending', 'error'];

const RecordControlCSS = css.resolve`
  .rekorder-timer-container {
    height: 100%;
    display: flex;

    align-items: center;
    justify-content: center;

    margin-top: ${theme.space(0.25)};
    border-radius: ${theme.space(10)};
    background-color: ${theme.alpha(theme.colors.text.muted, 0.1)};
    padding: ${theme.space(0.75)} ${theme.space(3)} ${theme.space(0.5)};
  }

  .rekorder-timer-time {
    line-height: 1;
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: ${theme.colors.accent.main};
  }

  .rekorder-save-icon {
    width: ${theme.space(3.5)};
    height: ${theme.space(3.5)};
    border-radius: ${theme.space(1)};
    background-color: ${theme.colors.text.muted};
  }

  .rekorder-save-icon[data-status='active'],
  .rekorder-save-icon[data-status='paused'] {
    background-color: ${theme.colors.destructive.main};
  }
`;

const ToolbarRecordingControls = observer((props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Fragment>
      <ResolvedStyle>{RecordControlCSS}</ResolvedStyle>
      <div {...props}>
        <ToolbarAction tooltip="Save recording" onClick={recorder.saveScreenCapture} disabled={disabled.includes(recorder.status)}>
          <div data-status={recorder.status} className={clsx(RecordControlCSS.className, 'rekorder-save-icon')} />
        </ToolbarAction>
        <ToolbarRecorderTimer />
        <ToolbarRecorderPlayPause />
        <ToolbarAction tooltip="Discard recording" disabled={disabled.includes(recorder.status)}>
          <Trash size={16} weight="bold" />
        </ToolbarAction>
      </div>
    </Fragment>
  );
});

const ToolbarRecorderTimer = observer(() => {
  return (
    <div className={clsx(RecordControlCSS.className, 'rekorder-timer-container')}>
      <AnimatePresence initial={false} mode="popLayout" parentDom={framerMotionParentDOM()}>
        {recorder.time.split('').map((t, i) => (
          <motion.div key={t + i} variants={variants} initial="initial" animate="animate" exit="exit" transition={transition} className={clsx(RecordControlCSS.className, 'rekorder-timer-time')}>
            {t}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

const ToolbarRecorderPlayPause = observer(() => {
  switch (recorder.status) {
    case 'active':
      return (
        <ToolbarAction tooltip="Pause recording" onClick={recorder.pauseScreenCapture} disabled={disabled.includes(recorder.status)}>
          <Pause size={16} weight="fill" />
        </ToolbarAction>
      );

    default:
      return (
        <ToolbarAction tooltip="Resume recording" onClick={recorder.resumeScreenCapture} disabled={disabled.includes(recorder.status)}>
          <Play size={16} weight="fill" />
        </ToolbarAction>
      );
  }
});

const variants = {
  initial: {
    y: 12,
    filter: 'blur(2px)',
    opacity: 0,
  },
  animate: {
    y: 0,
    filter: 'blur(0px)',
    opacity: 1,
  },
  exit: {
    y: -12,
    filter: 'blur(2px)',
    opacity: 0,
  },
};

const transition = {
  type: 'spring',
  bounce: 0.3,
};

export { ToolbarRecordingControls };
