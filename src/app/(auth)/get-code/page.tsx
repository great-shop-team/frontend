import { redirect } from 'next/navigation';

import { buildAuthRoute } from '@/features/auth/lib/authRoutes';

export default function GetCodePage() {
  redirect(buildAuthRoute('get-code'));
}
