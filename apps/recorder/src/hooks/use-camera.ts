import { useEffect, useState } from 'react';
import { UserMediaDevice } from '../types/core';

export function useFetchUserCameraDevices() {
  const [cameras, setCameras] = useState<UserMediaDevice[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((devices) => setCameras(devices.filter((device) => device.kind === 'videoinput' && !!device.deviceId)));
  }, []);

  return cameras;
}
