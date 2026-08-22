'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import {
  bell,
  exit,
  location,
  orders,
  user,
} from '@/features/profile/ui/ProfileForm/icon/ProfileIcon';
import OrderFormList from '@/features/profile/ui/ProfileForm/OrderFormList/OrderFormList';
import ProfileFormList from '@/features/profile/ui/ProfileForm/ProfileFormList/ProfileFormList';
import { useTranslation } from '@/i18n/useTranslation';
import { selectCurrentUser } from '@/store/slices/userSlice';

import styles from './Profile.module.scss';
import AddressesList from '@/features/profile/ui/ProfileForm/AddressesList/AddressesList';
import MyBonuses from '@/features/profile/ui/ProfileForm/ProfileFormList/MyBonuses/MyBonuses';

type MenuId = 'profile' | 'bonuses' | 'orders' | 'addresses' | 'notifications' | 'out';

const ProfileForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { email: hookEmail } = useSessionEmail();
  const { logoutUser } = useAuth();
  const currentUser = useSelector(selectCurrentUser);

  const tabMenuContent: Record<string, ReactNode> = {
    profile: <ProfileFormList />,
    orders: <OrderFormList />,
    addresses: <AddressesList />,
    bonuses: <MyBonuses />,
  };

  const [activeTab, setActiveTab] = useState<MenuId>('profile');
  const [activeMenuId, setActiveMenuId] = useState<MenuId>('profile');

  const listMain = useMemo(
    () => [
      { id: 'profile' as MenuId, name: t.account.profile, icon: user },
      { id: 'orders' as MenuId, name: t.account.myOrders, icon: orders },
      { id: 'addresses' as MenuId, name: t.account.addresses, icon: location },
      { id: 'notifications' as MenuId, name: t.account.notifications, icon: bell },
      { id: 'out' as MenuId, name: t.account.logOut, icon: exit },
    ],
    [t],
  );

  function handleMenuClick(id: MenuId) {
    if (id === 'out') {
      router.replace('/');
      logoutUser();
      return;
    }

    setActiveMenuId(id);
    setActiveTab(id);
  }

  let nameToDisplay = '';

  // 1. Сначала ищем данные во вложенном объекте user (для Google)
  if (currentUser && typeof currentUser === 'object' && 'user' in currentUser) {
    const nestedUser = currentUser.user as Record<string, unknown> | null;
    if (nestedUser && typeof nestedUser === 'object') {
      const googleName = typeof nestedUser.username === 'string' ? nestedUser.username : '';
      const googleFirstName =
        typeof nestedUser.first_name === 'string' ? nestedUser.first_name : '';
      const googleEmail = typeof nestedUser.email === 'string' ? nestedUser.email : '';

      nameToDisplay = googleFirstName || googleName || googleEmail.split('@')[0] || '';
    }
  }

  // 2. Если в Redux ничего не нашлось, падаем на стандартный email из хука (для обычной почты)
  if (!nameToDisplay && typeof hookEmail === 'string' && hookEmail) {
    nameToDisplay = hookEmail.split('@')[0];
  }

  // 3. Если вообще всё пусто, берем заглушку из локализации
  const displayName = nameToDisplay || t.account.user;

  return (
    <div className={styles.headerProfile}>
      <div className={styles.main}>
        <div className={styles.nameUser}>
          <div>{t.account.hello}</div>
          <span className={styles.user}>{displayName}</span>
        </div>
        {listMain.map((value) => (
          <div
            key={value.id}
            className={activeMenuId === value.id ? styles.listItemMainActive : styles.listItemMain}
            onClick={() => handleMenuClick(value.id)}
          >
            {value.icon}
            {value.name}
          </div>
        ))}
      </div>
      {tabMenuContent[activeTab]}
    </div>
  );
};

export default ProfileForm;
