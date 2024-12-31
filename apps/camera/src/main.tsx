import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { CameraPreview } from './camera';

const root = ReactDOM.createRoot(document.getElementById('rekorder-camera') as HTMLElement);

root.render(
  <StrictMode>
    <CameraPreview />
  </StrictMode>
);
