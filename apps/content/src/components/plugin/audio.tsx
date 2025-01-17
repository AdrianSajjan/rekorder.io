import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { AlertDialog, ResolvedStyle, Select, StatusBadge, Switch, theme } from '@rekorder.io/ui';
import { Microphone, MicrophoneSlash } from '@phosphor-icons/react';

import { SwitchLabel } from '../ui/switch-label';
import { microphone } from '../../store/microphone';
import { useRequestAudioDevices } from '../../hooks/use-audio-devices';
import { openPermissionSettings, shadowRootElementById } from '../../lib/utils';

const AudioPluginCSS = css.resolve`
  .rekorder-audio-container {
    display: flex;
    flex-direction: column;
    gap: ${theme.space(5)};
  }

  .rekorder-select-input {
    width: 100%;
  }

  .rekorder-select-value {
    flex: 1;
    display: flex;
    align-items: center;
    gap: ${theme.space(3)};
  }

  .rekorder-select-value-label {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .rekorder-select-badge {
    margin-left: auto;
  }

  .rekorder-toggle-control {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rekorder-push-to-talk-command {
    font-size: 12px;
    color: ${theme.colors.background.text};
  }

  .rekorder-waveform {
    width: 100%;
    height: ${theme.space(10)};
  }
`;

const AudioPlugin = observer(() => {
  const { devices: microphones, permission } = useRequestAudioDevices();

  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isMicrophoneSelectOpen, setMicrophoneSelectOpen] = useState(false);

  const handleMicrophoneSelectOpenChange = (open: boolean) => {
    if (open) {
      if (permission === 'denied') setAlertDialogOpen(true);
      else setMicrophoneSelectOpen(open);
    } else {
      setMicrophoneSelectOpen(open);
    }
  };

  return (
    <Fragment>
      <ResolvedStyle>{AudioPluginCSS}</ResolvedStyle>
      <div className={clsx(AudioPluginCSS.className, 'rekorder-audio-container')}>
        <Select value={microphone.device} onValueChange={microphone.changeDevice} open={isMicrophoneSelectOpen} onOpenChange={handleMicrophoneSelectOpenChange}>
          <Select.Input className={clsx(AudioPluginCSS.className, 'rekorder-select-input')}>
            <div className={clsx(AudioPluginCSS.className, 'rekorder-select-value')}>
              {microphone.device === 'n/a' ? <MicrophoneSlash size={16} /> : <Microphone size={16} />}
              <span className={clsx(AudioPluginCSS.className, 'rekorder-select-value-label')}>
                {microphone.device === 'n/a' ? 'No Microphone' : microphones.find((m) => m.deviceId === microphone.device)?.label}
              </span>
              {microphone.device === 'n/a' ? (
                <StatusBadge variant="error" className={clsx(AudioPluginCSS.className, 'rekorder-select-badge')}>
                  Off
                </StatusBadge>
              ) : null}
            </div>
          </Select.Input>
          <Select.Content portal={shadowRootElementById('rekorder-area')}>
            <Select.Item value="n/a">No Microphone</Select.Item>
            {microphones.length ? <Select.Separator /> : null}
            {microphones.map((microphone, index) => (
              <Select.Item key={microphone.deviceId} value={microphone.deviceId}>
                {microphone.label || `Microphone ${index + 1}`}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <div className={clsx(AudioPluginCSS.className, 'rekorder-toggle-control')}>
          <SwitchLabel htmlFor="push-to-talk">
            Push to Talk <small className={clsx(AudioPluginCSS.className, 'rekorder-push-to-talk-command')}>(⌥⇧U)</small>
          </SwitchLabel>
          <Switch checked={microphone.pushToTalk} onCheckedChange={microphone.updatePushToTalk} id="push-to-talk" />
        </div>
        {microphone.device !== 'n/a' ? (
          <iframe
            title="Waveform"
            id="rekorder-waveform-iframe"
            src={chrome.runtime.getURL('/build/waveform.html')}
            className={clsx(AudioPluginCSS.className, 'rekorder-waveform')}
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
