import { theme as shared } from '@rekorder.io/constants';

const theme = Object.assign({}, shared, {
  createStyles<T>(styles: Record<keyof T, React.CSSProperties>) {
    return styles;
  },
  createClassName<T extends string>(className: T) {
    return 'rekorder-' + className;
  },
});

export { theme };
