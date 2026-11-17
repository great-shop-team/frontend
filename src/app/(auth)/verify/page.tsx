import { redirect } from 'next/navigation';

import { buildAuthRoute } from '@/features/auth/lib/authRoutes';

type PageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerifyPage({ searchParams }: PageProps) {
  const params = await searchParams;

  redirect(
    buildAuthRoute('verify', {
      email: params.email,
    }),
  );
}
