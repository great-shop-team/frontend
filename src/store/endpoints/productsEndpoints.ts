import { api } from '../api';
import { normalizeProduct } from '../api/mappers/products.mapper';
import type { ApiProduct, ProductCardData } from '../types';

export const productsEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiProduct[], void>({
      query: () => '/api/products/',
      transformResponse: (response: unknown) => {
        if (!Array.isArray(response)) return [];
        return response as ApiProduct[];
      },
      providesTags: ['Product'],
    }),
    getProductById: builder.query<ProductCardData, number>({
      query: (id) => `/api/products/${id}/`,
      transformResponse: (response: unknown, _meta, id) => normalizeProduct(response, id),
      providesTags: (_result, _error, id) => [{ type: 'Product', id: `product-${id}` }],
    }),
  }),
  overrideExisting: process.env.NODE_ENV !== 'production',
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsEndpoints;
