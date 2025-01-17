import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Button, type ButtonProps } from './button';
import { Fragment } from 'react/jsx-runtime';

import { ResolvedStyle } from '../style/resolved-style';
import { Spinner } from '../spinner/spinner';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

const LoadingButtonCSS = css.resolve`
  .rekorder-loading-button {
    position: relative;
  }

  .rekorder-loading-button[data-loading='true'] {
    pointer-events: none;
  }

  .rekorder-loading-button[data-loading='true'] .rekorder-loading-button-content {
    opacity: 0;
  }

  .rekorder-loading-button-spinner-container {
    top: 50%;
    left: 50%;
    z-index: 10;
    position: absolute;
    transform: translate(-50%, -50%);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    50% {
      opacity: 0.6;
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingButton = ({ loading, children, className, ...props }: LoadingButtonProps) => {
  return (
    <Fragment>
      <ResolvedStyle>{LoadingButtonCSS}</ResolvedStyle>
      <Button className={clsx(LoadingButtonCSS.className, 'rekorder-loading-button', className)} {...props} data-loading={loading}>
        <span className={clsx(LoadingButtonCSS.className, 'rekorder-loading-button-content')}>{children}</span>
        {loading ? <Spinner className={clsx(LoadingButtonCSS.className, 'rekorder-loading-button-spinner-container')} /> : null}
      </Button>
    </Fragment>
  );
};

export { LoadingButton, LoadingButtonCSS, type LoadingButtonProps };
