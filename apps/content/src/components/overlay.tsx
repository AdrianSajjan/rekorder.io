import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { ResolvedStyle, theme } from '@rekorder.io/ui';

import { recorder } from '../store/recorder';

const OverlayCSS = css.resolve`
  .rekorder-overlay {
    inset: 0;
    position: fixed;
    pointer-events: none;
    z-index: 1;
    background-color: ${theme.alpha(theme.colors.core.black, 0.6)};
  }

  .rekorder-overlay[data-state='paused'] {
    border: 6px solid ${theme.alpha(theme.colors.destructive.main, 0.5)};
  }
`;

const Overlay = observer(() => {
  if (recorder.status === 'active') {
    return null;
  }

  return (
    <Fragment>
      <ResolvedStyle>{OverlayCSS}</ResolvedStyle>
      <div data-state={recorder.status} className={clsx(OverlayCSS.className, 'rekorder-overlay')} />
    </Fragment>
  );
});

export { Overlay };
