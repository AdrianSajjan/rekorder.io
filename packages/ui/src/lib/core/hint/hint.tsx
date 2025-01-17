import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Info } from '@phosphor-icons/react';
import { forwardRef, Fragment } from 'react';

import { theme } from '../../theme';
import { ResolvedStyle } from '../style/resolved-style';

const HintCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  .rekorder-hint {
    font-size: 12px;
    font-weight: 400;

    display: flex;
    align-items: center;

    gap: ${theme.space(1)};
    font-family: ${theme.fonts.default};
  }

  .rekorder-hint.rekorder-default {
    color: ${theme.colors.text.muted};
  }

  .rekorder-hint.rekorder-error {
    color: ${theme.colors.destructive.main};
  }

  .rekorder-hint .rekorder-hint-icon {
    flex-shrink: 0;
  }

  .rekorder-hint.rekorder-default .rekorder-hint-icon {
    color: ${theme.alpha(theme.colors.text.muted, 0.8)};
  }

  .rekorder-hint.rekorder-error .rekorder-hint-icon {
    color: ${theme.colors.destructive.main};
  }
`;

interface HintProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode | false;
  error?: React.ReactNode;
  invalid?: boolean;
}

const HintIcon = <Info size={14} weight="fill" aria-hidden="true" />;

const Hint = forwardRef<HTMLDivElement, HintProps>(({ children, className, icon = HintIcon, error, invalid, ...props }, ref) => {
  const mode = invalid ? 'error' : 'default';
  return (
    <Fragment>
      <ResolvedStyle>{HintCSS}</ResolvedStyle>
      <div ref={ref} {...props} className={clsx('rekorder-hint', HintCSS.className, className, theme.createClassName(mode))}>
        {icon ? <span className={clsx(HintCSS.className, 'rekorder-hint-icon')}>{icon}</span> : null}
        {!invalid || !error ? children : error}
      </div>
    </Fragment>
  );
});

Hint.displayName = 'Hint';

export { Hint };
