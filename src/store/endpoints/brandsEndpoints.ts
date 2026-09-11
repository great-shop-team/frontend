import { api } from '../api';
import { unwrapList } from '../api/unwrapList';
import type { Brand, BrandCreateInput, BrandUpdateInput } from '../types';

const brandsEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<Brand[], void>({
      query: () => '/api/brands/',
      transformResponse: (response: unknown) => unwrapList<Brand>(response),
    }),
    getBrandById: builder.query<Brand, number>({
      query: (id) => `/api/brands/${id}/`,
    }),
    createBrand: builder.mutation<Brand, BrandCreateInput>({
      query: (body) => ({ url: '/api/brands/', method: 'POST', body }),
    }),
    updateBrand: builder.mutation<Brand, { id: number; body: BrandUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/brands/${id}/`,
        method: 'PUT',
        body,
      }),
    }),
    patchBrand: builder.mutation<Brand, { id: number; body: BrandUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/brands/${id}/`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteBrand: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/brands/${id}/`, method: 'DELETE' }),
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  usePatchBrandMutation,
  useDeleteBrandMutation,
} = brandsEndpoints;
