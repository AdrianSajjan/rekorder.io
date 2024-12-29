import css from 'styled-jsx/css';
import clsx from 'clsx';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { VideoCamera, VideoCameraSlash } from '@phosphor-icons/react';

import { animations, Select, StatusBadge, Switch, theme } from '@rekorder.io/ui';

import { useFetchUserCameraDevices } from '../../hooks/use-camera';
import { camera } from '../../store/camera';

const CameraPluginCSS = css.resolve`
  .rekorder-camera-plugin-container {
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
`;

const CameraPlugin = observer(() => {
  const cameras = useFetchUserCameraDevices();

  return (
    <Fragment>
      {CameraPluginCSS.styles}
      <div className={clsx(CameraPluginCSS.className, 'rekorder-camera-plugin-container')}>
        <Select value={camera.device} onValueChange={camera.changeDevice}>
          <Select.Input className={clsx(CameraPluginCSS.className, 'select-input')}>
            <div className={clsx(CameraPluginCSS.className, 'select-value')}>
              {camera.device === 'n/a' ? <VideoCameraSlash size={16} /> : <VideoCamera size={16} />}
              {camera.device === 'n/a' ? 'No Camera' : cameras.find((c) => c.deviceId === camera.device)?.label}
              {camera.device === 'n/a' ? (
                <StatusBadge className={clsx(CameraPluginCSS.className, 'select-badge')} variant="error">
                  Off
                </StatusBadge>
              ) : null}
            </div>
          </Select.Input>
          <Select.Content>
            <Select.Item value="n/a">No Camera</Select.Item>
            <Select.Separator />
            {cameras.map((camera, index) => (
              <Select.Item key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${index + 1}`}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <div className={clsx(CameraPluginCSS.className, 'toggle-control')}>
          <label className={clsx(CameraPluginCSS.className, 'toggle-control-label')} htmlFor="flip-camera">
            Flip Camera
          </label>
          <Switch id="flip-camera" checked={camera.flip} onCheckedChange={camera.updateFlip} />
        </div>
        <div className={clsx(CameraPluginCSS.className, 'toggle-control')}>
          <label className={clsx(CameraPluginCSS.className, 'toggle-control-label')} htmlFor="effects">
            Camera Effects
          </label>
          <Switch id="effects" />
        </div>
      </div>
    </Fragment>
  );
});

export { CameraPlugin };
