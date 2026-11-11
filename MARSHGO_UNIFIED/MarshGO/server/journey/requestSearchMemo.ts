export function memoizeRequestSearch<T>(key: string, fn: () => Promise<T>): Promise<T> {
  return fn();
}
