import { Fragment, ReactNode } from 'react';
import { AnimationCSS } from '../../animations';

interface AnimationsProviderProps {
  children?: ReactNode;
  global?: boolean;
}

export function AnimationsProvider({ children, global }: AnimationsProviderProps) {
  if (global) {
    return (
      <Fragment>
        <style jsx global>
          {AnimationCSS}
        </style>
        {children}
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <style>{AnimationCSS}</style>
        {children}
      </Fragment>
    );
  }
}
