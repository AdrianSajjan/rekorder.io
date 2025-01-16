import clsx from 'clsx';
import css from 'styled-jsx/css';

import { ResolvedStyle, theme } from '@rekorder.io/ui';
import { Fragment } from 'react/jsx-runtime';

const SwitchLabelCSS = css.resolve`
  .rekorder-switch-label {
    font-size: 13px;
    font-weight: 400;
    align-items: center;
    display: inline-flex;

    gap: ${theme.space(0.5)};
    color: ${theme.colors.text.dark};
  }
`;

export function SwitchLabel({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <Fragment>
      <ResolvedStyle>{SwitchLabelCSS}</ResolvedStyle>
      <label className={clsx(SwitchLabelCSS.className, 'rekorder-switch-label')} {...props}>
        {children}
      </label>
    </Fragment>
  );
}
