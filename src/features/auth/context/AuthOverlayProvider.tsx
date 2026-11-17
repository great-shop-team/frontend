'use client';

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import dynamic from 'next/dynamic';

import {
  AuthOverlayContext,
  type OpenAuthOptions,
} from '@/features/auth/context/AuthOverlayContext';
import { AUTH_OVERLAY_CLOSE_EVENT } from '@/features/auth/lib/authOverlayEvents';
import { isAuthView, type AuthView } from '@/features/auth/lib/authViews';
import { consumeGoogleOAuthResult } from '@/features/auth/lib/googleOAuth';
import { useTranslation } from '@/i18n/useTranslation';

const AuthOverlayPortal = dynamic(() => import('@/features/auth/ui/AuthOverlayPortal'), {
  ssr: false,
});

type LoginHint = {
  text: string;
  type: 'success' | 'error';
};

export default function AuthOverlayProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [openPathname, setOpenPathname] = useState(pathname);
  const [view, setView] = useState<AuthView>('login');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginHint, setLoginHint] = useState<LoginHint>({ text: '', type: 'error' });

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const open = isOpen && openPathname === pathname;

  const closeAuth = useCallback(() => setIsOpen(false), []);

  const openAuth = useCallback(
    (nextView: AuthView = 'login', options?: OpenAuthOptions) => {
      setOpenPathname(pathname);
      setView(nextView);

      if (options?.email) {
        if (nextView === 'verify' || nextView === 'reset-password-confirm') {
          setVerifyEmail(options.email);
        } else {
          setLoginEmail(options.email);
        }
      }

      if (options?.hintMessage) {
        setLoginHint({
          text: options.hintMessage,
          type: options.hintType ?? 'error',
        });
      } else if (nextView === 'login') {
        setLoginHint({ text: '', type: 'error' });
      }

      setIsOpen(true);
    },
    [pathname],
  );

  useEffect(() => {
    const onLogoHome = () => closeAuth();
    window.addEventListener(AUTH_OVERLAY_CLOSE_EVENT, onLogoHome);
    return () => window.removeEventListener(AUTH_OVERLAY_CLOSE_EVENT, onLogoHome);
  }, [closeAuth]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuth();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeAuth]);

  useEffect(() => {
    const result = consumeGoogleOAuthResult();
    if (!result || result.ok) return;

    // Avoid calling setState synchronously inside effect to prevent cascading renders
    const id = setTimeout(() => {
      openAuth('login', {
        hintMessage: result.message || t.auth.errors.googleSignInFailed,
        hintType: 'error',
      });
    }, 0);

    return () => clearTimeout(id);
  }, [openAuth, t.auth.errors.googleSignInFailed]);

  useEffect(() => {
    const auth = searchParams.get('auth');
    if (!auth || !isAuthView(auth)) return;

    const email = searchParams.get('email') ?? '';
    const verified = searchParams.get('verified') === '1';
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('auth');
    nextParams.delete('email');
    nextParams.delete('verified');

    const query = nextParams.toString();
    const nextPath = query ? `${pathname}?${query}` : pathname;

    const frame = requestAnimationFrame(() => {
      openAuth(auth, {
        email: email || undefined,
        hintMessage: verified ? t.auth.hints.emailVerifiedLogin : undefined,
        hintType: verified ? 'success' : undefined,
      });
      router.replace(nextPath);
    });

    return () => cancelAnimationFrame(frame);
  }, [searchParams, pathname, router, openAuth, t.auth.hints.emailVerifiedLogin]);

  const value = useMemo(
    () => ({
      isOpen: open,
      openAuth,
      closeAuth,
    }),
    [open, openAuth, closeAuth],
  );

  return (
    <AuthOverlayContext.Provider value={value}>
      {children}
      {open &&
        mounted &&
        createPortal(
          <AuthOverlayPortal
            view={view}
            verifyEmail={verifyEmail}
            loginEmail={loginEmail}
            loginHint={loginHint}
            onViewChange={setView}
            onVerifyEmailChange={setVerifyEmail}
            onLoginEmailChange={setLoginEmail}
            onLoginHintChange={setLoginHint}
            onClose={closeAuth}
          />,
          document.body,
        )}
    </AuthOverlayContext.Provider>
  );
}
