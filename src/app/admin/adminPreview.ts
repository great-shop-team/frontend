const ADMIN_PREVIEW_KEY = 'wearly-admin-preview';

export function canUseAdminPreview() {
  return process.env.NODE_ENV === 'development';
}

export function enableAdminPreview() {
  if (!canUseAdminPreview() || typeof window === 'undefined') return;
  sessionStorage.setItem(ADMIN_PREVIEW_KEY, '1');
}

export function isAdminPreview() {
  return (
    canUseAdminPreview() &&
    typeof window !== 'undefined' &&
    sessionStorage.getItem(ADMIN_PREVIEW_KEY) === '1'
  );
}

export function clearAdminPreview() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_PREVIEW_KEY);
}
