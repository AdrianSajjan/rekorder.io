import { useCallback, useEffect, useState } from 'react';
import { UserMediaDevice } from '@rekorder.io/types';
import { deserializeOrNull } from '@rekorder.io/utils';
import { StorageConfig, EventConfig } from '@rekorder.io/constants';

export function useRequestCameraDevices() {
  const [devices, setDevices] = useState<UserMediaDevice[]>([]);
  const [permission, setPermission] = useState<PermissionState>('prompt');

  const handleMessageEvents = useCallback((event: MessageEvent) => {
    switch (event.data.type) {
      case EventConfig.ChangeCameraPermission: {
        setPermission(event.data.payload.permission);
        break;
      }
      case EventConfig.ChangeCameraDevices: {
        const devices = event.data.payload.devices as UserMediaDevice[];
        if (devices) setDevices(devices.filter((device) => device.kind === 'videoinput' && !!device.deviceId));
        break;
      }
    }
  }, []);

  useEffect(() => {
    chrome.storage.local.get([StorageConfig.CameraPermission, StorageConfig.CameraDevices]).then((result) => {
      const permission = result[StorageConfig.CameraPermission] as PermissionState;
      const devices = deserializeOrNull<UserMediaDevice[]>(result[StorageConfig.CameraDevices]);

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
