import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { useState } from 'react';

import { AlertDialog, animations, Select, StatusBadge, Switch, theme } from '@rekorder.io/ui';
import { Microphone, MicrophoneSlash } from '@phosphor-icons/react';

import { microphone } from '../../store/microphone';
import { openPermissionSettings } from '../../lib/utils';
import { useRequestAudioDevices } from '../../hooks/use-audio-devices';

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

  .select-value-label {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
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
    color: ${theme.colors.background.text};
  }

  .push-to-talk-command {
    font-size: 12px;
    color: ${theme.colors.background.text};
  }

  .waveform {
    width: 100%;
    height: ${theme.space(10)};
  }
`;

const AudioPlugin = observer(() => {
  const { devices: microphones, permission } = useRequestAudioDevices();

  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isMicrophoneSelectOpen, setMicrophoneSelectOpen] = useState(false);

  const handleMicrophoneSelectOpenChange = (open: boolean) => {
    if (!open || permission !== 'denied') setMicrophoneSelectOpen(open);
    if (open && permission === 'denied') setAlertDialogOpen(true);
  };

  return (
    <Fragment>
      {AudioPluginCSS.styles}
      <div className={clsx(AudioPluginCSS.className, 'rekorder-audio-container')}>
        <Select value={microphone.device} onValueChange={microphone.changeDevice} open={isMicrophoneSelectOpen} onOpenChange={handleMicrophoneSelectOpenChange}>
          <Select.Input className={clsx(AudioPluginCSS.className, 'select-input')}>
            <div className={clsx(AudioPluginCSS.className, 'select-value')}>
              {microphone.device === 'n/a' ? <MicrophoneSlash size={16} /> : <Microphone size={16} />}
              <span className={clsx(AudioPluginCSS.className, 'select-value-label')}>
                {microphone.device === 'n/a' ? 'No Microphone' : microphones.find((m) => m.deviceId === microphone.device)?.label}
              </span>
              {microphone.device === 'n/a' ? (
                <StatusBadge variant="error" className={clsx(AudioPluginCSS.className, 'select-badge')}>
                  Off
                </StatusBadge>
              ) : null}
            </div>
          </Select.Input>
          <Select.Content portal={document.getElementById('rekorder-area')}>
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
          <iframe
            title="Waveform"
            id="rekorder-waveform-iframe"
            src={chrome.runtime.getURL('/build/waveform.html')}
            className={clsx(AudioPluginCSS.className, 'waveform')}
            allow="microphone *"
          />
        ) : null}
      </div>
      <AlertDialog
        open={isAlertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        title="Microphone permission denied"
        onConfirm={openPermissionSettings}
        description="Please allow access to your microphone to use this feature. Click on the continue button to open the microphone settings and allow access."
      />
    </Fragment>
  );
});

export { AudioPlugin };
