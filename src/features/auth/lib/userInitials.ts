export function getUserInitials(email: string): string {
  const local = email.split('@')[0]?.trim() ?? '';
  if (!local) return '';

  const letters = local.replace(/[^a-zA-Z]/g, '');
  if (letters.length >= 2) return letters.slice(0, 2).toUpperCase();
  if (letters.length === 1) return letters.toUpperCase();

  return local.slice(0, 2).toUpperCase();
}

const USER_EMAIL_KEY = 'userEmail';

export function saveUserEmail(email: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_EMAIL_KEY, email.trim().toLowerCase());
}

export function getStoredUserEmail(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(USER_EMAIL_KEY) ?? '';
}

export function clearStoredUserEmail() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_EMAIL_KEY);
}
