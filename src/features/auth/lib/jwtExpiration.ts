type JwtPayload = {
  exp?: number;
  iat?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized)) as JwtPayload;
  } catch {
    return null;
  }
}

function formatTimeLeft(msLeft: number): string {
  if (msLeft <= 0) return 'истёк';

  if (msLeft < 60_000) {
    return `${Math.ceil(msLeft / 1000)} сек`;
  }

  const totalMinutes = Math.floor(msLeft / 60_000);

  if (totalMinutes < 60) {
    return `${totalMinutes} мин`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes > 0 ? `${hours} ч ${minutes} мин` : `${hours} ч`;
}

function formatExpiration(token: string | null, label: string): string {
  if (!token) return `${label}: отсутствует`;

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return `${label}: не JWT или без поля exp`;

  const expiresAt = new Date(payload.exp * 1000);
  const msLeft = expiresAt.getTime() - Date.now();

  return `${label}: ${expiresAt.toLocaleString()} (осталось: ${formatTimeLeft(msLeft)})`;
}

export function isAccessTokenExpired(token: string | null): boolean {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  return payload.exp * 1000 <= Date.now();
}

export function logTokenExpirations(
  accessToken?: string | null,
  refreshToken?: string | null,
): void {
  const access =
    accessToken ?? (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
  const refresh =
    refreshToken ?? (typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null);

  console.log('[Tokens]', formatExpiration(access, 'Access'));
  console.log('[Tokens]', formatExpiration(refresh, 'Refresh'));
}
