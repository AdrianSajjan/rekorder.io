import { Fragment, ReactNode } from 'react';
import { AnimationCSS } from '../../animations';

export function AnimationsProvider({ children }: { children?: ReactNode }) {
  return (
    <Fragment>
      <style jsx global>
        {AnimationCSS}
      </style>
      {children}
    </Fragment>
  );
}
