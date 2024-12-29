import { useCallback, useEffect, useState } from 'react';
import { UserMediaDevice } from '@rekorder.io/types';

export function useFetchUserCameraDevices() {
  const [cameras, setCameras] = useState<UserMediaDevice[]>([]);
  const [permission, setPermission] = useState<PermissionState>();

  const handleQueryDevices = useCallback(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => setCameras(devices.filter((device) => device.kind === 'videoinput' && !!device.deviceId)));
  }, []);

  const handlePermissionChange = useCallback(() => {
    navigator.permissions.query({ name: 'camera' as PermissionName }).then((status) => {
      setPermission(status.state);
      if (status.state === 'granted') handleQueryDevices();
    });
  }, [handleQueryDevices]);

  useEffect(() => {
    let status: PermissionStatus;

    navigator.permissions.query({ name: 'camera' as PermissionName }).then((permission) => {
      status = permission;

      setPermission(permission.state);
      permission.addEventListener('change', handlePermissionChange);

      switch (permission.state) {
        case 'granted':
          handleQueryDevices();
          break;

        case 'prompt':
          navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            handleQueryDevices();
            stream.getTracks().forEach((track) => track.stop());
          });
          break;
      }
    });

    return () => {
      if (status) status.removeEventListener('change', handlePermissionChange);
    };
  }, [handleQueryDevices, handlePermissionChange]);

  return { cameras, permission };
}
