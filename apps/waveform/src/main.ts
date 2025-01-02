import { RuntimeMessage } from '@rekorder.io/types';
import { StorageConfig, EventConfig } from '@rekorder.io/constants';
import { AudioWaveform } from './waveform';

const canvas = document.getElementById('waveform') as HTMLCanvasElement;
const waveform = AudioWaveform.createInstance(canvas);

chrome.storage.local.get([StorageConfig.AudioDeviceId, StorageConfig.AudioPushToTalk], (result) => {
  const deviceId = result[StorageConfig.AudioDeviceId];
  const pushToTalk = result[StorageConfig.AudioPushToTalk] ?? false;

  if (!deviceId || deviceId === 'n/a') return;

  waveform.update(pushToTalk);
  waveform.start({ audio: { deviceId } });
});

window.addEventListener('message', (event: MessageEvent<RuntimeMessage>) => {
  switch (event.data.type) {
    case EventConfig.ChangeAudioDevice: {
      const deviceId = event.data.payload.device ?? 'n/a';
      waveform.stop();

      if (!deviceId || deviceId === 'n/a') return;
      waveform.start({ audio: { deviceId } });
      break;
    }

    case EventConfig.ChangeAudioPushToTalk: {
      const pushToTalk = event.data.payload.active ?? false;
      waveform.update(pushToTalk);
      break;
    }

    case EventConfig.ChangeAudioPushToTalkActivity: {
      if (event.data.payload.active) {
        waveform.enableAudioTracks();
      } else {
        waveform.disableAudioTracks();
      }
      break;
    }
  }
});
