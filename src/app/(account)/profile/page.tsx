'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/hooks/useAuth';
import ProfileForm from '@/features/profile/ui/ProfileForm/ProfileForm';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const hasToken =
      typeof window !== 'undefined'
        ? token || Boolean(localStorage.getItem('accessToken'))
        : Boolean(token);

    if (!isAuthenticated && !hasToken) {
      router.replace('/');
    }
  }, [isAuthenticated, token, router]);

  if (
    !isAuthenticated &&
    !token &&
    typeof window !== 'undefined' &&
    !localStorage.getItem('accessToken')
  ) {
    return null;
  }

  return (
    <div>
      <ProfileForm />
    </div>
  );
}
