import { useState, useEffect, useCallback } from "react";

export function useCountdown(startTime = 3, endTime = 0, autoStart = false) {
  const [time, setTime] = useState(startTime);
  const [running, setRunning] = useState(autoStart);

  const start = useCallback(() => {
    if (time > endTime) {
      setRunning(true);
    }
  }, [time, endTime]);

  const reset = useCallback(() => {
    setRunning(false);
    setTime(startTime);
  }, [startTime]);

  useEffect(() => {
    if (!running) return;
    let timer: number;

    if (time > endTime) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          return prevTime - 1;
        });
      }, 1000);
    } else {
      setRunning(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [running, time, endTime]);

  return { time, start, reset };
}
