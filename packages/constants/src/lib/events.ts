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
  ChangeAudioMutedState: 'change.audio.muted.state',

  StartStreamRecording: 'start.stream.recording',
  StartStreamRecordingSuccess: 'start.stream.recording.success',
  StartStreamRecordingError: 'start.stream.recording.error',

  StartTabStreamCapture: 'start.tab.stream.capture',
  StartDisplayStreamCapture: 'start.display.stream.capture',
  StartStreamCaptureSuccess: 'start.stream.capture.success',
  StartStreamCaptureError: 'start.stream.capture.error',

  PauseStreamCapture: 'pause.stream.capture',
  PauseStreamCaptureSuccess: 'pause.stream.capture.success',
  PauseStreamCaptureError: 'pause.stream.capture.error',

  ResumeStreamCapture: 'resume.stream.capture',
  ResumeStreamCaptureSuccess: 'resume.stream.capture.success',
  ResumeStreamCaptureError: 'resume.stream.capture.error',

  CancelStreamCapture: 'cancel.stream.capture',
  CancelStreamCaptureSuccess: 'cancel.stream.capture.success',
  CancelStreamCaptureError: 'cancel.stream.capture.error',

  DiscardStreamCapture: 'discard.stream.capture',
  DiscardStreamCaptureSuccess: 'discard.stream.capture.success',
  DiscardStreamCaptureError: 'discard.stream.capture.error',

  SaveCapturedStream: 'save.captured.stream',
  SaveCapturedStreamError: 'save.captured.stream.error',
  SaveCapturedStreamSuccess: 'save.captured.stream.success',

  OpenPermissionSettings: 'open.permissions.settings',
  CloseExtension: 'close.extension',

  SetSessionStorage: 'set.session.storage',
  SetSessionStorageSuccess: 'set.session.storage.success',
  SetSessionStorageError: 'set.session.storage.error',

  GetSessionStorage: 'get.session.storage',
  GetSessionStorageSuccess: 'get.session.storage.success',
  GetSessionStorageError: 'get.session.storage.error',

  AuthenticateEditor: 'authenticate.editor',
  AuthenticateSuccess: 'authenticate.success',
  AuthenticateError: 'authenticate.error',

  InitializeEditor: 'initialize.editor',
  InitializeEditorSuccess: 'initialize.editor.success',
  InitializeEditorError: 'initialize.editor.error',
} as const;
