import { normalizeEmail } from './normalizeEmail';

const PENDING_AUTH_KEY = 'pendingRegistrationAuth';

type PendingAuth = {
  email: string;
  password: string;
};

export function savePendingAuth(email: string, password: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(
    PENDING_AUTH_KEY,
    JSON.stringify({ email: normalizeEmail(email), password }),
  );
}

export function peekPendingAuth(): PendingAuth | null {
  if (typeof window === 'undefined') return null;

  const raw = sessionStorage.getItem(PENDING_AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingAuth;
  } catch {
    return null;
  }
}

export function clearPendingAuth() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(PENDING_AUTH_KEY);
}
