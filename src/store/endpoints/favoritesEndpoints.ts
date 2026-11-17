import { api } from '../api';
import { normalizeFavorite, toFavoriteList } from '@/features/wishlist/lib/favorites';
import type { Favorite, FavoriteCreateInput, FavoriteUpdateInput } from '../types';

export const favoritesEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<Favorite[], void>({
      query: () => '/api/favorites/favorites-user-list/',
      transformResponse: (response: unknown) => toFavoriteList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Favorite' as const, id })),
              { type: 'Favorite', id: 'LIST' },
            ]
          : [{ type: 'Favorite', id: 'LIST' }],
    }),
    getFavoriteById: builder.query<Favorite, number>({
      query: (id) => `/api/favorites/${id}/`,
      transformResponse: (response: unknown) => {
        const favorite = normalizeFavorite(response);
        if (!favorite) {
          throw new Error('Invalid favorite');
        }
        return favorite;
      },
      providesTags: (_result, _error, id) => [{ type: 'Favorite', id }],
    }),
    createFavorite: builder.mutation<Favorite, FavoriteCreateInput>({
      query: (body) => ({ url: '/api/favorites/', method: 'POST', body }),
      transformResponse: (response: unknown, _meta, arg) =>
        normalizeFavorite(response) ?? {
          id: 0,
          variantId: arg.product_variant,
          productId: '',
        },
      async onQueryStarted({ product_variant }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          favoritesEndpoints.util.updateQueryData('getFavorites', undefined, (draft) => {
            if (draft.some((item) => item.variantId === product_variant)) return;
            draft.push({ id: -product_variant, variantId: product_variant, productId: '' });
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            favoritesEndpoints.util.updateQueryData('getFavorites', undefined, (draft) => {
              const index = draft.findIndex(
                (item) => item.variantId === data.variantId || item.id === data.id,
              );
              if (index >= 0) {
                draft[index] = data;
                return;
              }
              draft.push(data);
            }),
          );
        } catch {
          patch.undo();
        }
      },
    }),
    updateFavorite: builder.mutation<Favorite, { id: number; body: FavoriteUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/favorites/${id}/`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: unknown) => {
        const favorite = normalizeFavorite(response);
        if (!favorite) {
          throw new Error('Invalid favorite');
        }
        return favorite;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Favorite', id },
        { type: 'Favorite', id: 'LIST' },
      ],
    }),
    patchFavorite: builder.mutation<Favorite, { id: number; body: FavoriteUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/favorites/${id}/`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: unknown) => {
        const favorite = normalizeFavorite(response);
        if (!favorite) {
          throw new Error('Invalid favorite');
        }
        return favorite;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Favorite', id },
        { type: 'Favorite', id: 'LIST' },
      ],
    }),
    deleteFavorite: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/favorites/${id}/`, method: 'DELETE' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          favoritesEndpoints.util.updateQueryData('getFavorites', undefined, (draft) => {
            const index = draft.findIndex((item) => item.id === id);
            if (index >= 0) draft.splice(index, 1);
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
  overrideExisting: process.env.NODE_ENV !== 'production',
});

export const {
  useGetFavoritesQuery,
  useLazyGetFavoritesQuery,
  useGetFavoriteByIdQuery,
  useCreateFavoriteMutation,
  useUpdateFavoriteMutation,
  usePatchFavoriteMutation,
  useDeleteFavoriteMutation,
} = favoritesEndpoints;
