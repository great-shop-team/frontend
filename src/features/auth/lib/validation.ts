export const validateEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const validatePassword = (value: string): boolean => {
  if (typeof value !== 'string') return false;
  const re = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
  return re.test(value);
};

export const validateField = (
  name: string,
  value: string,
  formData?: Record<string, string>,
): string => {
  switch (name) {
    case 'firstName':
    case 'lastName':
      if (!value || !value.trim())
        return `${name === 'firstName' ? 'First name' : 'Last name'} is required.`;
      return '';
    case 'email':
      if (!value) return 'Email is required.';
      if (!validateEmail(value)) return 'Email must be a valid email address.';
      return '';
    case 'password':
      if (!value) return 'Password is required.';
      if (!validatePassword(value))
        return 'Password must be at least 8 characters, include one uppercase letter and one special character.';
      return '';
    case 'confirmPassword':
      if (!value) return 'Confirm password is required.';
      if (formData && formData.password !== value) return 'Passwords must match.';
      return '';
    default:
      return '';
  }
};

export const validateForm = (
  formData: Record<string, string>,
  acceptTerms = false,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
  fields.forEach((f) => {
    const msg = validateField(f, formData[f] ?? '', formData);
    if (msg) errors[f] = msg;
  });

  if (!acceptTerms)
    errors.acceptTerms = 'You must accept the Terms & Conditions and Privacy Policy.';

  return errors;
};

export const validateRegisterForm = (
  formData: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  },
  acceptTerms = false,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  (['email', 'password', 'confirmPassword'] as const).forEach((field) => {
    const msg = validateField(field, formData[field] ?? '', formData);
    if (msg) errors[field] = msg;
  });

  if (!acceptTerms) {
    errors.acceptTerms = 'You must accept the Terms & Conditions.';
  }

  return errors;
};

export const validateLogin = (data: { email?: string; password?: string }) => {
  const errors: Record<string, string> = {};
  const emailErr = validateField('email', data.email ?? '');
  const passErr = validateField('password', data.password ?? '');
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  return errors;
};
