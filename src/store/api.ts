import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { isAccessTokenExpired, logTokenExpirations } from '@/features/auth/lib/jwtExpiration';
import type { RootState } from './store';

const REFRESH_URL = '/api/token/refresh/';
const LOGIN_URL = '/api/login/';
const UNAUTHORIZED_ROUTE = '/401';
const INTERNAL_SERVER_ERROR_ROUTE = '/500';
const UNAUTHORIZED_REDIRECT_EXCLUDED_URLS = [
  LOGIN_URL,
  '/api/users/register/',
  '/api/users/auth/google/',
  '/api/users/activate/',
  '/api/users/password-reset/',
  '/api/users/password-reset-confirm/',
  '/api/users/resend_activation_code/',
];

let isRedirectingToUnauthorized = false;
let isRedirectingToServerError = false;

type ReauthExtraOptions = {
  _retried?: boolean;
};

let tokenRefreshPromise: Promise<string | null> | null = null;

function getRequestUrl(args: string | FetchArgs) {
  return typeof args === 'string' ? args : args.url;
}

function shouldRedirectToUnauthorized(args: string | FetchArgs, isRefreshRequest: boolean) {
  if (typeof window === 'undefined' || isRefreshRequest) {
    return false;
  }

  const requestUrl = getRequestUrl(args);

  return !UNAUTHORIZED_REDIRECT_EXCLUDED_URLS.some((url) => requestUrl.startsWith(url));
}

function redirectToUnauthorized(api: BaseQueryApi) {
  api.dispatch({ type: 'user/logout' });

  if (typeof window === 'undefined') {
    return;
  }

  if (window.location.pathname === UNAUTHORIZED_ROUTE || isRedirectingToUnauthorized) {
    return;
  }

  isRedirectingToUnauthorized = true;
  window.location.replace(UNAUTHORIZED_ROUTE);
}

function redirectToServerError() {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.location.pathname === INTERNAL_SERVER_ERROR_ROUTE || isRedirectingToServerError) {
    return;
  }

  isRedirectingToServerError = true;
  window.location.replace(INTERNAL_SERVER_ERROR_ROUTE);
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).user?.token ||
      (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

async function refreshAccessToken(
  api: BaseQueryApi,
  extraOptions: ReauthExtraOptions,
): Promise<string | null> {
  if (!tokenRefreshPromise) {
    tokenRefreshPromise = (async () => {
      try {
        const refreshToken =
          typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

        if (!refreshToken) {
          console.error('[RTK Reauth] Refresh token не найден в localStorage');
          api.dispatch({ type: 'user/logout' });
          return null;
        }

        const refreshRequest = {
          url: REFRESH_URL,
          method: 'POST' as const,
          body: { refresh: refreshToken },
        };

        let refreshResult = await baseQuery(refreshRequest, api, extraOptions);

        if (refreshResult.error?.status === 429) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          refreshResult = await baseQuery(refreshRequest, api, extraOptions);
        }

        if (refreshResult.data) {
          const data = refreshResult.data as { access?: string; refresh?: string };

          if (data.access) {
            localStorage.setItem('accessToken', data.access);
            api.dispatch({ type: 'user/setToken', payload: data.access });

            if (data.refresh) {
              localStorage.setItem('refreshToken', data.refresh);
            }

            logTokenExpirations(data.access, data.refresh ?? refreshToken);

            return data.access;
          }
        }

        console.error('[RTK Reauth] Refresh отклонён, выполняем logout');
        api.dispatch({ type: 'user/logout' });
        return null;
      } catch (e) {
        console.error('[RTK Reauth] Ошибка refresh-запроса:', e);
        api.dispatch({ type: 'user/logout' });
        return null;
      } finally {
        tokenRefreshPromise = null;
      }
    })();
  }

  return tokenRefreshPromise;
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ReauthExtraOptions
> = async (args, api, extraOptions = {}) => {
  const isRefreshRequest = typeof args === 'object' && args.url === REFRESH_URL;

  if (tokenRefreshPromise && !isRefreshRequest) {
    const newToken = await tokenRefreshPromise;

    if (!newToken) {
      return {
        error: {
          status: 401,
          data: 'Session expired',
        } as FetchBaseQueryError,
      };
    }
  }

  if (!isRefreshRequest && !extraOptions._retried) {
    const currentToken =
      (api.getState() as RootState).user?.token ||
      (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

    const hasRefreshToken =
      typeof window !== 'undefined' && Boolean(localStorage.getItem('refreshToken'));

    if (isAccessTokenExpired(currentToken) && hasRefreshToken) {
      await refreshAccessToken(api, extraOptions);
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isRefreshRequest && !extraOptions._retried) {
    const newToken = await refreshAccessToken(api, extraOptions);

    if (newToken) {
      result = await baseQuery(args, api, { ...extraOptions, _retried: true });
    }
  }

  if (result.error?.status === 401 && shouldRedirectToUnauthorized(args, isRefreshRequest)) {
    redirectToUnauthorized(api);
  }

  if (result.error?.status === 500) {
    redirectToServerError();
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Profile', 'Product'],
  endpoints: () => ({}),
});
