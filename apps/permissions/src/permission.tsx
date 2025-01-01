import { useRequestCameraDevices } from '@rekorder.io/hooks';

export function Permission() {
  useRequestCameraDevices();
  return null;
}
