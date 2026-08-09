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

type ReauthExtraOptions = {
  _retried?: boolean;
};

let tokenRefreshPromise: Promise<string | null> | null = null;

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

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Profile', 'Product'],
  endpoints: () => ({}),
});
