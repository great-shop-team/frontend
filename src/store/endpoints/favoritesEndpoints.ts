import { api } from '../api';
import { normalizeFavorite, toFavoriteList } from '@/features/wishlist/lib/favorites';
import type { Favorite, FavoriteCreateInput, FavoriteUpdateInput } from '../types';

export const favoritesEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<Favorite[], void>({
      query: () => '/api/favorites/',
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
        normalizeFavorite(response) ?? { id: 0, productId: String(arg.product) },
      async onQueryStarted({ product }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData('getFavorites', undefined, (draft) => {
            if (draft.some((item) => item.productId === String(product))) return;
            draft.push({ id: -product, productId: String(product) });
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData('getFavorites', undefined, (draft) => {
              const index = draft.findIndex((item) => item.productId === data.productId);
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
      invalidatesTags: [{ type: 'Favorite', id: 'LIST' }],
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
          api.util.updateQueryData('getFavorites', undefined, (draft) => {
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
      invalidatesTags: (_result, _error, id) => [
        { type: 'Favorite', id },
        { type: 'Favorite', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useGetFavoriteByIdQuery,
  useCreateFavoriteMutation,
  useUpdateFavoriteMutation,
  usePatchFavoriteMutation,
  useDeleteFavoriteMutation,
} = favoritesEndpoints;
