import css from 'styled-jsx/css';
import clsx from 'clsx';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { VideoCamera, VideoCameraSlash } from '@phosphor-icons/react';

import { Select, StatusBadge, Switch, theme } from '@rekorder.io/ui';

import { useFetchUserCameraDevices } from '../../hooks/use-camera';
import { camera } from '../../store/camera';

const CameraPluginCSS = css.resolve`
  .camera-plugin-container {
    display: flex;
    flex-direction: column;
    gap: ${theme.space(5)};
  }

  .camera-select-input {
    width: 100%;
  }

  .camera-select-value {
    display: flex;
    align-items: center;
    gap: ${theme.space(3)};
    flex: 1;
  }

  .camera-select-badge {
    margin-left: auto;
  }

  .camera-flip,
  .camera-effects {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space(3)};
  }

  .camera-flip-label,
  .camera-effects-label {
    font-size: 14px;
  }
`;

const CameraPlugin = observer(() => {
  const cameras = useFetchUserCameraDevices();

  return (
    <Fragment>
      {CameraPluginCSS.styles}
      <div className={clsx(CameraPluginCSS.className, 'camera-plugin-container')}>
        <Select value={camera.device} onValueChange={camera.changeDevice}>
          <Select.Input className={clsx(CameraPluginCSS.className, 'camera-select-input')}>
            <div className={clsx(CameraPluginCSS.className, 'camera-select-value')}>
              {camera.device === 'n/a' ? <VideoCameraSlash size={20} /> : <VideoCamera size={20} />}
              {camera.device === 'n/a' ? 'No Camera' : cameras.find((c) => c.deviceId === camera.device)?.label}
              {camera.device === 'n/a' ? (
                <StatusBadge className={clsx(CameraPluginCSS.className, 'camera-select-badge')} variant="error">
                  Off
                </StatusBadge>
              ) : null}
            </div>
          </Select.Input>
          <Select.Content>
            <Select.Item value="n/a">No Camera</Select.Item>
            {cameras.map((camera, index) => (
              <Select.Item key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${index + 1}`}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <div className={clsx(CameraPluginCSS.className, 'camera-flip')}>
          <label className={clsx(CameraPluginCSS.className, 'camera-flip-label')} htmlFor="flip-camera">
            Flip Camera
          </label>
          <Switch id="flip-camera" size="small" checked={camera.flip} onCheckedChange={camera.updateFlip} />
        </div>
        <div className={clsx(CameraPluginCSS.className, 'camera-effects')}>
          <label className={clsx(CameraPluginCSS.className, 'camera-effects-label')} htmlFor="camera-effects">
            Camera Effects
          </label>
          <Switch id="camera-effects" size="small" />
        </div>
      </div>
    </Fragment>
  );
});

export { CameraPlugin };
