'use client';

import AdminDirectory from './AdminDirectory';
import { useTranslation } from '@/i18n/useTranslation';
import { useGetBrandsQuery } from '@/store/endpoints/brandsEndpoints';

export default function AdminBrands() {
  const { t } = useTranslation();
  const brands = useGetBrandsQuery();

  return (
    <AdminDirectory
      title={t.admin.brands}
      items={brands.data}
      isLoading={brands.isLoading}
      isError={brands.isError}
    />
  );
}
