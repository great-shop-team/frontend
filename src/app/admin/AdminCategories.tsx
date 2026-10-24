'use client';

import AdminDirectory from './AdminDirectory';
import { useTranslation } from '@/i18n/useTranslation';
import { useGetCategoriesQuery, useGetSubcategoriesQuery } from '@/store/endpoints/categoriesEndpoints';

export default function AdminCategories() {
  const { t } = useTranslation();
  const categories = useGetCategoriesQuery();
  const subcategories = useGetSubcategoriesQuery();
  const categoryOptions = (categories.data ?? []).map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <div className="flex flex-col gap-8">
      <AdminDirectory
        title={t.admin.categories}
        items={categories.data}
        isLoading={categories.isLoading}
        isError={categories.isError}
      />
      <AdminDirectory
        title={t.admin.subcategories}
        items={subcategories.data}
        isLoading={subcategories.isLoading}
        isError={subcategories.isError}
        categories={categoryOptions}
        showCategory
      />
    </div>
  );
}
