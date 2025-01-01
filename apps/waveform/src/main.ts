import { RuntimeMessage } from '@rekorder.io/types';
import { AudioConfig, EventConfig } from '@rekorder.io/constants';
import { AudioWaveform } from './waveform';

const canvas = document.getElementById('waveform') as HTMLCanvasElement;
const waveform = AudioWaveform.createInstance(canvas);

chrome.storage.local.get([AudioConfig.DeviceId, AudioConfig.PushToTalk], (result) => {
  const deviceId = result[AudioConfig.DeviceId];
  const pushToTalk = result[AudioConfig.PushToTalk] ?? false;

  if (!deviceId || deviceId === 'n/a') return;

  waveform.update(pushToTalk);
  waveform.start({ audio: { deviceId } });
});

window.addEventListener('message', (event: MessageEvent<RuntimeMessage>) => {
  switch (event.data.type) {
    case EventConfig.AudioDevice: {
      const deviceId = event.data.payload.device ?? 'n/a';
      waveform.stop();

      if (!deviceId || deviceId === 'n/a') return;
      waveform.start({ audio: { deviceId } });
      break;
    }

    case EventConfig.AudioPushToTalk: {
      const pushToTalk = event.data.payload.pushToTalk ?? false;
      waveform.update(pushToTalk);
      break;
    }

    case EventConfig.AudioPushToTalkActive: {
      waveform.enableAudioTracks();
      break;
    }

    case EventConfig.AudioPushToTalkInactive: {
      waveform.disableAudioTracks();
      break;
    }
  }
});
