import { Brush, ImageIcon, Palette, WandSparkles } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { buildAssetInventory } from '@/lib/admin/operations';
import { AdminActionBoard, AdminHero, AdminMetric, AssetCoverage } from '../shared';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function AdminAssetsPage() {
  const groups = buildAssetInventory();
  const total = groups.reduce((sum, group) => sum + group.total, 0);
  const ready = groups.reduce((sum, group) => sum + group.ready, 0);
  const missing = total - ready;
  const completeGroups = groups.filter((group) => group.missing === 0).length;

  return (
    <AdminShell>
      <div className="grid gap-6">
        <AdminHero
          eyebrow="图片素材"
          title="素材库要保证含义准确，画风统一。"
          deck="站点图标、生肖、节气、吉日场景、风水空间和黄历方位都在这里盘点，避免缺角、错位和语义对不上。"
          actions={[
            { href: '/zh-hans', label: '首页' },
            { href: '/zodiac', label: '生肖页' },
            { href: '/solar-terms', label: '节气页' },
          ]}
        />

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetric label="素材总数" value={total} note="当前核心素材盘点" tone="jade" />
          <AdminMetric label="已就绪" value={ready} note="本地文件存在并可引用" tone="ink" />
          <AdminMetric label="待补图" value={missing} note="需要重新生成或补齐" tone={missing > 0 ? 'rose' : 'jade'} />
          <AdminMetric label="完整分组" value={completeGroups} note="全部素材齐备的主题" tone="amber" />
        </section>

        <AdminActionBoard
          title="素材原则"
          items={[
            {
              icon: WandSparkles,
              title: '主图统一新中式',
              body: '生肖、节气、吉日场景和工具入口使用同一套卡通风图片，负责情绪和记忆点。',
              cta: '统一画风',
            },
            {
              icon: Palette,
              title: '小图讲语义',
              body: '方位、财神、喜神、冲煞这些图必须能对应字段含义，宁可少一点，也不能错。',
              cta: '先对含义',
            },
            {
              icon: Brush,
              title: '尺寸分策略',
              body: '主视觉、图标、方法图不要共用同一种裁切，避免缺角和头像贴片感。',
              cta: '分开处理',
            },
          ]}
        />

        <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-950 text-amber-100">
              <ImageIcon className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-black text-emerald-950">素材覆盖</h2>
              <p className="text-sm text-stone-600">每组显示代表素材和当前状态。</p>
            </div>
          </div>
        </section>

        <AssetCoverage groups={groups} />
      </div>
    </AdminShell>
  );
}
