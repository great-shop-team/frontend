import { api } from '../api';
import { normalizeProduct } from '../api/mappers/products.mapper';
import { unwrapList } from '../api/unwrapList';
import type { ApiProduct, ProductCardData } from '../types';

function isNumericProductId(value: string) {
  return /^\d+$/.test(value);
}

export const productsEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductCardData[], void>({
      query: () => '/api/products/',
      transformResponse: (response: unknown) =>
        unwrapList(response).map((item, index) => normalizeProduct(item, index + 1)),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<ProductCardData, number>({
      query: (id) => `/api/products/${id}/`,
      transformResponse: (response: unknown, _meta, id) => normalizeProduct(response, id),
      providesTags: (_result, _error, id) => [{ type: 'Product', id: `product-${id}` }],
    }),
    getProductRawById: builder.query<ApiProduct, number>({
      query: (id) => `/api/products/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id: `product-raw-${id}` }],
    }),
    /**
     * Raw list of products from the backend.
     * Useful when we need to resolve product by slug (the backend exposes /api/products/{id}/ only).
     */
    getProductsRaw: builder.query<ApiProduct[], void>({
      query: () => '/api/products/',
      transformResponse: (response: unknown) => unwrapList<ApiProduct>(response),
      providesTags: ['Product'],
    }),
    /**
     * Resolve a product by slug (or numeric id passed as string) using the raw list.
     * Returns null when the product is not found.
     */
    getProductBySlug: builder.query<ApiProduct | null, string>({
      async queryFn(slugOrId, _api, _extraOptions, baseQuery) {
        const result = await baseQuery('/api/products/');

        if (result.error) {
          return { error: result.error };
        }

        const data = unwrapList<ApiProduct>(result.data);
        const numericId = Number(slugOrId);
        const product =
          data.find((item) => item.slug === slugOrId) ??
          (isNumericProductId(slugOrId) ? data.find((item) => item.id === numericId) : undefined) ??
          null;

        return { data: product };
      },
      providesTags: (_result, _error, slugOrId) => [{ type: 'Product', id: `product-${slugOrId}` }],
    }),
    getProductDetailsBySlugOrId: builder.query<ApiProduct | null, string>({
      async queryFn(slugOrId, _api, _extraOptions, baseQuery) {
        const numericId = Number(slugOrId);

        if (isNumericProductId(slugOrId)) {
          const productResult = await baseQuery(`/api/products/${numericId}/`);

          if (productResult.error) {
            return { error: productResult.error };
          }

          return { data: (productResult.data as ApiProduct) ?? null };
        }

        const listResult = await baseQuery('/api/products/');

        if (listResult.error) {
          return { error: listResult.error };
        }

        const products = unwrapList<ApiProduct>(listResult.data);
        const matchedProduct = products.find((item) => item.slug === slugOrId) ?? null;

        if (!matchedProduct) {
          return { data: null };
        }

        const productResult = await baseQuery(`/api/products/${matchedProduct.id}/`);

        if (productResult.error) {
          return { error: productResult.error };
        }

        return { data: (productResult.data as ApiProduct) ?? matchedProduct };
      },
      providesTags: (_result, _error, slugOrId) => [
        { type: 'Product', id: `product-details-${slugOrId}` },
      ],
    }),
  }),
  overrideExisting: process.env.NODE_ENV !== 'production',
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductRawByIdQuery,
  useGetProductsRawQuery,
  useGetProductBySlugQuery,
  useGetProductDetailsBySlugOrIdQuery,
} = productsEndpoints;
