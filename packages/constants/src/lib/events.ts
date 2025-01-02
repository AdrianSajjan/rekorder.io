export const EventConfig = {
  ChangeCameraDevice: 'change.camera.device',
  ChangeCameraEffect: 'change.camera.effect',
  ChangeCameraDevices: 'change.camera.devices',
  ChangeCameraPermission: 'change.camera.permission',

  ChangeAudioDevices: 'change.audio.devices',
  ChangeAudioDevice: 'change.audio.device',
  ChangeAudioPermission: 'change.audio.permission',
  ChangeAudioPushToTalk: 'change.audio.push-to-talk',
  ChangeAudioPushToTalkActivity: 'change.audio.push-to-talk.activity',

  StartStreamCapture: 'start.stream.capture',
  StartStreamCaptureSuccess: 'start.stream.capture.success',
  StartStreamCaptureError: 'start.stream.capture.error',

  PauseStreamCapture: 'pause.stream.capture',
  PauseStreamCaptureSuccess: 'pause.stream.capture.success',
  PauseStreamCaptureError: 'pause.stream.capture.error',

  ResumeStreamCapture: 'resume.stream.capture',
  ResumeStreamCaptureSuccess: 'resume.stream.capture.success',
  ResumeStreamCaptureError: 'resume.stream.capture.error',

  DiscardStreamCapture: 'discard.stream.capture',
  DiscardStreamCaptureSuccess: 'discard.stream.capture.success',
  DiscardStreamCaptureError: 'discard.stream.capture.error',

  SaveCapturedStream: 'save.captured.stream',
  SaveCapturedStreamError: 'save.captured.stream.error',
  SaveCapturedStreamSuccess: 'save.captured.stream.success',

  OpenPermissionSettings: 'open.permissions.settings',
} as const;
