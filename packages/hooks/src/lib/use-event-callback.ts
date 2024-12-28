import { useCallback, useRef } from 'react';

export function useEventCallback<T extends (...args: any[]) => any>(callback?: T) {
  const ref = useRef(callback);
  const handler = useCallback((...args: Parameters<T>) => ref.current?.(...args), []);
  ref.current = callback;
  return handler as T;
}
