import { redirect } from 'next/navigation';
import { clearAdminSession } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  await clearAdminSession();
  redirect('/admin/login');
}
