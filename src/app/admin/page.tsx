import { AdminShell } from '@/components/admin/AdminShell';
import { UsageDashboard } from '@/components/admin/UsageDashboard';
import { getUsageSummary } from '@/lib/usage/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const planningCards = [
  {
    title: '文章发布',
    body: '根据热门工具、生肖、节气和择日事项安排选题。',
    href: '/admin/content',
    accent: 'bg-amber-100 text-amber-900',
  },
  {
    title: 'AI 解读',
    body: '管理解读请求、模型表现和人工精选答案。',
    href: '/admin/ai',
    accent: 'bg-emerald-100 text-emerald-900',
  },
  {
    title: '图片素材',
    body: '管理主视觉、节气图和生肖素材。',
    href: '/admin/assets',
    accent: 'bg-stone-200 text-stone-900',
  },
];

export default async function AdminHomePage() {
  const summary = await getUsageSummary(30);

  return (
    <AdminShell>
      <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-emerald-950 p-6 text-amber-50 shadow-2xl shadow-emerald-950/18 md:p-8">
        <div className="absolute -right-12 -top-16 size-48 rounded-full bg-amber-300/18 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-1/2 h-32 w-80 -translate-x-1/2 rounded-full bg-emerald-300/12 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-200/80">Control Room</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              用真实访问决定下一步怎么做。
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/78">
              集中看访问、工具提交、热门日期和内容机会，文章、素材和 AI 解读都从这里进入。
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-amber-100/15 bg-white/8 p-5">
            <p className="text-sm font-semibold text-amber-200">最近 30 天</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <HeroMetric label="工具提交" value={summary.toolSubmits} />
              <HeroMetric label="页面访问" value={summary.pageViews} />
              <HeroMetric label="工具错误" value={summary.toolErrors} />
              <HeroMetric label="匿名访客" value={summary.uniqueVisitors ?? '-'} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {planningCards.map((card) => (
          <a key={card.href} href={card.href} className="group rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/8">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${card.accent}`}>{card.title}</span>
            <p className="mt-4 text-sm leading-6 text-stone-600">{card.body}</p>
            <p className="mt-5 text-sm font-bold text-emerald-800 group-hover:text-emerald-600">进入模块</p>
          </a>
        ))}
      </section>

      <UsageDashboard summary={summary} title="运营总览" deck="最近 30 天的核心指标和内容信号。" />
      </div>
    </AdminShell>
  );
}

function HeroMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-emerald-900/60 p-4">
      <p className="text-xs font-semibold text-emerald-50/62">{label}</p>
      <p className="mt-2 text-3xl font-black text-amber-50">{value}</p>
    </div>
  );
}
