'use client';
import { useTranslation } from '@/i18n/useTranslation';

const MyBonuses = () => {
  const { t } = useTranslation();
  return <div>{t.profile.myBonuses}</div>;
};

export default MyBonuses;
