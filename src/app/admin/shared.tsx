export function ModulePlaceholder({
  kicker,
  title,
  body,
  items,
}: {
  kicker: string;
  title: string;
  body: string;
  items: string[];
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">{kicker}</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">{body}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <div key={item} className="rounded-2xl border border-emerald-900/10 bg-stone-50 p-5">
            <span className="flex size-8 items-center justify-center rounded-full bg-emerald-900 text-sm font-black text-amber-50">{index + 1}</span>
            <p className="mt-4 text-sm font-semibold leading-6 text-stone-800">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
