import { redirect } from 'next/navigation';

import { buildAuthRoute } from '@/features/auth/lib/authRoutes';

export default function RegistrationPage() {
  redirect(buildAuthRoute('register'));
}
