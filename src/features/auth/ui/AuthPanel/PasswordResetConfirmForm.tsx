'use client';

import { useState, useRef } from 'react';

import AuthInput from '@/features/auth/ui/AuthInput/AuthInput';
import { formatMessage, useTranslation } from '@/i18n/useTranslation';
import { usePasswordResetConfirmMutation } from '@/store/endpoints/authEndpoints';

import { authForm, authPanel } from '@/features/auth/ui/authClasses';

type PasswordResetConfirmFormProps = {
  email: string;
  onSuccess: () => void;
  onBack?: () => void;
};

const CODE_LENGTH = 6;

export default function PasswordResetConfirmForm({
  email,
  onSuccess,
  onBack,
}: PasswordResetConfirmFormProps) {
  const { t, validators } = useTranslation();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({ password: '', confirmPassword: '', global: '' });
  const [codeError, setCodeError] = useState('');
  const [resetConfirm, { isLoading }] = usePasswordResetConfirmMutation();

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setCodeError('');
    setErrors((prev) => ({ ...prev, global: '' }));

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;

    e.preventDefault();
    const next = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    setCodeError('');
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentCode = digits.join('');
    const currentCodeError = currentCode.length < CODE_LENGTH ? t.validation.enterFullCode : '';
    const passwordError = validators.validateField('password', password);
    const confirmPasswordError =
      password !== confirmPassword ? t.validation.passwordsDoNotMatch : '';

    if (currentCodeError || passwordError || confirmPasswordError) {
      setCodeError(currentCodeError);
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
        global: '',
      });
      return;
    }

    try {
      await resetConfirm({
        code: currentCode.trim(),
        new_password: password,
        confirm_password: confirmPassword,
      }).unwrap();

      onSuccess();
    } catch {
      setErrors((prev) => ({
        ...prev,
        global: t.auth.resetPassword.invalidCode,
      }));
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

      <h1 className={authPanel.title}>{t.auth.resetPassword.title}</h1>
      <p className={authPanel.subtitleLinkEmail}>
        {formatMessage(t.auth.resetPassword.subtitle, { email })}
      </p>

      <form noValidate className={authPanel.form} onSubmit={handleSubmit}>
        {errors.global && <div className={authPanel.errorText}>{errors.global}</div>}

        <div className="mb-5">
          <label className={`${authForm.fieldLabel} mb-2 block`}>
            {t.auth.labels.verificationCode}
          </label>

          <div className={authPanel.codeRow}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={digit}
                className={authPanel.codeInput}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                aria-label={formatMessage(t.common.digit, { number: index + 1 })}
              />
            ))}
          </div>
          {codeError && <p className={`${authPanel.errorText} mt-1`}>{codeError}</p>}
        </div>

        <AuthInput
          id="new-password"
          name="password"
          label={t.auth.labels.newPassword}
          type="password"
          placeholder={t.auth.placeholders.passwordDots}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: '', global: '' }));
          }}
          error={errors.password}
          togglePassword
          autoComplete="new-password"
        />

        <AuthInput
          id="confirm-password"
          name="confirmPassword"
          label={t.auth.labels.confirmNewPassword}
          type="password"
          placeholder={t.auth.placeholders.passwordDots}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors((prev) => ({ ...prev, confirmPassword: '', global: '' }));
          }}
          error={errors.confirmPassword}
          togglePassword
          autoComplete="new-password"
        />

        <button type="submit" className={authPanel.submitBtn} disabled={isLoading}>
          {isLoading ? t.common.saving : t.auth.resetPassword.submit}
        </button>
      </form>
    </div>
  );
}
