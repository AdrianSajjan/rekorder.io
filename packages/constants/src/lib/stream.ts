export const StreamConfig = {
  StartCapture: 'capture.stream.start',
  StopCapture: 'capture.stream.stop',
  PauseCapture: 'capture.stream.pause',
  ResumeCapture: 'capture.stream.resume',
  CancelCapture: 'capture.stream.cancel',

  SaveError: 'save.stream.error',
  SaveSuccess: 'save.stream.success',
  CaptureSuccess: 'capture.stream.success',
  CaptureError: 'capture.stream.error',
} as const;
