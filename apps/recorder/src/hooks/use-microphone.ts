import { useEffect, useState } from 'react';
import { UserMediaDevice } from '../types/core';

export function useFetchUserMicrophoneDevices() {
  const [microphones, setMicrophones] = useState<UserMediaDevice[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => setMicrophones(devices.filter((device) => device.kind === 'audioinput' && !!device.deviceId)));
  }, []);

  return microphones;
}
