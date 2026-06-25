import productCardMock from '../../data/productCard.json';
import { api } from '../api';
import { normalizeProduct } from '../api/mappers/products.mapper';
import type { ProductCardData } from '../types';

const useMockProductCard = process.env.NEXT_PUBLIC_USE_MOCK_PRODUCT_CARD === 'true';

export const productsEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductCardData[], void>({
      query: () => '/api/products/',
      transformResponse: (response: unknown) => {
        if (!Array.isArray(response)) {
          return [];
        }

        return response.map((item, index) => normalizeProduct(item, index + 1));
      },
      providesTags: ['Product'],
    }),
    getProductCard: builder.query<ProductCardData, string>({
      queryFn: async (id, _api, _extraOptions, fetchWithBQ) => {
        // включаем мок, если бэкенд не готов
        if (useMockProductCard || !id) {
          return {
            data: normalizeProduct(productCardMock, 1, { preferLocalImages: true }),
          };
        }

        // Если бэкенд упал, возможно адрес должен быть `/api/products/${id}/`
        // Вместо `/api/products/product-card/${id}/`
        const result = await fetchWithBQ(`/api/products/${id}/`);

        if (result.error) {
          // Фолбэк (запасной вариант): если бэкенд выдал 404, отдаем мок, чтобы приложение не падало
          console.warn(`Backend returned error for ID ${id}, falling back to mock data.`);
          return {
            data: normalizeProduct(productCardMock, 1, { preferLocalImages: true }),
          };
        }

        return {
          data: normalizeProduct(result.data, 1),
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Product', id: `product-card-${id}` }],
    }),
    getProductById: builder.query<ProductCardData, number>({
      query: (id) => `/api/products/${id}/`,
      transformResponse: (response: unknown, _meta, id) => normalizeProduct(response, id),
      providesTags: (_result, _error, id) => [{ type: 'Product', id: `product-${id}` }],
    }),
  }),
  overrideExisting: process.env.NODE_ENV !== 'production',
});

export const { useGetProductsQuery, useGetProductCardQuery, useGetProductByIdQuery } =
  productsEndpoints;
