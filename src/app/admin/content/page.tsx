import { AdminShell } from '@/components/admin/AdminShell';
import { ModulePlaceholder } from '../shared';

export default function AdminContentPage() {
  return (
    <AdminShell>
      <ModulePlaceholder
        kicker="Publishing"
        title="文章发布"
        body="管理草稿、选题、搜索标题、节气故事、生肖文章和发布记录。"
        items={['热门工具带出的选题', '节气和生肖内容排期', '文章发布后的访问回看']}
      />
    </AdminShell>
  );
}
