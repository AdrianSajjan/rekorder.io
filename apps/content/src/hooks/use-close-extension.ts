import { useCallback, useEffect } from 'react';
import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';

import { RECORDER_ROOT } from '../constants/layout';
import { useDisposeEvents } from './use-dispose-events';

export function useCloseExtensionListener() {
  const handleDispose = useDisposeEvents();

  const handleRuntimeMessage = useCallback(
    (message: RuntimeMessage) => {
      if (message.type === EventConfig.CloseExtension) {
        console.log('Closing extension: Disposing events');
        handleDispose();
        console.log('Closing extension: Current listener removed');
        chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
        console.log('Closing extension: Removing root element');
        const node = document.getElementById(RECORDER_ROOT);
        if (node) node.remove();
      }
    },
    [handleDispose]
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleRuntimeMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
      handleDispose();
    };
  }, [handleRuntimeMessage, handleDispose]);
}
