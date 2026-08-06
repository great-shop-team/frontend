'use client';

import { useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAutoLogin } from '@/features/auth/hooks/useAutoLogin';
import { normalizeEmail } from '@/features/auth/lib/normalizeEmail';
import { peekPendingAuth } from '@/features/auth/lib/pendingAuth';
import { useTranslation } from '@/i18n/useTranslation';
import ForgotPasswordForm from '@/features/auth/ui/AuthPanel/ForgotPasswordForm';
import PasswordResetConfirmForm from '@/features/auth/ui/AuthPanel/PasswordResetConfirmForm';
import VerifyEmailForm from '@/features/auth/ui/AuthPanel/VerifyEmailForm';
import WelcomeAbroadPanel from '@/features/auth/ui/AuthPanel/WelcomeAbroadPanel';
import LoginForm from '@/features/auth/ui/LoginForm/LoginForm';
import RegisterForm from '@/features/auth/ui/RegisterForm/RegisterForm';

import type { AuthView } from '@/features/auth/lib/authViews';

export type { AuthView };

type LoginHint = {
  text: string;
  type: 'success' | 'error';
};

type AuthFlowProps = {
  view: AuthView;
  verifyEmail: string;
  loginEmail: string;
  loginHint: LoginHint;
  onViewChange: (view: AuthView) => void;
  onVerifyEmailChange: (email: string) => void;
  onLoginEmailChange: (email: string) => void;
  onLoginHintChange: (hint: LoginHint) => void;
  onLoginSuccess?: () => void;
  onWelcomeComplete?: () => void;
};

export default function AuthFlow({
  view,
  verifyEmail,
  loginEmail,
  loginHint,
  onViewChange,
  onVerifyEmailChange,
  onLoginEmailChange,
  onLoginHintChange,
  onLoginSuccess,
  onWelcomeComplete,
}: AuthFlowProps) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const autoLogin = useAutoLogin();

  const tryAutoLogin = useCallback(async () => {
    const pending = peekPendingAuth();
    if (!pending) return false;

    try {
      await autoLogin(pending.email, pending.password);
      return true;
    } catch {
      return false;
    }
  }, [autoLogin]);

  const handleVerified = useCallback(async () => {
    const loggedIn = await tryAutoLogin();

    if (loggedIn) {
      onLoginHintChange({
        text: t.auth.hints.emailVerifiedLogin,
        type: 'success',
      });
      onViewChange('welcome');
      return;
    }

    const pending = peekPendingAuth();
    onLoginEmailChange(pending?.email ?? normalizeEmail(verifyEmail));
    onLoginHintChange({
      text: t.auth.hints.emailVerifiedLogin,
      type: 'success',
    });
    onViewChange('login');
  }, [
    tryAutoLogin,
    onViewChange,
    onLoginEmailChange,
    onLoginHintChange,
    verifyEmail,
    t.auth.hints.emailVerifiedLogin,
  ]);

  const handleGetStarted = useCallback(async () => {
    if (!isAuthenticated) {
      const loggedIn = await tryAutoLogin();
      if (!loggedIn) {
        const pending = peekPendingAuth();
        onLoginEmailChange(pending?.email ?? normalizeEmail(verifyEmail));
        onLoginHintChange({
          text: t.auth.hints.signInToContinue,
          type: 'error',
        });
        onViewChange('login');
        return;
      }
    }
    onWelcomeComplete?.();
  }, [
    isAuthenticated,
    tryAutoLogin,
    onViewChange,
    onLoginEmailChange,
    onLoginHintChange,
    onWelcomeComplete,
    verifyEmail,
    t.auth.hints.signInToContinue,
  ]);

  if (view === 'login') {
    return (
      <LoginForm
        initialEmail={loginEmail}
        hintMessage={loginHint.text}
        hintType={loginHint.type}
        onCreateAccount={() => onViewChange('register')}
        onForgotPassword={() => onViewChange('get-code')}
        onSuccess={onLoginSuccess}
      />
    );
  }

  if (view === 'register') {
    return (
      <RegisterForm
        onLogin={() => onViewChange('login')}
        onRegistered={(email) => {
          onVerifyEmailChange(email);
          onViewChange('verify');
        }}
        onSuccess={onLoginSuccess}
      />
    );
  }

  if (view === 'get-code') {
    return (
      <ForgotPasswordForm
        onBack={() => {
          onLoginHintChange({ text: '', type: 'error' });
          onViewChange('login');
        }}
        onCodeSent={(email) => {
          onVerifyEmailChange(email);
          onViewChange('reset-password-confirm');
        }}
        onLogin={() => onViewChange('login')}
      />
    );
  }

  if (view === 'reset-password-confirm') {
    return (
      <PasswordResetConfirmForm
        email={verifyEmail}
        onBack={() => onViewChange('get-code')}
        onSuccess={() => {
          onLoginEmailChange(normalizeEmail(verifyEmail));
          onLoginHintChange({
            text: t.auth.hints.passwordResetSuccess,
            type: 'success',
          });
          onViewChange('login');
        }}
      />
    );
  }

  if (view === 'verify') {
    return (
      <VerifyEmailForm
        email={verifyEmail}
        onBack={() => onViewChange('register')}
        onVerified={handleVerified}
      />
    );
  }

  return <WelcomeAbroadPanel onGetStarted={handleGetStarted} />;
}
