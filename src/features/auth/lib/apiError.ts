import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function extractApiError(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('data' in error)) {
    return null;
  }

  const data = (error as FetchBaseQueryError).data;

  if (typeof data === 'string') return data;

  if (typeof data === 'object' && data !== null) {
    const record = data as Record<string, unknown>;

    if (typeof record.error === 'string') return record.error;
    if (typeof record.detail === 'string') return record.detail;
    if (Array.isArray(record.detail) && typeof record.detail[0] === 'string') {
      return record.detail[0];
    }
  }

  return null;
}
