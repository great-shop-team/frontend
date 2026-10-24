'use client';

import { useParams } from 'next/navigation';

import AdminProductForm from '../../AdminProductForm';

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);

  if (!Number.isFinite(productId)) return null;

  return <AdminProductForm productId={productId} />;
}
