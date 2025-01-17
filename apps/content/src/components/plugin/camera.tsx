import clsx from 'clsx';
import css from 'styled-jsx/css';

import { useState } from 'react';
import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';

import { VideoCamera, VideoCameraSlash } from '@phosphor-icons/react';
import { AlertDialog, ResolvedStyle, Select, StatusBadge, Switch, theme } from '@rekorder.io/ui';

import { camera } from '../../store/camera';
import { SwitchLabel } from '../ui/switch-label';
import { useRequestCameraDevices } from '../../hooks/use-camera-devices';
import { openPermissionSettings, shadowRootElementById } from '../../lib/utils';

const CameraPluginCSS = css.resolve`
  .rekorder-camera-plugin-container {
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
`;

const CameraPlugin = observer(() => {
  const { devices: cameras, permission } = useRequestCameraDevices();

  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isCameraSelectOpen, setCameraSelectOpen] = useState(false);

  const handleCameraSelectOpenChange = (open: boolean) => {
    if (open) {
      if (permission === 'denied') setAlertDialogOpen(true);
      else setCameraSelectOpen(open);
    } else {
      setCameraSelectOpen(open);
    }
  };

  return (
    <Fragment>
      <ResolvedStyle>{CameraPluginCSS}</ResolvedStyle>
      <div className={clsx(CameraPluginCSS.className, 'rekorder-camera-plugin-container')}>
        <Select value={camera.device} onValueChange={camera.changeDevice} open={isCameraSelectOpen} onOpenChange={handleCameraSelectOpenChange}>
          <Select.Input className={clsx(CameraPluginCSS.className, 'rekorder-select-input')}>
            <div className={clsx(CameraPluginCSS.className, 'rekorder-select-value')}>
              {camera.device === 'n/a' ? <VideoCameraSlash size={16} /> : <VideoCamera size={16} />}
              <span className={clsx(CameraPluginCSS.className, 'rekorder-select-value-label')}>
                {camera.device === 'n/a' ? 'No Camera' : cameras.find((c) => c.deviceId === camera.device)?.label}
              </span>
              {camera.device === 'n/a' ? (
                <StatusBadge className={clsx(CameraPluginCSS.className, 'rekorder-select-badge')} variant="error">
                  Off
                </StatusBadge>
              ) : null}
            </div>
          </Select.Input>
          <Select.Content portal={shadowRootElementById('rekorder-area')}>
            <Select.Item value="n/a">No Camera</Select.Item>
            {cameras.length ? <Select.Separator /> : null}
            {cameras.map((camera, index) => (
              <Select.Item key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${index + 1}`}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <div className={clsx(CameraPluginCSS.className, 'rekorder-toggle-control')}>
          <SwitchLabel htmlFor="flip-camera">Flip Camera</SwitchLabel>
          <Switch id="flip-camera" checked={camera.flip} onCheckedChange={camera.updateFlip} />
        </div>
        <div className={clsx(CameraPluginCSS.className, 'rekorder-toggle-control')}>
          <SwitchLabel htmlFor="effects">Camera Effects</SwitchLabel>
          <Switch id="effects" />
        </div>
      </div>
      <AlertDialog
        open={isAlertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        title="Camera permission denied"
        onConfirm={openPermissionSettings}
        description="Please allow access to your camera to use this feature. Click on the continue button to open the camera settings and allow access."
      />
    </Fragment>
  );
});

export { CameraPlugin };
