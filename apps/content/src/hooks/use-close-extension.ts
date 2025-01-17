import { useCallback, useEffect } from 'react';
import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';

import { useDisposeEvents } from './use-dispose-events';
import { closeExtension } from '../lib/utils';

export function useCloseExtensionListener() {
  const handleDispose = useDisposeEvents();

  const handleRuntimeMessage = useCallback(
    (message: RuntimeMessage) => {
      if (message.type === EventConfig.CloseExtension) {
        handleDispose();
        closeExtension();
      }
    },
    [handleDispose]
  );

  useEffect(() => {
    if (import.meta.env.DEV) return;
    chrome.runtime.onMessage.addListener(handleRuntimeMessage);
    return () => chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
  }, [handleRuntimeMessage]);
}
