import { useCallback, useEffect, useState } from 'react';
import { UserMediaDevice } from '@rekorder.io/types';
import { AudioConfig, EventConfig } from '@rekorder.io/constants';
import { clone, serialize } from '@rekorder.io/utils';

export function useRequestAudioDevices() {
  const [microphones, setMicrophones] = useState<UserMediaDevice[]>([]);
  const [permission, setPermission] = useState<PermissionState>('prompt');

  const handleChangeAudioPermission = useCallback((permission: PermissionState) => {
    setPermission(permission);
    chrome.storage.local.set({ [AudioConfig.Permission]: permission });
    window.parent.postMessage(clone({ type: EventConfig.AudioPermission, payload: { permission } }), '*');
  }, []);

  const handleChangeAudioDevices = useCallback((devices: UserMediaDevice[]) => {
    setMicrophones(devices);
    chrome.storage.local.set({ [AudioConfig.Devices]: serialize(devices) });
    window.parent.postMessage(clone({ type: EventConfig.AudioDevices, payload: { devices } }), '*');
  }, []);

  const handleQueryDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const microphones = devices.filter((device) => device.kind === 'audioinput' && !!device.deviceId);
    handleChangeAudioDevices(microphones);
  }, [handleChangeAudioDevices]);

  const handleRequestPermission = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
  }, []);

  const handlePermissionChange = useCallback(async () => {
    const status = await navigator.permissions.query({ name: 'Audio' as PermissionName });

    if (status.state !== permission) {
      handleChangeAudioPermission(status.state);

      switch (status.state) {
        case 'granted':
          handleQueryDevices();
          break;
        case 'prompt':
          handleRequestPermission().then(handleQueryDevices);
          break;
      }
    }
  }, [handleQueryDevices, handleRequestPermission, handleChangeAudioPermission, permission]);

  useEffect(() => {
    let status: PermissionStatus;

    navigator.permissions.query({ name: 'Audio' as PermissionName }).then((permission) => {
      status = permission;
      handleChangeAudioPermission(permission.state);
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
  }, [handleQueryDevices, handlePermissionChange, handleRequestPermission, handleChangeAudioPermission]);

  return { microphones, permission };
}
