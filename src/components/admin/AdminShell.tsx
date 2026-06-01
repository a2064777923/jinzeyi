import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, FilePenLine, Home, Image, LogOut, Sparkles } from 'lucide-react';
import { getAdminSession } from '@/lib/admin/auth';

const navItems = [
  { href: '/admin', label: '总览', icon: Home },
  { href: '/admin/usage', label: '使用情况', icon: BarChart3 },
  { href: '/admin/content', label: '文章发布', icon: FilePenLine },
  { href: '/admin/ai', label: 'AI 解读', icon: Sparkles },
  { href: '/admin/assets', label: '图片素材', icon: Image },
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-[#f5f1e6] text-emerald-950">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(217,119,6,0.16),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(4,120,87,0.18),transparent_32%),linear-gradient(135deg,#fffaf0,#ecfdf5)]" aria-hidden="true" />
      <aside className="fixed inset-y-0 left-0 hidden w-68 border-r border-emerald-900/10 bg-emerald-950 px-4 py-5 text-amber-50 shadow-2xl shadow-emerald-950/20 lg:block">
        <div className="rounded-3xl border border-amber-100/15 bg-white/7 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/80">Jin Ze Yi</p>
          <h1 className="mt-3 text-2xl font-black tracking-tight">今择易管理台</h1>
          <p className="mt-2 text-xs leading-5 text-emerald-50/70">访问、工具、内容和 AI 工作台。</p>
        </div>
        <nav className="mt-6 grid gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-emerald-50/80 transition hover:bg-white/10 hover:text-amber-50">
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/admin/logout" className="absolute bottom-5 left-4 right-4 flex items-center justify-center gap-2 rounded-2xl border border-amber-100/15 bg-white/7 px-3 py-3 text-sm font-semibold text-amber-50 transition hover:bg-white/12">
          <LogOut className="size-4" aria-hidden="true" />
          退出
        </Link>
      </aside>

      <div className="lg:pl-68">
        <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-[#f5f1e6]/86 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="font-black text-emerald-950">今择易管理台</Link>
            <Link href="/admin/logout" className="rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900">退出</Link>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="shrink-0 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
