import { useCallback, useEffect, useState } from 'react';
import { UserMediaDevice } from '@rekorder.io/types';
import { CameraConfig, EventConfig } from '@rekorder.io/constants';
import { clone, serialize } from '@rekorder.io/utils';

export function useRequestCameraDevices() {
  const [cameras, setCameras] = useState<UserMediaDevice[]>([]);
  const [permission, setPermission] = useState<PermissionState>('prompt');

  const handleChangeCameraPermission = useCallback((permission: PermissionState) => {
    setPermission(permission);
    chrome.storage.local.set({ [CameraConfig.Permission]: permission });
    window.parent.postMessage(clone({ type: EventConfig.CameraPermission, payload: { permission } }), '*');
  }, []);

  const handleChangeCameraDevices = useCallback((devices: UserMediaDevice[]) => {
    setCameras(devices);
    chrome.storage.local.set({ [CameraConfig.Devices]: serialize(devices) });
    window.parent.postMessage(clone({ type: EventConfig.CameraDevices, payload: { devices } }), '*');
  }, []);

  const handleQueryDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput' && !!device.deviceId);
    handleChangeCameraDevices(cameras);
  }, [handleChangeCameraDevices]);

  const handleRequestPermission = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
  }, []);

  const handlePermissionChange = useCallback(async () => {
    const status = await navigator.permissions.query({ name: 'camera' as PermissionName });

    if (status.state !== permission) {
      handleChangeCameraPermission(status.state);

      switch (status.state) {
        case 'granted':
          handleQueryDevices();
          break;
        case 'prompt':
          handleRequestPermission().then(handleQueryDevices);
          break;
      }
    }
  }, [handleQueryDevices, handleRequestPermission, handleChangeCameraPermission, permission]);

  useEffect(() => {
    let status: PermissionStatus;

    navigator.permissions.query({ name: 'camera' as PermissionName }).then((permission) => {
      status = permission;
      handleChangeCameraPermission(permission.state);
      status.addEventListener('change', handlePermissionChange);

      switch (permission.state) {
        case 'granted':
          handleQueryDevices();
          break;
        case 'prompt':
          handleRequestPermission();
          break;
      }
    });

    return () => {
      if (status) status.removeEventListener('change', handlePermissionChange);
    };
  }, [handleQueryDevices, handlePermissionChange, handleRequestPermission, handleChangeCameraPermission]);

  return { cameras, permission };
}
