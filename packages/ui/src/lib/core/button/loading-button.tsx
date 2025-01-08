import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Spinner } from '@phosphor-icons/react';
import { Button, type ButtonProps } from './button';
import { Fragment } from 'react/jsx-runtime';

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
    transform: translate(-50%, -50%);

    position: absolute;
    display: flex;
  }

  .rekorder-loading-button-spinner-icon {
    animation: spin 2.25s linear infinite;
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

const LoadingButton = ({ loading, children, ...props }: LoadingButtonProps) => {
  return (
    <Fragment>
      {LoadingButtonCSS.styles}
      <Button className={clsx(LoadingButtonCSS.className, 'rekorder-loading-button')} {...props} data-loading={loading}>
        <span className={clsx(LoadingButtonCSS.className, 'rekorder-loading-button-content')}>{children}</span>
        {loading ? (
          <span className={clsx(LoadingButtonCSS.className, 'rekorder-loading-button-spinner-container')}>
            <Spinner size={20} weight="bold" className={clsx(LoadingButtonCSS.className, 'rekorder-loading-button-spinner-icon')} />
          </span>
        ) : null}
      </Button>
    </Fragment>
  );
};

export { LoadingButton, LoadingButtonCSS, type LoadingButtonProps };
