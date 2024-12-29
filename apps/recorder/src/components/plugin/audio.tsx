import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';

import { animations, Select, StatusBadge, Switch, theme } from '@rekorder.io/ui';
import { Microphone, MicrophoneSlash } from '@phosphor-icons/react';

import { microphone } from '../../store/microphone';
import { useFetchUserMicrophoneDevices } from '../../hooks/use-microphone';
import { useAudioWaveform } from '../../hooks/use-audio-waveform';

const AudioPluginCSS = css.resolve`
  .rekorder-audio-container {
    display: flex;
    flex-direction: column;
    gap: ${theme.space(5)};

    animation-name: ${animations['fade-in']};
    animation-duration: 300ms;
    animation-timing-function: ease-out;
  }

  .select-input {
    width: 100%;
  }

  .select-value {
    display: flex;
    align-items: center;
    gap: ${theme.space(3)};
    flex: 1;
  }

  .select-badge {
    margin-left: auto;
  }

  .toggle-control {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space(3)};
  }

  .toggle-control-label {
    font-size: 14px;
  }

  .push-to-talk-command {
    font-size: 12px;
  }

  .waveform {
    width: 100%;
    height: ${theme.space(10)};
  }
`;

const AudioPlugin = observer(() => {
  const microphones = useFetchUserMicrophoneDevices();
  const waveform = useAudioWaveform(microphone.device, microphone.pushToTalk);

  return (
    <Fragment>
      {AudioPluginCSS.styles}
      <div className={clsx(AudioPluginCSS.className, 'rekorder-audio-container')}>
        <Select value={microphone.device} onValueChange={microphone.changeDevice}>
          <Select.Input className={clsx(AudioPluginCSS.className, 'select-input')}>
            <div className={clsx(AudioPluginCSS.className, 'select-value')}>
              {microphone.device === 'n/a' ? <MicrophoneSlash size={16} /> : <Microphone size={16} />}
              {microphone.device === 'n/a'
                ? 'No Microphone'
                : microphones.find((m) => m.deviceId === microphone.device)?.label}
              {microphone.device === 'n/a' ? (
                <StatusBadge variant="error" className={clsx(AudioPluginCSS.className, 'select-badge')}>
                  Off
                </StatusBadge>
              ) : null}
            </div>
          </Select.Input>
          <Select.Content>
            <Select.Item value="n/a">No Microphone</Select.Item>
            {microphones.length ? <Select.Separator /> : null}
            {microphones.map((microphone, index) => (
              <Select.Item key={microphone.deviceId} value={microphone.deviceId}>
                {microphone.label || `Microphone ${index + 1}`}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <div className={clsx(AudioPluginCSS.className, 'toggle-control')}>
          <label htmlFor="push-to-talk" className={clsx(AudioPluginCSS.className, 'toggle-control-label')}>
            Push to Talk <small className={clsx(AudioPluginCSS.className, 'push-to-talk-command')}>(⌥⇧U)</small>
          </label>
          <Switch checked={microphone.pushToTalk} onCheckedChange={microphone.updatePushToTalk} id="push-to-talk" />
        </div>
        {microphone.device !== 'n/a' ? (
          <canvas id="waveform" ref={waveform} className={clsx(AudioPluginCSS.className, 'waveform')} />
        ) : null}
      </div>
    </Fragment>
  );
});

export { AudioPlugin };
