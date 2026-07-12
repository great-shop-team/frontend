'use client';

import { useEffect, useCallback } from 'react';
import { type IdConfiguration, type CredentialResponse } from '@react-oauth/google';
import Image from 'next/image';

import { extractApiError } from '@/features/auth/lib/apiError';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { useTranslation } from '@/i18n/useTranslation';

import googleLogo from '../../../../../public/icons/GoogleLogo.svg';

interface GooglePromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
}

interface CustomIdConfiguration extends IdConfiguration {
  use_fedcm?: boolean;
}

declare global {
  interface Window {
    // Безопасно расширяем объект window, чтобы ESLint не ругался на any
    __googleGsiInitialized?: boolean;
    google?: {
      accounts: {
        id: {
          initialize: (config: CustomIdConfiguration) => void;
          prompt: (callback?: (notification: GooglePromptNotification) => void) => void;
          requestCode: () => void;
        };
      };
    };
  }
}

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

  const handleSuccess = useCallback(
    async (credential: string) => {
      try {
        await signInWithGoogle(credential, acceptTerms);
        onSuccess?.();
      } catch (error) {
        onError?.(extractApiError(error) ?? googleSignInFailedError);
      }
    },
    [signInWithGoogle, acceptTerms, onSuccess, onError, googleSignInFailedError],
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.accounts.id && googleClientId) {
      // Чистая проверка глобального флага без использования as any
      if (window.__googleGsiInitialized) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        use_fedcm: true,
        callback: (response: CredentialResponse) => {
          if (response.credential) {
            handleSuccess(response.credential);
          } else {
            onError?.(googleSignInFailedError);
          }
        },
      });

      window.__googleGsiInitialized = true;
    }
  }, [handleSuccess, onError, googleSignInFailedError]);

  const handleButtonClick = () => {
    if (!acceptTerms) {
      onTermsRequired?.();
      return;
    }

    if (typeof window !== 'undefined' && window.google?.accounts.id) {
      const googleAuthId = window.google.accounts.id;

      googleAuthId.prompt((notification: GooglePromptNotification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          googleAuthId.requestCode();
        }
      });
    } else {
      onError?.(googleSignInFailedError);
    }

    // Роут внутри Next.js (убедись, что создала файл src/app/google-callback/page.tsx)
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

    // Просто открываем окно. Никаких проверок его статуса в этом файле больше нет!
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

