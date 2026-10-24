export function formErrorText(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object' || !('data' in error)) return fallback;

  const data = (error as { data?: unknown }).data;
  if (typeof data === 'string' && data.trim()) return data;
  if (!data || typeof data !== 'object') return fallback;

  const record = data as Record<string, unknown>;
  if (typeof record.detail === 'string') return record.detail;

  const first = Object.values(record)[0];
  if (typeof first === 'string') return first;
  if (Array.isArray(first) && typeof first[0] === 'string') return first[0];

  return fallback;
}
