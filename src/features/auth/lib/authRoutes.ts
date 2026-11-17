import type { AuthView } from '@/features/auth/lib/authViews';

type AuthRouteOptions = {
  email?: string;
  verified?: boolean;
};

export function buildAuthRoute(view: AuthView, options?: AuthRouteOptions) {
  const params = new URLSearchParams({ auth: view });

  if (options?.email) {
    params.set('email', options.email);
  }

  if (options?.verified) {
    params.set('verified', '1');
  }

  return `/?${params.toString()}`;
}
