import clsx from 'clsx';
import css from 'styled-jsx/css';
import { ResolvedStyle } from '../style/resolved-style';

const SpinnerCSS = css.resolve`
  .rekorder-spinner-wrapper {
    height: var(--spinner-size, 20px);
    width: var(--spinner-size, 20px);
  }

  .rekorder-spinner {
    position: relative;
    top: 50%;
    left: 50%;
    height: var(--spinner-size, 20px);
    width: var(--spinner-size, 20px);
  }

  .rekorder-spinner-bar {
    height: 8%;
    left: -10%;
    top: -3.9%;
    width: 24%;
    position: absolute;
    border-radius: 6px;
    background: var(--spinner-color, currentColor);
    animation: spinner-spin 1.2s linear infinite;
  }

  .rekorder-spinner-bar:nth-child(1) {
    animation-delay: -1.2s;
    transform: rotate(0.0001deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(2) {
    animation-delay: -1.1s;
    transform: rotate(30deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(3) {
    animation-delay: -1s;
    transform: rotate(60deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(4) {
    animation-delay: -0.9s;
    transform: rotate(90deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(5) {
    animation-delay: -0.8s;
    transform: rotate(120deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(6) {
    animation-delay: -0.7s;
    transform: rotate(150deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(7) {
    animation-delay: -0.6s;
    transform: rotate(180deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(8) {
    animation-delay: -0.5s;
    transform: rotate(210deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(9) {
    animation-delay: -0.4s;
    transform: rotate(240deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(10) {
    animation-delay: -0.3s;
    transform: rotate(270deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(11) {
    animation-delay: -0.2s;
    transform: rotate(300deg) translate(146%);
  }

  .rekorder-spinner-bar:nth-child(12) {
    animation-delay: -0.1s;
    transform: rotate(330deg) translate(146%);
  }

  @keyframes spinner-spin {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.15;
    }
  }
`;

const bars = Array(12).fill(0);

export function Spinner({ className, color, size = 20 }: { color?: string; size?: number; className?: string }) {
  const style = {
    '--spinner-size': size + 'px',
    '--spinner-color': color,
  } as React.CSSProperties;

  return (
    <div className={clsx(SpinnerCSS.className, 'rekorder-spinner-wrapper', className)} style={style}>
      <ResolvedStyle>{SpinnerCSS}</ResolvedStyle>
      <div className={clsx(SpinnerCSS.className, 'rekorder-spinner')}>
        {bars.map((_, index) => (
          <div className={clsx(SpinnerCSS.className, 'rekorder-spinner-bar')} key={index} />
        ))}
      </div>
    </div>
  );
}
