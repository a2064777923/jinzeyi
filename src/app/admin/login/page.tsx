import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin/auth';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect('/admin');

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f1e6] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(217,119,6,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(4,120,87,0.2),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.82),rgba(236,253,245,0.62))]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-700 via-emerald-800 to-stone-900" aria-hidden="true" />
      <section className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(23rem,0.75fr)] lg:items-center">
        <div className="hidden rounded-[2rem] border border-emerald-900/10 bg-emerald-950 p-8 text-amber-50 shadow-2xl shadow-emerald-950/20 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200/80">Admin</p>
          <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight">
            今择易网站运营后台。
          </h2>
          <div className="mt-8 grid gap-3 text-sm leading-6 text-emerald-50/82">
          <p className="rounded-2xl border border-amber-100/15 bg-white/7 p-4">看清热门工具和热门日期，安排下一批内容。</p>
          <p className="rounded-2xl border border-amber-100/15 bg-white/7 p-4">盯住错误和空结果，优先修影响使用的位置。</p>
          <p className="rounded-2xl border border-amber-100/15 bg-white/7 p-4">管理文章计划、图片素材和 AI 解读任务。</p>
          </div>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
