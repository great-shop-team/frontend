export type AuthView =
  | 'login'
  | 'register'
  | 'verify'
  | 'get-code'
  | 'reset-password-confirm'
  | 'welcome';

export const authViews: AuthView[] = [
  'login',
  'register',
  'verify',
  'get-code',
  'reset-password-confirm',
  'welcome',
];

export function isAuthView(value: string): value is AuthView {
  return authViews.includes(value as AuthView);
}
