import { Fragment, ReactNode } from 'react';
import css from 'styled-jsx/css';

const FontsCSS = css.global`
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
`;

export function FontsProvider({ children }: { children?: ReactNode }) {
  return (
    <Fragment>
      <style jsx global>
        {FontsCSS}
      </style>
      {children}
    </Fragment>
  );
}
