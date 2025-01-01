import { theme as shared } from '@rekorder.io/constants';

const theme = Object.assign({}, shared, {
  createStyles<T>(styles: Record<keyof T, React.CSSProperties>) {
    return styles;
  },
});

export { theme };
