import css from 'styled-jsx/css';
import { theme } from '../../theme';
import { forwardRef, Fragment, InputHTMLAttributes } from 'react';
import { cn } from '@rekorder.io/utils';

const InputCSS = css.resolve`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  input {
    box-sizing: border-box;
  }

  .rekorder-input {
    cursor: text;
    font-weight: 400;
    display: inline-flex;

    align-items: center;
    justify-content: space-between;
    transition: background-color 200ms ease-in-out, border-color 200ms ease-in-out;

    gap: ${theme.space(4)};
    font-family: ${theme.fonts.default};
    color: ${theme.colors.background.text};
    background-color: ${theme.colors.core.white};

    box-shadow: ${theme.shadow().xs};
    border: 1px solid ${theme.colors.borders.input};
  }

  .rekorder-input::placeholder {
    color: ${theme.colors.accent.dark};
  }

  .rekorder-input:hover {
    background-color: ${theme.colors.background.light};
  }

  .rekorder-input:focus-visible {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.primary.main, 0.25) } })};
  }

  .rekorder-input.rekorder-large {
    height: ${theme.space(11)};
    padding-left: ${theme.space(3.5)};
    padding-right: ${theme.space(3.5)};
    border-radius: ${theme.space(3)};
    font-size: 16px;
  }

  .rekorder-input.rekorder-medium {
    height: ${theme.space(10)};
    padding-left: ${theme.space(3.5)};
    padding-right: ${theme.space(3.5)};
    border-radius: ${theme.space(2.5)};
    font-size: 14px;
  }

  .rekorder-input.rekorder-small {
    height: ${theme.space(9)};
    padding-left: ${theme.space(3.5)};
    padding-right: ${theme.space(3.5)};
    border-radius: ${theme.space(2)};
    font-size: 14px;
  }
`;

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'small' | 'medium' | 'large';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, size = 'medium', ...props }, ref) => {
  return (
    <Fragment>
      {InputCSS.styles}
      <input ref={ref} className={cn(InputCSS.className, 'rekorder-input', theme.createClassName(size), className)} {...props} />
    </Fragment>
  );
});
Input.displayName = 'Input';

export { Input, InputCSS, type InputProps };
