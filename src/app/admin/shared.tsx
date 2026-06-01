import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import type { AdminOpportunity, AssetGroup, ContentInventoryItem } from '@/lib/admin/operations';

const toneClass = {
  jade: 'border-emerald-900/12 bg-emerald-50 text-emerald-950',
  amber: 'border-amber-900/14 bg-amber-50 text-amber-950',
  ink: 'border-stone-900/10 bg-stone-100 text-stone-950',
  rose: 'border-rose-900/12 bg-rose-50 text-rose-950',
};

export function AdminHero({
  eyebrow,
  title,
  deck,
  actions,
}: {
  eyebrow: string;
  title: string;
  deck: string;
  actions?: Array<{ href: string; label: string }>;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-emerald-900/10 bg-emerald-950 p-6 text-amber-50 shadow-2xl shadow-emerald-950/18 md:p-8">
      <div className="absolute -right-16 -top-20 size-56 rounded-full bg-amber-300/18 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/2 h-36 w-96 -translate-x-1/2 rounded-full bg-emerald-300/12 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-200/80">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/78">{deck}</p>
        </div>
        {actions && actions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <Link key={action.href} href={action.href} className="rounded-full border border-amber-100/20 bg-white/8 px-4 py-2 text-sm font-bold text-amber-50 transition hover:bg-white/14">
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function AdminMetric({
  label,
  value,
  note,
  tone = 'jade',
}: {
  label: string;
  value: number | string;
  note?: string;
  tone?: keyof typeof toneClass;
}) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${toneClass[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-65">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-tight">{value}</p>
      {note ? <p className="mt-2 text-xs font-medium leading-5 opacity-70">{note}</p> : null}
    </div>
  );
}

export function OpportunityGrid({ title, deck, items }: { title: string; deck: string; items: AdminOpportunity[] }) {
  return (
    <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black text-emerald-800">{title}</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">{deck}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Link key={`${item.title}-${item.href}`} href={item.href} className={`group rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/8 ${toneClass[item.tone]}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black">{item.label}</span>
              <span className="text-xs font-bold opacity-65">{item.signal}</span>
            </div>
            <h3 className="mt-4 text-lg font-black leading-6">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 opacity-75">{item.body}</p>
            <p className="mt-5 text-sm font-black text-emerald-800 group-hover:text-emerald-600">进入</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function InventoryStrip({ items }: { items: ContentInventoryItem[] }) {
  return (
    <section className="rounded-[2rem] border border-emerald-900/10 bg-[#fffaf0] p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black text-emerald-800">内容地图</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">核心入口、工具、生肖、风水和知识页的覆盖情况。</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <div key={item.family} className="rounded-3xl border border-emerald-900/10 bg-white p-4">
            <p className="text-sm font-black text-emerald-950">{item.label}</p>
            <p className="mt-3 text-3xl font-black text-stone-950">{item.count}</p>
            <p className="mt-2 text-xs leading-5 text-stone-500">{item.articleCount} 篇文章 · {item.webAppCount} 个工具入口</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdminActionBoard({
  title,
  items,
}: {
  title: string;
  items: Array<{ icon: LucideIcon; title: string; body: string; href?: string; cta?: string }>;
}) {
  return (
    <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-xl font-black tracking-tight text-emerald-950">{title}</h2>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          const body = (
            <>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-950 text-amber-100">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-black text-emerald-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.body}</p>
              {item.cta ? <p className="mt-4 text-sm font-black text-emerald-800">{item.cta}</p> : null}
            </>
          );

          return item.href ? (
            <Link key={item.title} href={item.href} className="rounded-3xl border border-emerald-900/10 bg-stone-50 p-5 transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-lg">
              {body}
            </Link>
          ) : (
            <div key={item.title} className="rounded-3xl border border-emerald-900/10 bg-stone-50 p-5">
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function AssetCoverage({ groups }: { groups: AssetGroup[] }) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {groups.map((group) => (
        <article key={group.key} className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-emerald-900/10 p-5">
            <div>
              <h2 className="text-xl font-black text-emerald-950">{group.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{group.body}</p>
            </div>
            <div className={group.missing > 0 ? 'rounded-2xl bg-amber-50 px-3 py-2 text-right text-amber-900' : 'rounded-2xl bg-emerald-50 px-3 py-2 text-right text-emerald-900'}>
              <p className="text-xs font-bold opacity-70">完成</p>
              <p className="text-lg font-black">{group.ready}/{group.total}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 p-5">
            {group.samples.map((asset) => (
              <div key={asset.src} className="rounded-2xl border border-emerald-900/10 bg-stone-50 p-2">
                <div className="rounded-xl bg-[linear-gradient(45deg,rgba(4,120,87,0.08)_25%,transparent_25%,transparent_75%,rgba(4,120,87,0.08)_75%),linear-gradient(45deg,rgba(4,120,87,0.08)_25%,transparent_25%,transparent_75%,rgba(4,120,87,0.08)_75%)] bg-[length:18px_18px] bg-[position:0_0,9px_9px] p-1">
                  <Image src={asset.src} alt={asset.alt} width={128} height={128} className="aspect-square w-full rounded-lg object-contain drop-shadow-sm" sizes="(min-width: 1024px) 6rem, 22vw" />
                </div>
                <p className={asset.ok ? 'mt-2 truncate text-xs font-bold text-emerald-800' : 'mt-2 truncate text-xs font-bold text-red-700'}>
                  {asset.ok ? '已就绪' : '待补图'}
                </p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
