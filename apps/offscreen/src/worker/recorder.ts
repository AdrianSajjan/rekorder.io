import { RuntimeMessage } from '@rekorder.io/types';
import type { RecorderCaptureProps } from '../codecs/base';

async function setupWorker() {
  const { MP4Recorder } = await import('../codecs/mp4');
  const { WebMRecorder } = await import('../codecs/webm');
  const { ScreenRecorderEvents } = await import('../constants/events');

  const mp4 = MP4Recorder.createInstance({ clone: true });
  const webm = WebMRecorder.createInstance({ clone: false });

  self.addEventListener('message', (event: MessageEvent<RuntimeMessage>) => {
    switch (event.data.type) {
      case ScreenRecorderEvents.SetupWorker: {
        self.postMessage({ type: ScreenRecorderEvents.SetupWorkerSuccess });
        break;
      }

      case ScreenRecorderEvents.RecordStream: {
        Promise.all([mp4.handleRecordStream(), webm.handleRecordStream()]).then(
          () => {
            self.postMessage({ type: ScreenRecorderEvents.RecordStreamSuccess });
          },
          (error) => {
            self.postMessage({ type: ScreenRecorderEvents.RecordStreamError, payload: error });
          }
        );
        break;
      }

      case ScreenRecorderEvents.CaptureStream: {
        const data = event.data.payload as RecorderCaptureProps;
        const videos = data.videoReadableStream.tee();
        const audios = data.audioReadableStream?.tee();

        Promise.all([
          mp4.handleCaptureStream(Object.assign(data, { videoReadableStream: videos[0], audioReadableStream: audios?.[0] })),
          webm.handleCaptureStream(Object.assign(data, { videoReadableStream: videos[1], audioReadableStream: audios?.[1] })),
        ]).then(
          () => {
            self.postMessage({ type: ScreenRecorderEvents.CaptureStreamSuccess });
          },
          (error) => {
            self.postMessage({ type: ScreenRecorderEvents.CaptureStreamError, payload: error });
          }
        );
        break;
      }

      case ScreenRecorderEvents.SaveStream: {
        Promise.all([mp4.handleSaveStream(), webm.handleSaveStream()]).then(
          ([mp4, webm]) => {
            self.postMessage({ type: ScreenRecorderEvents.SaveStreamSuccess, payload: { mp4, webm } }, [mp4, webm]);
          },
          (error) => {
            self.postMessage({ type: ScreenRecorderEvents.SaveStreamError, payload: error });
          }
        );
        break;
      }
    }
  });
}

setupWorker();
