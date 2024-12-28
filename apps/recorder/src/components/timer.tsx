import { observer } from "mobx-react";
import { recorder } from "@screenify.io/recorder/store/recorder";
import { useCountdown } from "@screenify.io/recorder/hooks/use-countdown";
import { RECORD_TIMEOUT } from "@screenify.io/recorder/constants/recorder";

const TimerHOC = observer(() => {
  if (recorder.status === "pending") {
    return <Timer />;
  } else {
    return null;
  }
});

const Timer = observer(() => {
  const { time } = useCountdown(RECORD_TIMEOUT, 1, true);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
      <span className="animate-ping duration-500 direction-alternate-reverse text-8xl font-bold">{time}</span>
    </div>
  );
});

export { TimerHOC as Timer };
