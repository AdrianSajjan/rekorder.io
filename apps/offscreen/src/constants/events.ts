export const ScreenRecorderEvents = Object.freeze({
  SetupWorker: 'setup.worker',
  SetupWorkerSuccess: 'setup.worker.success',
  SetupWorkerError: 'setup.worker.error',

  CaptureStream: 'capture.stream',
  CaptureStreamSuccess: 'capture.stream.success',
  CaptureStreamError: 'capture.stream.error',

  RecordStream: 'record.stream',
  RecordStreamSuccess: 'record.stream.success',
  RecordStreamError: 'record.stream.error',

  PauseStream: 'pause.stream',
  PauseStreamSuccess: 'pause.stream.success',
  PauseStreamError: 'pause.stream.error',

  ResumeStream: 'resume.stream',
  ResumeStreamSuccess: 'resume.stream.success',
  ResumeStreamError: 'resume.stream.error',

  DiscardStream: 'discard.stream',
  DiscardStreamSuccess: 'discard.stream.success',
  DiscardStreamError: 'discard.stream.error',

  SaveStream: 'save.stream',
  SaveStreamSuccess: 'save.stream.success',
  SaveStreamError: 'save.stream.error',
});
