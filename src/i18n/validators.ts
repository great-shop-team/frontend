import { validateEmail, validatePassword } from '@/features/auth/lib/validation';

import type { Dictionary } from './locales/en';

export function getValidators(t: Dictionary) {
  const validateField = (
    name: string,
    value: string,
    formData?: Record<string, string>,
  ): string => {
    switch (name) {
      case 'firstName':
        if (!value?.trim()) return t.validation.firstNameRequired;
        return '';
      case 'lastName':
        if (!value?.trim()) return t.validation.lastNameRequired;
        return '';
      case 'email':
        if (!value) return t.validation.emailRequired;
        if (!validateEmail(value)) return t.validation.emailInvalid;
        return '';
      case 'password':
        if (!value) return t.validation.passwordRequired;
        if (!validatePassword(value)) return t.validation.passwordInvalid;
        return '';
      case 'confirmPassword':
        if (!value) return t.validation.confirmPasswordRequired;
        if (formData && formData.password !== value) return t.validation.passwordsMustMatch;
        return '';
      default:
        return '';
    }
  };

  const validateLogin = (data: { email?: string; password?: string }) => {
    const errors: Record<string, string> = {};
    const emailErr = validateField('email', data.email ?? '');
    const passErr = validateField('password', data.password ?? '');
    if (emailErr) errors.email = emailErr;
    if (passErr) errors.password = passErr;
    return errors;
  };

  const validateRegisterForm = (
    formData: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    },
    acceptTerms = false,
  ) => {
    const errors: Record<string, string> = {};

    (['email', 'password', 'confirmPassword'] as const).forEach((field) => {
      const msg = validateField(field, formData[field] ?? '', formData);
      if (msg) errors[field] = msg;
    });

    if (!acceptTerms) {
      errors.acceptTerms = t.validation.acceptTermsShort;
    }

    return errors;
  };

  return { validateField, validateLogin, validateRegisterForm };
}
