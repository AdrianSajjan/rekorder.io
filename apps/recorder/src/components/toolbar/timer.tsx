import { observer } from 'mobx-react';
import { recorder } from '../../store/recorder';

const ToolbarRecordTimer = observer(() => {
  return <strong className="px-4 tabular-nums">{recorder.time}</strong>;
});

export { ToolbarRecordTimer };
