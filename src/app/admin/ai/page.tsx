import Link from 'next/link';
import { BrainCircuit, ClipboardCheck, MessageSquareText, Sparkles } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { buildAiCases, buildIntentMix } from '@/lib/admin/operations';
import { getUsageSummary } from '@/lib/usage/server';
import { AdminActionBoard, AdminHero, AdminMetric } from '../shared';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminAiPage() {
  const summary = await getUsageSummary(30);
  const cases = buildAiCases(summary, 12);
  const intentMix = buildIntentMix(summary);
  const readyCount = cases.filter((item) => item.status === 'ready').length;
  const attentionCount = cases.length - readyCount;

  return (
    <AdminShell>
      <div className="grid gap-6">
        <AdminHero
          eyebrow="AI Desk"
          title="AI 解读先服务真实工具结果。"
          deck="把八字、姓名、推荐日期的提交整理成可扩写的任务，后续接模型时直接围绕真实场景出答案。"
          actions={[
            { href: '/admin/usage', label: '使用情况' },
            { href: '/tools/bazi', label: '八字工具' },
            { href: '/tools/jieri-recommend', label: '推荐日期' },
          ]}
        />

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetric label="近期提交" value={summary.toolSubmits} note="可转成解读任务" tone="jade" />
          <AdminMetric label="可扩写" value={readyCount} note="已具备输入和结果摘要" tone="amber" />
          <AdminMetric label="需处理" value={attentionCount} note="错误或结果不足的记录" tone={attentionCount > 0 ? 'rose' : 'jade'} />
          <AdminMetric label="意图类型" value={intentMix.length} note="八字、择日、姓名等方向" tone="ink" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-950 text-amber-100">
                <Sparkles className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-emerald-950">解读任务</h2>
                <p className="text-sm text-stone-600">先沉淀成好答案，再接入模型自动生成。</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {cases.map((item) => (
                <Link key={`${item.title}-${item.subtitle}-${item.detail}`} href={item.href} className="rounded-3xl border border-emerald-900/10 bg-stone-50 p-5 transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black leading-6 text-emerald-950">{item.title}</h3>
                      <p className="mt-1 text-xs font-bold text-stone-500">{item.subtitle}</p>
                    </div>
                    <span className={item.status === 'attention' ? 'shrink-0 rounded-full bg-rose-50 px-2 py-1 text-xs font-black text-rose-700' : 'shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-800'}>
                      {item.status === 'attention' ? '需处理' : '可扩写'}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-stone-600">{item.detail}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-emerald-900/10 bg-[#fffaf0] p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-black text-emerald-950">意图分布</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">用来判断先训练哪类解读。</p>
            <div className="mt-5 grid gap-3">
              {intentMix.map((item) => (
                <div key={item.key} className="rounded-3xl border border-emerald-900/10 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-emerald-950">{item.key}</p>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-800">{item.count}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-emerald-800" style={{ width: `${Math.max(8, item.count * 8)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <AdminActionBoard
          title="接入 AI 的顺序"
          items={[
            {
              icon: ClipboardCheck,
              title: '先定答案格式',
              body: '每类工具结果都要有固定输出骨架：重点、提醒、可继续核对的位置，避免答案散掉。',
              cta: '先做模板',
            },
            {
              icon: MessageSquareText,
              title: '再做语气',
              body: '黄历、生肖、节气内容要像真人讲解，少堆术语，多讲场景和取舍。',
              cta: '沉淀表达',
            },
            {
              icon: BrainCircuit,
              title: '最后接模型',
              body: '模型接入后只负责扩写和组织语言，基础盘面、择日分数和素材仍由站内规则提供。',
              cta: '规则先行',
            },
          ]}
        />
      </div>
    </AdminShell>
  );
}
