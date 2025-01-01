import { useRequestCameraDevices, useRequestAudioDevices } from '@rekorder.io/hooks';

export function Permission() {
  useRequestCameraDevices();
  useRequestAudioDevices();
  return null;
}
