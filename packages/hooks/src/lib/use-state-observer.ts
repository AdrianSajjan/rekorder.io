import { useEffect, useState } from 'react';
import { useEventCallback } from './use-event-callback';

interface StateObserverProps {
  options?: MutationObserverInit;
  onGetState: (element: HTMLElement) => string | null;
  onCheckState: (mutation: MutationRecord) => boolean;
}

export function useStateObserver(
  ref: React.RefObject<HTMLElement>,
  { options, onGetState, onCheckState }: StateObserverProps
) {
  const [state, setState] = useState<string | null>(null);

  const handleGetState = useEventCallback(onGetState);
  const handleCheckState = useEventCallback(onCheckState);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const observer = new MutationObserver((list) => {
      for (const mutation of list) {
        if (handleCheckState(mutation)) {
          const state = handleGetState(element);
          setState(state);
        }
      }
    });

    setState(handleGetState(element));
    observer.observe(element, options);

    return () => {
      observer.disconnect();
    };
  }, [ref, options, handleCheckState, handleGetState]);

  return state;
}
