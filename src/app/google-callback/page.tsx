'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { extractApiError } from '@/features/auth/lib/apiError';
import {
  clearGoogleOAuthPending,
  readGoogleOAuthPending,
  saveGoogleOAuthResult,
} from '@/features/auth/lib/googleOAuth';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { useTranslation } from '@/i18n/useTranslation';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signInWithGoogle } = useGoogleAuth();
  const [status, setStatus] = useState(t.common.loading);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const finish = (path: string) => {
      router.replace(path);
    };

    const run = async () => {
      const pending = readGoogleOAuthPending();
      const returnTo = pending?.returnTo && pending.returnTo.startsWith('/') ? pending.returnTo : '/';
      const acceptTerms = pending?.acceptTerms ?? true;

      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);
      const idToken = params.get('id_token');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      clearGoogleOAuthPending();

      if (!idToken) {
        saveGoogleOAuthResult({
          ok: false,
          message: errorDescription || error || t.auth.errors.googleSignInFailed,
        });
        finish('/');
        return;
      }

      try {
        setStatus(t.common.loading);
        await signInWithGoogle(idToken, acceptTerms);
        saveGoogleOAuthResult({ ok: true });
        finish(returnTo);
      } catch (err) {
        saveGoogleOAuthResult({
          ok: false,
          message: extractApiError(err) ?? t.auth.errors.googleSignInFailed,
        });
        finish('/');
      }
    };

    void run();
  }, [router, signInWithGoogle, t.auth.errors.googleSignInFailed, t.common.loading]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white text-sm text-gray-500">
      {status}
    </div>
  );
}
