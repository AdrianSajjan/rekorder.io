import css from 'styled-jsx/css';
import clsx from 'clsx';

import { observer } from 'mobx-react';
import { theme } from '@rekorder.io/ui';

import { recorder } from '../../store/recorder';

const RecordTimerCSS = css.resolve`
  .timer {
    display: flex;
    align-items: center;
    gap: ${theme.space(2)};
  }

  .time {
    font-size: 14px;
    font-weight: 500;
    color: ${theme.colors.background.text};
  }
`;

const ToolbarRecordTimer = observer((props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      {RecordTimerCSS.styles}
      <div className={clsx(RecordTimerCSS.className, 'timer')}>
        <span className={clsx(RecordTimerCSS.className, 'time')}>{recorder.time}</span>
      </div>
    </div>
  );
});

export { ToolbarRecordTimer };
