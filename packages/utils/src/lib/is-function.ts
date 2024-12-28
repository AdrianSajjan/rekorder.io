export function isFunction(value: unknown): value is Function {
  return Object.prototype.toString.call(value) === '[object Function]';
}
