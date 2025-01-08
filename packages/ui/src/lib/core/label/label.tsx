import css from 'styled-jsx/css';
import clsx from 'clsx';
import { forwardRef, Fragment } from 'react';
import { theme } from '../../theme';

const LabelCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .rekorder-label {
    font-size: 14px;
    font-weight: 500;
    font-family: ${theme.fonts.default};
  }
`;

const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ children, className, ...props }, ref) => {
  return (
    <Fragment>
      {LabelCSS.styles}
      <label ref={ref} {...props} className={clsx('rekorder-label', LabelCSS.className, className)}>
        {children}
      </label>
    </Fragment>
  );
});

Label.displayName = 'Label';

export { Label };
