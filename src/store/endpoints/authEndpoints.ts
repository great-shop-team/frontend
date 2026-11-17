import { api } from '../api';
import {
  LoginInput,
  TokenRefreshResponse,
  RegisterInput,
  User,
  GoogleAuthInput,
  PasswordChangeInput,
  PasswordResetInput,
  ActivationCodeInput,
  ResendActivationInput,
  PasswordResetConfirmInput,
} from '../types';

export const authEndpoints = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Логін
    login: builder.mutation<TokenRefreshResponse, LoginInput>({
      query: (body) => ({ url: '/api/login/', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),

    // Реєстрація
    registerUser: builder.mutation<User, RegisterInput>({
      query: (body) => ({ url: '/api/users/register/', method: 'POST', body }),
    }),

    // Авторизація / реєстрація через Google
    googleAuth: builder.mutation<TokenRefreshResponse, GoogleAuthInput>({
      query: (body) => ({ url: '/api/users/auth/google/', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),

    // Поточний користувач
    getCurrentUser: builder.query<User, void>({
      query: () => '/api/users/current-user/',
      providesTags: ['User'], // Тегуємо цей запит
    }),

    // Активація користувача по коду
    activateUserPatch: builder.mutation<void, ActivationCodeInput>({
      query: (body) => ({
        url: '/api/users/activate/',
        method: 'PATCH',
        body,
      }),
    }),

    // Зміна пароля
    changePassword: builder.mutation<void, PasswordChangeInput>({
      query: (body) => ({ url: '/api/users/password-change/', method: 'POST', body }),
    }),

    // Скидання пароля
    resetPassword: builder.mutation<void, PasswordResetInput>({
      query: (body) => ({ url: '/api/users/password-reset/', method: 'POST', body }),
    }),

    // Подтверждение скидання пароля
    passwordResetConfirm: builder.mutation<void, PasswordResetConfirmInput>({
      query: (body) => ({ url: '/api/users/password-reset-confirm/', method: 'POST', body }),
    }),

    // Повторне відправлення коду активації
    resendActivationCode: builder.mutation<void, ResendActivationInput>({
      query: (body) => ({
        url: '/api/users/resend_activation_code/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterUserMutation,
  useGoogleAuthMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useActivateUserPatchMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  usePasswordResetConfirmMutation,
  useResendActivationCodeMutation,
} = authEndpoints;
