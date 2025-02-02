export function assert<T>(value?: T | null, message?: string): asserts value is T {
  if (!value) throw new Error(message || 'Assertion failed');
}
