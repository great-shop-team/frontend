'use client';

import Image from 'next/image';
import { useState } from 'react';

import AuthInput from '@/features/auth/ui/AuthInput/AuthInput';
import { normalizeEmail } from '@/features/auth/lib/normalizeEmail';
import { useTranslation } from '@/i18n/useTranslation';
import { useResetPasswordMutation } from '@/store/endpoints/authEndpoints';

import { authPanel } from '@/features/auth/ui/authClasses';

type ForgotPasswordFormProps = {
  onBack?: () => void;
  onCodeSent: (email: string) => void;
  onLogin: () => void;
};

export default function ForgotPasswordForm({
  onBack,
  onCodeSent,
  onLogin,
}: ForgotPasswordFormProps) {
  const { t, validators } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validators.validateField('email', email);
    if (msg) {
      setError(msg);
      return;
    }

    try {
      await resetPassword({ email: normalizeEmail(email) }).unwrap();
      onCodeSent(email);
    } catch {
      setError(t.auth.errors.resetCodeFailed);
    }
  };

  return (
    <div className={authPanel.root}>
      {onBack && (
        <button
          type="button"
          className={authPanel.back}
          onClick={onBack}
          aria-label={t.common.back}
        >
          ‹
        </button>
      )}

      <div className={authPanel.illustration}>
        <Image
          src="/images/float.jpg"
          alt={t.auth.forgotPassword.imageAlt}
          width={150}
          height={150}
          priority
        />
      </div>

      <h1 className={authPanel.title}>{t.auth.forgotPassword.title}</h1>
      <p className={authPanel.subtitleLinkEmail}>{t.auth.forgotPassword.subtitle}</p>

      <form noValidate className={authPanel.form} onSubmit={handleSubmit}>
        <AuthInput
          id="forgot-email"
          name="email"
          label={t.auth.labels.email}
          type="email"
          placeholder={t.auth.placeholders.email}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(validators.validateField('email', e.target.value));
          }}
          error={error}
        />

        <button type="submit" className={authPanel.submitBtn} disabled={isLoading}>
          {isLoading ? t.common.sending : t.auth.forgotPassword.submit}
        </button>
      </form>

      <p className={authPanel.footerLink}>
        {t.auth.forgotPassword.rememberPassword}{' '}
        <button type="button" className={authPanel.linkButton} onClick={onLogin}>
          {t.auth.login.submit}
        </button>
      </p>
    </div>
  );
}
