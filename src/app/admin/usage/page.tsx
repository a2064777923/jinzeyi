import { AdminShell } from '@/components/admin/AdminShell';
import { UsageDashboard } from '@/components/admin/UsageDashboard';
import { clampDays, getUsageSummary } from '@/lib/usage/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface Props {
  searchParams: Promise<{ days?: string | string[] }>;
}

export default async function UsageDashboardPage({ searchParams }: Props) {
  const query = await searchParams;
  const days = clampDays(Number(firstValue(query.days) ?? 30));
  const summary = await getUsageSummary(days);

  return (
    <AdminShell>
      <UsageDashboard summary={summary} title="使用情况" deck={`最近 ${summary.days} 天的访问、工具提交和结果摘要。`} />
    </AdminShell>
  );
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
