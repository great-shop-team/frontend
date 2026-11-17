import { redirect } from 'next/navigation';

import { buildAuthRoute } from '@/features/auth/lib/authRoutes';

type PageProps = {
  searchParams: Promise<{
    email?: string;
    verified?: string;
  }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;

  redirect(
    buildAuthRoute('login', {
      email: params.email,
      verified: params.verified === '1',
    }),
  );
}
