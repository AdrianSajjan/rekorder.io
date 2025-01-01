export function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export function serialize<T>(data: T): string {
  return JSON.stringify(data);
}

export function deserialize<T>(data: string): T {
  return JSON.parse(data);
}

export function deserializeOrNull<T>(data: string): T | null {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}
