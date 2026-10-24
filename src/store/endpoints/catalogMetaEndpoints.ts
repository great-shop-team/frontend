import { api } from '../api';
import { unwrapList } from '../api/unwrapList';
import type {
  CatalogColor,
  CatalogSize,
  CurrencyAmount,
  ProductImageRecord,
  ProductVariant,
  ProductVariantWrite,
} from '../types';

export const catalogMetaEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getColors: builder.query<CatalogColor[], void>({
      query: () => '/api/colors/',
      transformResponse: (response: unknown) => unwrapList<CatalogColor>(response),
    }),
    getSizes: builder.query<CatalogSize[], void>({
      query: () => '/api/sizes/',
      transformResponse: (response: unknown) => unwrapList<CatalogSize>(response),
    }),
    getProductVariants: builder.query<ProductVariant[], void>({
      query: () => '/api/product-variants/?limit=2500',
      transformResponse: (response: unknown) => unwrapList<ProductVariant>(response),
      providesTags: ['Product'],
    }),
    createProductVariant: builder.mutation<ProductVariant, ProductVariantWrite>({
      query: (body) => ({ url: '/api/product-variants/', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    patchProductVariant: builder.mutation<ProductVariant, { id: number; body: ProductVariantWrite }>({
      query: ({ id, body }) => ({ url: `/api/product-variants/${id}/`, method: 'PATCH', body }),
      invalidatesTags: ['Product'],
    }),
    deleteProductVariant: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/product-variants/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    getProductImages: builder.query<ProductImageRecord[], void>({
      query: () => '/api/product-images/',
      transformResponse: (response: unknown) => unwrapList<ProductImageRecord>(response),
      providesTags: ['Product'],
    }),
    createProductImage: builder.mutation<
      ProductImageRecord,
      { product_variant: number; image: File; is_main?: boolean; sort_order?: number }
    >({
      query: ({ product_variant, image, is_main = false, sort_order = 0 }) => {
        const body = new FormData();
        body.append('product_variant', String(product_variant));
        body.append('image', image);
        body.append('is_main', String(is_main));
        body.append('sort_order', String(sort_order));
        return { url: '/api/product-images/', method: 'POST', body };
      },
      invalidatesTags: ['Product'],
    }),
    patchProductImage: builder.mutation<
      ProductImageRecord,
      { id: number; image?: File; is_main?: boolean; sort_order?: number }
    >({
      query: ({ id, image, is_main, sort_order }) => {
        if (!image) {
          return {
            url: `/api/product-images/${id}/`,
            method: 'PATCH',
            body: { is_main, sort_order },
          };
        }
        const body = new FormData();
        body.append('image', image);
        if (is_main !== undefined) body.append('is_main', String(is_main));
        if (sort_order !== undefined) body.append('sort_order', String(sort_order));
        return { url: `/api/product-images/${id}/`, method: 'PATCH', body };
      },
      invalidatesTags: ['Product'],
    }),
    deleteProductImage: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/product-images/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    getCurrencies: builder.query<CurrencyAmount[], void>({
      query: () => '/api/currencies/',
      transformResponse: (response: unknown) => unwrapList<CurrencyAmount>(response),
    }),
  }),
  overrideExisting: process.env.NODE_ENV !== 'production',
});

export const {
  useGetColorsQuery,
  useGetSizesQuery,
  useGetProductVariantsQuery,
  useLazyGetProductVariantsQuery,
  useCreateProductVariantMutation,
  usePatchProductVariantMutation,
  useDeleteProductVariantMutation,
  useGetProductImagesQuery,
  useCreateProductImageMutation,
  usePatchProductImageMutation,
  useDeleteProductImageMutation,
  useGetCurrenciesQuery,
} = catalogMetaEndpoints;
