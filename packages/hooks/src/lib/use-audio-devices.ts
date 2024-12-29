import { UserMediaDevice } from '@rekorder.io/types';
import { useCallback, useEffect, useState } from 'react';

export function useFetchUserAudioDevices() {
  const [microphones, setMicrophones] = useState<UserMediaDevice[]>([]);
  const [permission, setPermission] = useState<PermissionState>();

  const handleQueryDevices = useCallback(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => setMicrophones(devices.filter((device) => device.kind === 'audioinput' && !!device.deviceId)));
  }, []);

  const handlePermissionChange = useCallback(() => {
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((status) => {
      setPermission(status.state);
      if (status.state === 'granted') handleQueryDevices();
    });
  }, [handleQueryDevices]);

  useEffect(() => {
    let status: PermissionStatus;

    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permission) => {
      status = permission;

      setPermission(permission.state);
      permission.addEventListener('change', handlePermissionChange);

      switch (permission.state) {
        case 'granted':
          handleQueryDevices();
          break;

        case 'prompt':
          navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            handleQueryDevices();
            stream.getTracks().forEach((track) => track.stop());
          });
          break;
      }
    });

    return () => {
      if (status) status.removeEventListener('change', handleQueryDevices);
    };
  }, [handlePermissionChange, handleQueryDevices]);

  return { microphones, permission };
}
