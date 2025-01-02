import { useCallback, useEffect, useState } from 'react';
import { UserMediaDevice } from '@rekorder.io/types';
import { deserializeOrNull } from '@rekorder.io/utils';
import { StorageConfig, EventConfig } from '@rekorder.io/constants';

export function useRequestAudioDevices() {
  const [devices, setDevices] = useState<UserMediaDevice[]>([]);
  const [permission, setPermission] = useState<PermissionState>('prompt');

  const handleMessageEvents = useCallback((event: MessageEvent) => {
    switch (event.data.type) {
      case EventConfig.ChangeAudioPermission: {
        setPermission(event.data.payload.permission);
        break;
      }
      case EventConfig.ChangeAudioDevices: {
        const devices = event.data.payload.devices as UserMediaDevice[];
        if (devices) setDevices(devices.filter((device) => device.kind === 'audioinput' && !!device.deviceId));
        break;
      }
    }
  }, []);

  useEffect(() => {
    chrome.storage.local.get([StorageConfig.AudioPermission, StorageConfig.AudioDevices]).then((result) => {
      const permission = result[StorageConfig.AudioPermission] as PermissionState;
      const devices = deserializeOrNull<UserMediaDevice[]>(result[StorageConfig.AudioDevices]);

      if (permission) setPermission(permission);
      if (devices) setDevices(devices.filter((device) => device.kind === 'audioinput' && !!device.deviceId));
    });
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessageEvents);
    return () => window.removeEventListener('message', handleMessageEvents);
  }, [handleMessageEvents]);

  return { permission, devices };
}
