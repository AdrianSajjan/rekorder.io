import { useCallback, useEffect, useState } from 'react';
import { UserMediaDevice } from '@rekorder.io/types';
import { deserializeOrNull } from '@rekorder.io/utils';
import { CameraConfig, EventConfig } from '@rekorder.io/constants';

export function useRequestCameraDevices() {
  const [devices, setDevices] = useState<UserMediaDevice[]>([]);
  const [permission, setPermission] = useState<PermissionState>('prompt');

  const handleMessageEvents = useCallback((event: MessageEvent) => {
    switch (event.data.type) {
      case EventConfig.CameraPermission: {
        setPermission(event.data.payload.permission);
        break;
      }
      case EventConfig.CameraDevices: {
        const devices = event.data.payload.devices as UserMediaDevice[];
        if (devices) setDevices(devices.filter((device) => device.kind === 'videoinput' && !!device.deviceId));
        break;
      }
    }
  }, []);

  useEffect(() => {
    chrome.storage.local.get([CameraConfig.Permission, CameraConfig.Devices]).then((result) => {
      const permission = result[CameraConfig.Permission] as PermissionState;
      const devices = deserializeOrNull<UserMediaDevice[]>(result[CameraConfig.Devices]);

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
