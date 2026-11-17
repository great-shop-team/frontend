'use client';

import { useTranslation } from '@/i18n/useTranslation';

const MyPurchases = () => {
  const { t } = useTranslation();
  return <div>{t.profile.myPurchases}</div>;
};

export default MyPurchases;
