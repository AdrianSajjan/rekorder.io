import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { theme } from '@rekorder.io/ui';

import { recorder } from '../store/recorder';

const OverlayCSS = css.resolve`
  .rekorder-overlay {
    inset: 0;
    position: fixed;
    pointer-events: none;
    z-index: ${theme.zIndex(0)};
    background-color: ${theme.alpha(theme.colors.core.black, 0.15)};
  }
`;

const Overlay = observer(() => {
  if (recorder.status === 'active') {
    return null;
  }

  return (
    <Fragment>
      {OverlayCSS.styles}
      <div className={clsx(OverlayCSS.className, 'rekorder-overlay')} />
    </Fragment>
  );
});

export { Overlay };
