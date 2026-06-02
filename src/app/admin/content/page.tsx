import { CalendarDays, FilePenLine, Search, Sprout } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { buildContentInventory, buildContentOpportunities } from '@/lib/admin/operations';
import { getUsageSummary } from '@/lib/usage/server';
import { AdminActionBoard, AdminHero, AdminMetric, InventoryStrip, OpportunityGrid } from '../shared';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminContentPage() {
  const summary = await getUsageSummary(30);
  const opportunities = buildContentOpportunities(summary, 8);
  const inventory = buildContentInventory();
  const articleCount = inventory.reduce((total, item) => total + item.articleCount, 0);
  const pageCount = inventory.reduce((total, item) => total + item.count, 0);

  return (
    <AdminShell>
      <div className="grid gap-6">
        <AdminHero
          eyebrow="内容计划"
          title="内容计划从真实需求开始。"
          deck="热门工具、日期、生肖、节气和风水场景都可以转成选题，先补最容易被搜索和分享的内容。"
          actions={[
            { href: '/admin/usage', label: '看数据' },
            { href: '/solar-terms', label: '节气页' },
            { href: '/zodiac', label: '生肖页' },
          ]}
        />

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetric label="收录页面" value={pageCount} note="站点地图和内容清单覆盖" tone="jade" />
          <AdminMetric label="文章内容" value={articleCount} note="生肖、风水、知识等可阅读内容" tone="ink" />
          <AdminMetric label="近期机会" value={opportunities.length} note="由访问和工具提交整理" tone="amber" />
          <AdminMetric label="热门查询" value={summary.topAlmanacDates.length + summary.topScenes.length} note="日期和择日场景信号" tone="rose" />
        </section>

        <OpportunityGrid
          title="选题池"
          deck="这些题材适合写成专题、FAQ、短文或工具说明，发布后再回到使用情况里看表现。"
          items={opportunities}
        />

        <AdminActionBoard
          title="内容生产节奏"
          items={[
            {
              icon: Search,
              title: '搜索入口',
              body: '优先写“黄历日期、生肖、节气、择日场景”这类明确搜索意图，标题直接回应场景。',
              cta: '先补高意图内容',
            },
            {
              icon: Sprout,
              title: '生活镜头',
              body: '节气和生肖内容要有画面和人味，围绕真实生活、饮食、出行、家庭安排展开。',
              cta: '少写词条，多写场景',
            },
            {
              icon: CalendarDays,
              title: '发布节奏',
              body: '节气前后、春节前后、开学季、婚嫁旺季都适合提前排内容，不要等流量来了才写。',
              cta: '按季节排期',
            },
          ]}
        />

        <InventoryStrip items={inventory} />

        <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-950 text-amber-100">
              <FilePenLine className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-black text-emerald-950">下一批建议</h2>
              <p className="text-sm text-stone-600">按流量机会和网站调性排序。</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {[
              '把热门择日场景扩成“如何挑日子”的系列内容，重点讲宜项、避冲和现实安排。',
              '节气故事配合图片素材，补充饮食、习俗、天气和黄历入口，适合社媒传播。',
              '生肖详情页继续加生活场景，讲生肖和节日、场景之间怎样互相影响。',
            ].map((item, index) => (
              <div key={item} className="rounded-3xl border border-emerald-900/10 bg-stone-50 p-5">
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-950 text-sm font-black text-amber-50">{index + 1}</span>
                <p className="mt-4 text-sm font-semibold leading-6 text-stone-800">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
