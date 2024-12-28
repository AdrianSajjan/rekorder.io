import { recorder } from "@screenify.io/recorder/store/recorder";
import { observer } from "mobx-react";

const ToolbarRecordTimer = observer(() => {
  return <strong className="px-4 tabular-nums">{recorder.time}</strong>;
});

export { ToolbarRecordTimer };
