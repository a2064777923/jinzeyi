import Link from 'next/link';
import { BarChart3, Brush, FilePenLine, Sparkles } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { UsageDashboard } from '@/components/admin/UsageDashboard';
import { buildAiCases, buildAssetInventory, buildContentInventory, buildContentOpportunities } from '@/lib/admin/operations';
import { getUsageSummary } from '@/lib/usage/server';
import { AdminActionBoard, AdminHero, AdminMetric, AssetCoverage, InventoryStrip, OpportunityGrid } from './shared';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminHomePage() {
  const summary = await getUsageSummary(30);
  const opportunities = buildContentOpportunities(summary, 4);
  const inventory = buildContentInventory();
  const aiCases = buildAiCases(summary, 3);
  const assetGroups = buildAssetInventory().slice(0, 4);

  return (
    <AdminShell>
      <div className="grid gap-6">
        <AdminHero
          eyebrow="Control Room"
          title="把访问、内容、素材和 AI 放进同一张工作台。"
          deck="每天先看真实使用，再决定写什么、补什么图、把哪类结果做成更好的解读。"
          actions={[
            { href: '/admin/usage', label: '使用情况' },
            { href: '/admin/content', label: '内容计划' },
            { href: '/admin/ai', label: 'AI 解读' },
          ]}
        />

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetric label="工具提交" value={summary.toolSubmits} note="八字、姓名、推荐日期等提交" tone="jade" />
          <AdminMetric label="页面访问" value={summary.pageViews} note="站内主要入口访问" tone="ink" />
          <AdminMetric label="内容机会" value={opportunities.length} note="由访问和提交自动整理" tone="amber" />
          <AdminMetric label="待关注错误" value={summary.toolErrors} note="表单或结果异常优先排查" tone={summary.toolErrors > 0 ? 'rose' : 'jade'} />
        </section>

        <OpportunityGrid title="今天值得推进" deck="从最近 30 天的行为里挑出最适合写、补、优化的位置。" items={opportunities} />

        <AdminActionBoard
          title="运营动线"
          items={[
            {
              icon: BarChart3,
              title: '看趋势',
              body: '先看入口热度、功能热度、日期和城市分布，判断来访者到底在找什么。',
              href: '/admin/usage',
              cta: '进入使用情况',
            },
            {
              icon: FilePenLine,
              title: '排内容',
              body: '把热门场景、生肖和节气变成选题，优先补能带来搜索流量的页面。',
              href: '/admin/content',
              cta: '进入内容计划',
            },
            {
              icon: Sparkles,
              title: '沉淀 AI',
              body: '把真实提交整理成解读任务，后续接入模型时直接按场景出答案。',
              href: '/admin/ai',
              cta: '进入 AI 解读',
            },
          ]}
        />

        <InventoryStrip items={inventory} />

        <section className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-950 text-amber-100">
                <Sparkles className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-emerald-950">AI 待处理</h2>
                <p className="text-sm text-stone-600">近期工具结果适合继续写成自然解读。</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {aiCases.map((item) => (
                <Link key={`${item.title}-${item.subtitle}`} href={item.href} className="rounded-3xl border border-emerald-900/10 bg-stone-50 p-4 transition hover:bg-emerald-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-emerald-950">{item.title}</h3>
                      <p className="mt-1 text-xs font-bold text-stone-500">{item.subtitle}</p>
                    </div>
                    <span className={item.status === 'attention' ? 'rounded-full bg-rose-50 px-2 py-1 text-xs font-black text-rose-700' : 'rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-800'}>
                      {item.status === 'attention' ? '需处理' : '可扩写'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{item.detail}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-900/10 bg-[#fffaf0] p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
                <Brush className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-emerald-950">素材状态</h2>
                <p className="text-sm text-stone-600">主视觉、生肖、节气和方位图的覆盖情况。</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {assetGroups.map((group) => (
                <Link key={group.key} href="/admin/assets" className="rounded-3xl border border-emerald-900/10 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                  <p className="text-sm font-black text-emerald-950">{group.title}</p>
                  <p className="mt-2 text-3xl font-black text-stone-950">{group.ready}/{group.total}</p>
                  <p className="mt-1 text-xs font-bold text-stone-500">{group.missing > 0 ? `${group.missing} 个待补` : '素材齐备'}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <UsageDashboard summary={summary} title="运营总览" deck="最近 30 天的核心指标和内容信号。" compact />
        <AssetCoverage groups={assetGroups.slice(0, 2)} />
      </div>
    </AdminShell>
  );
}
