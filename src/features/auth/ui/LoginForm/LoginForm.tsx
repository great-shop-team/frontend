'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import AuthInput from '@/features/auth/ui/AuthInput/AuthInput';
import GoogleAuthButton from '@/features/auth/ui/GoogleAuthButton/GoogleAuthButton';
import { extractApiError } from '@/features/auth/lib/apiError';
import { normalizeEmail } from '@/features/auth/lib/normalizeEmail';
import { saveUserEmail } from '@/features/auth/lib/userInitials';
import { logTokenExpirations } from '@/features/auth/lib/jwtExpiration';
import { useTranslation } from '@/i18n/useTranslation';
import { useLazyGetCurrentUserQuery, useLoginMutation } from '@/store/endpoints/authEndpoints';
import { setAuthEmail, setToken } from '@/store/slices/userSlice';

import facebookLogo from '../../../../../public/icons/FacebookLogo.svg';
import appleLogo from '../../../../../public/icons/AppleLogo.svg';
import { loginForm } from '@/features/auth/ui/authClasses';

type LoginFormProps = {
  initialEmail?: string;
  hintMessage?: string;
  hintType?: 'success' | 'error';
  onCreateAccount: () => void;
  onForgotPassword: () => void;
  onSuccess?: () => void;
};

export default function LoginForm({
  initialEmail = '',
  hintMessage = '',
  hintType = 'error',
  onCreateAccount,
  onForgotPassword,
  onSuccess,
}: LoginFormProps) {
  const { t, validators } = useTranslation();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [fetchCurrentUser] = useLazyGetCurrentUserQuery();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const normalizedEmail = normalizeEmail(email);
    const errors = validators.validateLogin({ email: normalizedEmail, password });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const result = await login({
        email_or_phone: normalizedEmail,
        password,
      }).unwrap();
      saveUserEmail(normalizedEmail);
      localStorage.setItem('accessToken', result.access);
      localStorage.setItem('refreshToken', result.refresh);
      logTokenExpirations(result.access, result.refresh);
      dispatch(setToken(result.access));
      dispatch(setAuthEmail(normalizedEmail));
      await fetchCurrentUser();
      onSuccess?.();
      router.push('/profile');
    } catch (error: unknown) {
      const detail = extractApiError(error) ?? '';

      if (detail.toLowerCase().includes('no active account')) {
        setErrorMessage(t.auth.errors.signInFailed);
      } else {
        setErrorMessage(detail || t.auth.errors.incorrectCredentials);
      }
    }
  };

  const handleGoogleSuccess = () => {
    onSuccess?.();
    router.push('/profile');
  };

  return (
    <div className={loginForm.panel}>
      <div className={loginForm.content}>
        <h1 className={loginForm.title}>{t.auth.login.welcome}</h1>
        <h2 className={loginForm.subtitle}>{t.auth.login.subtitle}</h2>

        {hintMessage && (
          <div
            className={hintType === 'success' ? loginForm.successMessage : loginForm.errorMessage}
          >
            {hintMessage}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className={loginForm.form}>
          <div className={loginForm.inputContainer}>
            <AuthInput
              id="email"
              name="email"
              label={t.auth.labels.emailOrMobile}
              type="email"
              placeholder={t.auth.placeholders.email}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                const msg = validators.validateField('email', e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: msg }));
              }}
              error={fieldErrors.email}
            />
          </div>

          <div className={loginForm.inputContainer}>
            <AuthInput
              id="password"
              name="password"
              label={t.auth.labels.password}
              type="password"
              placeholder={t.auth.placeholders.passwordDots}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                const msg = validators.validateField('password', e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: msg }));
              }}
              error={fieldErrors.password}
              togglePassword
            />
          </div>

          <div className={loginForm.optionalRow}>
            <label className={loginForm.checkboxWrap}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className={loginForm.checkboxInput}
              />

              <span className={loginForm.checkboxIcon} aria-hidden>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>

              <span className={loginForm.checkboxLabel}>{t.auth.login.rememberMe}</span>
            </label>

            <button type="button" className={loginForm.forgotBtn} onClick={onForgotPassword}>
              {t.auth.login.forgotPassword}
            </button>
          </div>

          {errorMessage && <div className={loginForm.errorMessage}>{errorMessage}</div>}

          <button type="submit" disabled={isLoading} className={loginForm.loginBtn}>
            {isLoading ? t.common.loading : t.auth.login.submit}
          </button>

          <div className={loginForm.socialRow}>
            <GoogleAuthButton
              acceptTerms
              className={loginForm.socialBtn}
              iconClassName={loginForm.socialIcon}
              onSuccess={handleGoogleSuccess}
              onError={(message) => {
                setErrorMessage(message);
              }}
            />

            <button type="button" className={loginForm.socialBtn}>
              <Image src={facebookLogo} alt="Facebook" className={loginForm.socialIcon} />
            </button>

            <button type="button" className={loginForm.socialBtn}>
              <Image src={appleLogo} alt="Apple" className={loginForm.socialIcon} />
            </button>
          </div>
        </form>

        <div className={loginForm.registerVariant}>
          <button type="button" className={loginForm.registerLink} onClick={onCreateAccount}>
            {t.auth.login.createAccount}
          </button>
        </div>
      </div>
    </div>
  );
}
