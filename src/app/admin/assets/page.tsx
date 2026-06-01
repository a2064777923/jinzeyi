import { AdminShell } from '@/components/admin/AdminShell';
import { ModulePlaceholder } from '../shared';

export default function AdminAssetsPage() {
  return (
    <AdminShell>
      <ModulePlaceholder
        kicker="Assets"
        title="图片素材"
        body="管理主视觉、节气配图、生肖素材和页面使用位置。"
        items={['素材分类和预览', '缺图页面提醒', '主视觉和图标替换记录']}
      />
    </AdminShell>
  );
}
