export const EventConfig = {
  CameraDevices: 'camera.devices',
  CameraPermission: 'camera.permission',
  CameraDevice: 'camera.device',
  CameraEffect: 'camera.effect',

  AudioDevices: 'audio.devices',
  AudioPermission: 'audio.permission',
  AudioDevice: 'audio.device',
  AudioPushToTalk: 'audio.push-to-talk',
  AudioPushToTalkActive: 'audio.push-to-talk.active',
  AudioPushToTalkInactive: 'audio.push-to-talk.inactive',

  StreamStartCapture: 'stream.start.capture',
  StreamStopCapture: 'stream.stop.capture',
  StreamPauseCapture: 'stream.pause.capture',
  StreamResumeCapture: 'stream.resume.capture',
  StreamCancelCapture: 'stream.cancel.capture',

  StreamSaveError: 'stream.save.error',
  StreamSaveSuccess: 'stream.save.success',
  StreamCaptureSuccess: 'stream.capture.success',
  StreamCaptureError: 'stream.capture.error',

  TabCapture: 'tab.capture',
  TabCaptureSuccess: 'tab.capture.success',
  TabCaptureError: 'tab.capture.error',
  OpenPermissionSettings: 'open.permissions.settings',
} as const;
