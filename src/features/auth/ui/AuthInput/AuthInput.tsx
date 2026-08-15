'use client';

import { ChangeEvent, useId, useState } from 'react';

import { authForm } from '@/features/auth/ui/authClasses';
import { useTranslation } from '@/i18n/useTranslation';

type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url';

interface AuthInputProps {
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: InputType;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
  togglePassword?: boolean;
  autoComplete?: string;
}

export default function AuthInput({
  id,
  name,
  label,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  error,
  hint,
  togglePassword = false,
  autoComplete,
}: AuthInputProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === 'password' && togglePassword ? (showPassword ? 'text' : 'password') : type;

  const reactId = useId();
  const inputId = id ?? `auth-input-${reactId}`;
  const resolvedAutoComplete =
    autoComplete ??
    (type === 'email' ? 'email' : type === 'password' ? 'current-password' : undefined);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className={authForm.fieldLabel}>
        {label}
      </label>
      <div
        className={`relative rounded-[10px] border bg-white ${
          error ? 'border-error' : 'border-dark'
        }`}
      >
        <input
          id={inputId}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={resolvedAutoComplete}
          autoCapitalize={type === 'email' ? 'none' : undefined}
          autoCorrect={type === 'email' ? 'off' : undefined}
          spellCheck={type === 'email' || type === 'password' ? false : undefined}
          className="box-border w-full rounded-[10px] border-none bg-transparent px-4 py-4 pr-12 text-base text-dark outline-none focus:shadow-none focus-visible:shadow-none placeholder:text-gray max-md:py-3.5"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {togglePassword && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent text-gray"
            aria-label={showPassword ? t.common.hidePassword : t.common.showPassword}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.64 21.64 0 015.15-6.13" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {hint && <p className="text-sm leading-5 text-gray">{hint}</p>}
      {error && (
        <p id={`${inputId}-error`} className="text-sm leading-5 text-error">
          {error}
        </p>
      )}
    </div>
  );
}
