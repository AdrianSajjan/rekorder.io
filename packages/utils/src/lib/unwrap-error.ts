import { isObject } from 'lodash';

export function unwrapError(error: unknown, fallback = 'Something went wrong! Please try again.') {
  if (!error) {
    return fallback;
  } else if (error instanceof Error) {
    return error.message || fallback;
  } else if (typeof error === 'string') {
    return error || fallback;
  } else if (isObject(error) && 'message' in error && typeof error.message === 'string') {
    return error.message || fallback;
  } else {
    return fallback;
  }
}
