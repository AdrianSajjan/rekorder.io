import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { EditorOffline } from './editor';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <EditorOffline />
  </StrictMode>
);
