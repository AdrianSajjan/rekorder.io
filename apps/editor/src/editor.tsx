import css from 'styled-jsx/css';
import { theme } from '@rekorder.io/ui';
import { observer } from 'mobx-react';
import { editor } from './store/editor';

const styles = css`
  .editor {
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
  }

  .video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const global = css.global`
  body {
    margin: 0;
    font-family: ${theme.fonts.default};
  }

  * {
    box-sizing: border-box;
  }
`;

const EditorOffline = observer(() => {
  return (
    <div className="editor">
      <style jsx>{styles}</style>
      <style jsx>{global}</style>
      {editor.blobURL ? <video className="video" src={editor.blobURL} controls /> : <strong>No video available</strong>}
    </div>
  );
});

export { EditorOffline };
