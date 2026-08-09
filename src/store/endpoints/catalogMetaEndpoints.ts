import { api } from '../api';
import type {
  CatalogColor,
  CatalogSize,
  CurrencyAmount,
  ProductImageRecord,
  ProductVariant,
} from '../types';

export const catalogMetaEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getColors: builder.query<CatalogColor[], void>({
      query: () => '/api/colors/',
      transformResponse: (response: unknown) => (Array.isArray(response) ? response : []),
    }),
    getSizes: builder.query<CatalogSize[], void>({
      query: () => '/api/sizes/',
      transformResponse: (response: unknown) => (Array.isArray(response) ? response : []),
    }),
    getProductVariants: builder.query<ProductVariant[], void>({
      query: () => '/api/product-variants/',
      transformResponse: (response: unknown) => (Array.isArray(response) ? response : []),
    }),
    getProductImages: builder.query<ProductImageRecord[], void>({
      query: () => '/api/product-images/',
      transformResponse: (response: unknown) => (Array.isArray(response) ? response : []),
    }),
    getCurrencies: builder.query<CurrencyAmount[], void>({
      query: () => '/api/currencies/',
      transformResponse: (response: unknown) => (Array.isArray(response) ? response : []),
    }),
  }),
  overrideExisting: process.env.NODE_ENV !== 'production',
});

export const {
  useGetColorsQuery,
  useGetSizesQuery,
  useGetProductVariantsQuery,
  useGetProductImagesQuery,
  useGetCurrenciesQuery,
} = catalogMetaEndpoints;
