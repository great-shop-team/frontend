import { api } from '../api';
import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
  Subcategory,
  SubcategoryCreateInput,
  SubcategoryUpdateInput,
} from '../types';

const categoriesEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    // Категорії
    getCategories: builder.query<Category[], void>({
      query: () => '/api/categories/categories/',
      transformResponse: (response: unknown) =>
        Array.isArray(response)
          ? response
          : Array.isArray((response as { results?: unknown }).results)
            ? ((response as { results: Category[] }).results)
            : [],
    }),
    getCategoryById: builder.query<Category, number>({
      query: (id) => `/api/categories/categories/${id}/`,
    }),
    createCategory: builder.mutation<Category, CategoryCreateInput>({
      query: (body) => ({ url: '/api/categories/categories/', method: 'POST', body }),
    }),
    updateCategory: builder.mutation<Category, { id: number; body: CategoryUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/categories/categories/${id}/`,
        method: 'PUT',
        body,
      }),
    }),
    patchCategory: builder.mutation<Category, { id: number; body: CategoryUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/categories/categories/${id}/`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/categories/categories/${id}/`, method: 'DELETE' }),
    }),

    // Підкатегорії
    getSubcategories: builder.query<Subcategory[], void>({
      query: () => '/api/categories/subcategories/',
      transformResponse: (response: unknown) =>
        Array.isArray(response)
          ? response
          : Array.isArray((response as { results?: unknown }).results)
            ? ((response as { results: Subcategory[] }).results)
            : [],
    }),
    getSubcategoryById: builder.query<Subcategory, number>({
      query: (id) => `/api/categories/subcategories/${id}/`,
    }),
    createSubcategory: builder.mutation<Subcategory, SubcategoryCreateInput>({
      query: (body) => ({ url: '/api/categories/subcategories/', method: 'POST', body }),
    }),
    updateSubcategory: builder.mutation<Subcategory, { id: number; body: SubcategoryUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/categories/subcategories/${id}/`,
        method: 'PUT',
        body,
      }),
    }),
    patchSubcategory: builder.mutation<Subcategory, { id: number; body: SubcategoryUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/categories/subcategories/${id}/`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteSubcategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/categories/subcategories/${id}/`, method: 'DELETE' }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  usePatchCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubcategoriesQuery,
  useGetSubcategoryByIdQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  usePatchSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = categoriesEndpoints;
