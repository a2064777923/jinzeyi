import type { UsageSummary, UsageTopItem } from '@/lib/usage/summary';
import { jieriScenes } from '@/lib/content/jieri-scenes';
import { CHINA_CITIES } from '@/lib/tools/china-cities';

export function UsageDashboard({ summary, title, deck }: { summary: UsageSummary; title: string; deck: string }) {
  return (
    <div className="grid gap-6">
      <header className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-[#fffaf0] p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Usage</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-emerald-950 md:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{deck}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[7, 30, 90].map((days) => (
              <a key={days} href={`/admin/usage?days=${days}`} className="rounded-full border border-emerald-900/10 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-700 hover:bg-emerald-50">
                {days} 天
              </a>
            ))}
          </div>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-5">
        <Metric label="事件总数" value={summary.totalEvents} />
        <Metric label="页面访问" value={summary.pageViews} />
        <Metric label="工具提交" value={summary.toolSubmits} />
        <Metric label="工具错误" value={summary.toolErrors} tone={summary.toolErrors > 0 ? 'warn' : 'default'} />
        <Metric label="匿名访客" value={summary.uniqueVisitors ?? '-'} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <RankCard title="入口热度" items={summary.topPaths} empty="暂无页面访问" />
        <RankCard title="功能热度" items={summary.byArea} empty="暂无事件" />
        <RankCard title="语言分布" items={summary.byLocale} empty="暂无语言数据" />
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <RankCard title="择日事项" items={summary.topScenes} empty="暂无择日提交" />
        <RankCard title="八字年份" items={summary.topBaziBirthYears} empty="暂无八字提交" />
        <RankCard title="城市热度" items={summary.topCities} empty="暂无城市数据" />
        <RankCard title="黄历日期" items={summary.topAlmanacDates} empty="暂无日期查询" />
      </section>

      <RecentEvents summary={summary} />
    </div>
  );
}

function Metric({ label, value, tone = 'default' }: { label: string; value: number | string; tone?: 'default' | 'warn' }) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-xs">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className={tone === 'warn' ? 'mt-2 text-3xl font-bold text-red-700' : 'mt-2 text-3xl font-black text-emerald-950'}>
        {value}
      </p>
    </div>
  );
}

function RankCard({ title, items, empty }: { title: string; items: UsageTopItem[]; empty: string }) {
  return (
    <section className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-xs">
      <h2 className="text-base font-bold text-emerald-950">{title}</h2>
      {items.length > 0 ? (
        <ol className="mt-4 grid gap-2">
          {items.map((item) => (
            <li key={item.key} className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-3 py-2 text-sm">
              <span className="min-w-0 truncate font-medium text-stone-800" title={item.key}>{item.key}</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800">{item.count}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-sm text-stone-500">{empty}</p>
      )}
    </section>
  );
}

function RecentEvents({ summary }: { summary: UsageSummary }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-xs">
      <div className="border-b border-emerald-900/10 p-4">
        <h2 className="text-base font-bold text-emerald-950">最近工具事件</h2>
      </div>
      {summary.latestToolEvents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-[0.12em] text-stone-500">
              <tr>
                <th className="px-4 py-3">时间</th>
                <th className="px-4 py-3">工具</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">输入</th>
                <th className="px-4 py-3">结果</th>
              </tr>
            </thead>
            <tbody>
              {summary.latestToolEvents.map((event, index) => {
                const item = describeUsageEvent(event);
                return (
                  <tr key={`${event.createdAt}-${index}`} className="border-t border-emerald-900/10 align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-stone-500">{formatDate(event.createdAt)}</td>
                    <td className="px-4 py-4 font-bold text-emerald-950">{item.tool}</td>
                    <td className="px-4 py-4">
                      <span className={item.statusTone === 'bad' ? 'rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-700' : 'rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800'}>
                        {item.status}
                      </span>
                    </td>
                    <td className="max-w-[22rem] px-4 py-4 text-sm leading-6 text-stone-700">{item.input}</td>
                    <td className="max-w-[24rem] px-4 py-4 text-sm leading-6 text-stone-700">{item.output}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-4 text-sm text-stone-500">暂无工具事件。</p>
      )}
    </section>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'short',
    timeStyle: 'medium',
    hour12: false,
  }).format(new Date(value));
}

function describeUsageEvent(event: UsageSummary['latestToolEvents'][number]) {
  const payload = asRecord(event.payload);
  const result = asRecord(event.result);

  if (event.area === 'bazi') {
    const pillars = asRecord(result?.pillars);
    return {
      tool: '八字排盘',
      status: statusLabel(event.status),
      statusTone: statusTone(event.status),
      input: [
        readText(payload?.birthDate),
        readText(payload?.birthTime),
        cityName(readText(payload?.cityId)),
        genderName(readText(payload?.gender)),
      ].filter(Boolean).join(' · '),
      output: [
        `四柱 ${[pillars?.year, pillars?.month, pillars?.day, pillars?.hour].filter(Boolean).join(' / ') || '-'}`,
        result?.dayMaster ? `日主 ${result.dayMaster}${readText(result.dayMasterElement) ?? ''}` : undefined,
        result?.strongestElement ? `${result.strongestElement}较明显` : undefined,
        result?.weakestElement ? `${result.weakestElement}偏少` : undefined,
      ].filter(Boolean).join(' · '),
    };
  }

  if (event.area === 'jieri-recommend') {
    const topDates = Array.isArray(result?.topDates) ? result.topDates : [];
    return {
      tool: '推荐日期',
      status: statusLabel(event.status),
      statusTone: statusTone(event.status),
      input: [
        sceneName(readText(payload?.scene)),
        `${readText(payload?.startDate) ?? '-'} 至 ${readText(payload?.endDate) ?? '-'}`,
        `${readNumber(payload?.peopleCount) ?? 0} 位参与者`,
      ].join(' · '),
      output: topDates.length > 0
        ? topDates.map((date) => describeRecommendedDate(date)).filter(Boolean).join('；')
        : readText(result?.reason) ?? '暂无候选日期',
    };
  }

  if (event.area === 'naming') {
    return {
      tool: '姓名五行',
      status: statusLabel(event.status),
      statusTone: statusTone(event.status),
      input: [
        `姓 ${readNumber(payload?.surnameLength) ?? 0} 字`,
        `名 ${readNumber(payload?.givenNameLength) ?? 0} 字`,
      ].join(' · '),
      output: result?.score
        ? `评分 ${result.score} · 收录 ${readNumber(result.knownCharacters) ?? 0} 字 · 建议 ${readNumber(result.suggestionCount) ?? 0} 个`
        : readText(result?.reason) ?? '暂无结果',
    };
  }

  if (event.eventName === 'almanac_search') {
    return {
      tool: '黄历日期',
      status: statusLabel(event.status),
      statusTone: statusTone(event.status),
      input: readText(payload?.date) ?? '-',
      output: '已进入日期详情',
    };
  }

  return {
    tool: event.area,
    status: statusLabel(event.status),
    statusTone: statusTone(event.status),
    input: '已记录',
    output: '已记录',
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function readText(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function cityName(cityId: string | undefined): string | undefined {
  if (!cityId) return undefined;
  const city = CHINA_CITIES.find((item) => item.id === cityId);
  return city ? `${city.province} · ${city.name}` : cityId;
}

function sceneName(scene: string | undefined): string | undefined {
  if (!scene) return undefined;
  return jieriScenes.find((item) => item.slug === scene)?.name ?? scene;
}

function genderName(gender: string | undefined): string | undefined {
  if (gender === 'female') return '女';
  if (gender === 'male') return '男';
  if (gender === 'unspecified') return '未指定';
  return undefined;
}

function statusLabel(status: string | null): string {
  if (status === 'success') return '成功';
  if (status === 'error') return '错误';
  return '已记录';
}

function statusTone(status: string | null): 'good' | 'bad' {
  return status === 'error' ? 'bad' : 'good';
}

function describeRecommendedDate(value: unknown): string | undefined {
  const date = asRecord(value);
  if (!date) return undefined;
  return `${readText(date.date) ?? '-'} ${readNumber(date.score) ?? '-'}分`;
}
