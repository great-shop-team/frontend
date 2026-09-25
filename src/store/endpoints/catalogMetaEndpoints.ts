import { api } from '../api';
import { unwrapList } from '../api/unwrapList';
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
      transformResponse: (response: unknown) => unwrapList<CatalogColor>(response),
    }),
    getSizes: builder.query<CatalogSize[], void>({
      query: () => '/api/sizes/',
      transformResponse: (response: unknown) => unwrapList<CatalogSize>(response),
    }),
    getProductVariants: builder.query<ProductVariant[], void>({
      query: () => '/api/product-variants/?limit=2500',
      transformResponse: (response: unknown) => unwrapList<ProductVariant>(response),
    }),
    getProductImages: builder.query<ProductImageRecord[], void>({
      query: () => '/api/product-images/',
      transformResponse: (response: unknown) => unwrapList<ProductImageRecord>(response),
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
  useGetProductImagesQuery,
  useGetCurrenciesQuery,
} = catalogMetaEndpoints;
