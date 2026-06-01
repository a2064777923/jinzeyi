import { AdminShell } from '@/components/admin/AdminShell';
import { ModulePlaceholder } from '../shared';

export default function AdminAiPage() {
  return (
    <AdminShell>
      <ModulePlaceholder
        kicker="AI"
        title="AI 解读"
        body="管理模型配置、解读请求、人工精选答案和质量回看。"
        items={['按工具结果触发解读', '记录模型、耗时和反馈', '沉淀可复用的回答模板']}
      />
    </AdminShell>
  );
}
