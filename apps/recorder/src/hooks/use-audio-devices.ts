import { useCallback, useEffect, useState } from 'react';
import { UserMediaDevice } from '@rekorder.io/types';
import { deserializeOrNull } from '@rekorder.io/utils';
import { AudioConfig, EventConfig } from '@rekorder.io/constants';

export function useRequestAudioDevices() {
  const [devices, setDevices] = useState<UserMediaDevice[]>([]);
  const [permission, setPermission] = useState<PermissionState>('prompt');

  const handleMessageEvents = useCallback((event: MessageEvent) => {
    switch (event.data.type) {
      case EventConfig.AudioPermission:
        setPermission(event.data.payload.permission);
        break;
      case EventConfig.AudioDevices:
        setDevices(event.data.payload.devices);
        break;
    }
  }, []);

  useEffect(() => {
    chrome.storage.local.get([AudioConfig.Permission, AudioConfig.Devices]).then((result) => {
      const permission = result[AudioConfig.Permission] as PermissionState;
      const devices = deserializeOrNull<UserMediaDevice[]>(result[AudioConfig.Devices]);

      if (permission) setPermission(permission);
      if (devices) setDevices(devices.filter((device) => device.kind === 'videoinput' && !!device.deviceId));
    });
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessageEvents);
    return () => window.removeEventListener('message', handleMessageEvents);
  }, [handleMessageEvents]);

  return { permission, devices };
}
