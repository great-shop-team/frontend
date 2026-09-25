import { api } from '../api';
import { normalizeProduct } from '../api/mappers/products.mapper';
import { unwrapList } from '../api/unwrapList';
import type { ApiProduct, ProductCardData, ProductImageRecord, ProductVariant } from '../types';

export type SimilarProductsPayload = {
  products: ApiProduct[];
  variants: ProductVariant[];
  images: ProductImageRecord[];
};

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
      query: () => '/api/products/?limit=500',
      transformResponse: (response: unknown) => unwrapList<ApiProduct>(response),
      providesTags: ['Product'],
    }),
    /**
     * Resolve a product by slug (or numeric id passed as string) using the raw list.
     * Returns null when the product is not found.
     */
    getProductBySlug: builder.query<ApiProduct | null, string>({
      async queryFn(slugOrId, _api, _extraOptions, baseQuery) {
        const result = await baseQuery('/api/products/?limit=500');

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

        let matchedProduct: ApiProduct | null = null;
        let offset = 0;

        while (!matchedProduct && offset < 1000) {
          const listResult = await baseQuery(`/api/products/?limit=100&offset=${offset}`);

          if (listResult.error) {
            if (offset === 0) return { error: listResult.error };
            break;
          }

          const products = unwrapList<ApiProduct>(listResult.data);
          matchedProduct = products.find((item) => item.slug === slugOrId) ?? null;
          if (products.length < 100) break;
          offset += products.length;
        }

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
    /**
     * Products from the same subcategory, plus the variants and images needed to render them.
     */
    getSimilarProducts: builder.query<
      SimilarProductsPayload,
      { productId: number; subcategoryId: number }
    >({
      async queryFn({ productId, subcategoryId }, _api, _extraOptions, baseQuery) {
        const productsResult = await baseQuery(
          `/api/products/?subcategory=${subcategoryId}&limit=24`,
        );

        if (productsResult.error) {
          return { error: productsResult.error };
        }

        const products = unwrapList<ApiProduct>(productsResult.data).filter(
          (item) =>
            Number(item.id) !== Number(productId) && item.is_active !== false && !item.is_hidden,
        );

        try {
          const [variantsResult, imagesResult] = await Promise.all([
            baseQuery('/api/product-variants/?limit=2500'),
            baseQuery('/api/product-images/?limit=50'),
          ]);

          const watchedIds = new Set(products.map((item) => Number(item.id)));
          watchedIds.add(Number(productId));

          return {
            data: {
              products,
              variants: variantsResult.error
                ? []
                : unwrapList<ProductVariant>(variantsResult.data).filter((variant) =>
                    watchedIds.has(Number(variant.product)),
                  ),
              images: imagesResult.error
                ? []
                : unwrapList<ProductImageRecord>(imagesResult.data),
            },
          };
        } catch {
          return { data: { products, variants: [], images: [] } };
        }
      },
      providesTags: (_result, _error, arg) => [
        { type: 'Product', id: `similar-${arg.productId}` },
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
  useGetSimilarProductsQuery,
} = productsEndpoints;
