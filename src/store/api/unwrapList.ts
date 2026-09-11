export function unwrapList<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (
    response &&
    typeof response === 'object' &&
    Array.isArray((response as { results?: unknown }).results)
  ) {
    return (response as { results: T[] }).results;
  }

  return [];
}
