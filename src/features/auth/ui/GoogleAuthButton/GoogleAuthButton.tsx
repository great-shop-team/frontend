'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import { extractApiError } from '@/features/auth/lib/apiError';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { useTranslation } from '@/i18n/useTranslation';

import googleLogo from '../../../../../public/icons/GoogleLogo.svg';

type GoogleAuthButtonProps = {
  acceptTerms: boolean;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onTermsRequired?: () => void;
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleAuthButton({
  acceptTerms,
  disabled = false,
  className,
  iconClassName,
  onSuccess,
  onError,
  onTermsRequired,
}: GoogleAuthButtonProps) {
  const { t } = useTranslation();
  const { signInWithGoogle, isLoading } = useGoogleAuth();

  const googleSignInFailedError = t.auth.errors.googleSignInFailed;

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { idToken } = event.data;
        try {
          await signInWithGoogle(idToken, acceptTerms);
          onSuccess?.();
        } catch (error) {
          onError?.(extractApiError(error) ?? googleSignInFailedError);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [signInWithGoogle, acceptTerms, onSuccess, onError, googleSignInFailedError]);

  const handleButtonClick = () => {
    if (!acceptTerms) {
      onTermsRequired?.();
      return;
    }

    if (!googleClientId) {
      onError?.(googleSignInFailedError);
      return;
    }

    const redirectUri =
      typeof window !== 'undefined'
        ? `${window.location.origin}/google-callback`
        : 'http://localhost:3000/google-callback';

    const targetUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=${encodeURIComponent('openid profile email')}` +
      `&nonce=${encodeURIComponent(Math.random().toString(36).substring(2))}`;

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      targetUrl,
      'google-auth-popup',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`,
    );
  };

  const isBlocked = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      disabled={isBlocked}
      className={`flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`}
      aria-label="Google"
    >
      <Image src={googleLogo} alt="Google" className={iconClassName ?? 'h-6 w-6'} />
    </button>
  );
}
