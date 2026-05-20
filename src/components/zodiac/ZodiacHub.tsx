import { Badge } from '@/components/ui/badge';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { Image2MethodDiagram } from '@/components/visual/Image2Showcase';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';
import type { ZodiacArticle, ZodiacProfile } from '@/lib/content/zodiac';
import { ZodiacCompatibility } from './ZodiacCompatibility';
import { ZodiacYearTable } from './ZodiacYearTable';
import { Link } from '@/i18n/navigation';
import { ZodiacAnimalImage } from './ZodiacAnimalImage';

interface ZodiacHubProps {
  locale: LocaleCode;
  profile: ZodiacProfile;
  articles: ZodiacArticle[];
}

export function ZodiacHub({ locale, profile, articles }: ZodiacHubProps) {
  const seo = localizeSeo(locale, profile.seo);

  return (
    <SeoPageShell>
      <SeoPageBand>
        <SeoHero
          title={seo.h1}
          deck={seo.deck}
          icon={
            <ZodiacAnimalImage
              slug={profile.slug}
              label={localizeBodyCopy(locale, `属${profile.animal}生肖新中式卡通图示`)}
              className="size-16 rounded-xl shadow-sm"
              imageClassName="p-0"
              sizes="64px"
              priority
            />
          }
          kicker={localizeBodyCopy(locale, `${profile.earthlyBranch} · ${profile.elementHint}`)}
          badges={profile.traits.map((trait) => localizeBodyCopy(locale, trait))}
          shareUrl={`/${locale}${profile.path}`}
          shareLabel={localizeBodyCopy(locale, '分享生肖頁')}
          shareMode="compact"
          controls={
            <div className="rounded-[1.25rem] border border-border bg-background/82 p-4 shadow-sm">
              <div className="mx-auto grid size-40 place-items-center rounded-full border border-primary/15 bg-[#fff2d8] shadow-sm">
                <ZodiacAnimalImage
                  slug={profile.slug}
                  label={localizeBodyCopy(locale, `属${profile.animal}生肖新中式卡通图示`)}
                  className="size-36 rounded-full border-0 shadow-none"
                  imageClassName="p-0"
                  sizes="144px"
                  priority
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <span className="rounded-lg border border-border bg-card p-2">
                  <span className="block text-muted-foreground">{localizeBodyCopy(locale, '地支')}</span>
                  <span className="mt-1 block font-semibold text-foreground">{profile.earthlyBranch}</span>
                </span>
                <span className="rounded-lg border border-border bg-card p-2">
                  <span className="block text-muted-foreground">{localizeBodyCopy(locale, '五行')}</span>
                  <span className="mt-1 block font-semibold text-foreground">{localizeBodyCopy(locale, profile.elementHint)}</span>
                </span>
                <span className="rounded-lg border border-border bg-card p-2">
                  <span className="block text-muted-foreground">{localizeBodyCopy(locale, '避冲')}</span>
                  <span className="mt-1 block font-semibold text-ominous">{localizeBodyCopy(locale, profile.compatibility.caution[0])}</span>
                </span>
              </div>
            </div>
          }
        />
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-5">
            <Image2MethodDiagram
              title={localizeBodyCopy(locale, `属${profile.animal}怎么放进择日`)}
              deck={localizeBodyCopy(locale, '生肖详情页先解决年份边界，再解释地支关系，最后把合冲放回吉日筛选。')}
              steps={[
                {
                  label: 'YEAR',
                  title: localizeBodyCopy(locale, '年份边界'),
                  body: localizeBodyCopy(locale, `常见${profile.animal}年包括 ${profile.years.slice(-4).join('、')}，春节和立春附近要核对岁次。`),
                },
                {
                  label: 'BRANCH',
                  title: localizeBodyCopy(locale, '地支五行'),
                  body: localizeBodyCopy(locale, `属${profile.animal}对应${profile.earthlyBranch}支，五行提示为${profile.elementHint}。`),
                },
                {
                  label: 'MATCH',
                  title: localizeBodyCopy(locale, '合冲关系'),
                  body: localizeBodyCopy(locale, `较合可看${profile.compatibility.best.join('、')}，相冲先留意${profile.compatibility.caution.join('、')}。`),
                },
                {
                  label: 'DATE',
                  title: localizeBodyCopy(locale, '择日避冲'),
                  body: localizeBodyCopy(locale, `婚嫁、入宅、开业等大事，优先避开明显冲${profile.animal}的候选日。`),
                },
              ]}
            />
            <section className="grid gap-4 rounded-lg border border-border bg-card p-5 md:grid-cols-[8rem_minmax(0,1fr)]">
              <div className="mx-auto grid size-32 place-items-center rounded-2xl border border-primary/15 bg-primary/6">
                <ZodiacAnimalImage
                  slug={profile.slug}
                  label={localizeBodyCopy(locale, `属${profile.animal}生肖新中式卡通图示`)}
                  className="size-28 shadow-sm"
                  imageClassName="p-0"
                  sizes="112px"
                  priority
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{localizeBodyCopy(locale, '性格与使用提示')}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{localizeBodyCopy(locale, profile.body)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.suitableActions.map((item) => (
                    <Badge key={item} variant="outline" className="border-lucky/30 bg-lucky/8 text-lucky">
                      {localizeBodyCopy(locale, item)}
                    </Badge>
                  ))}
                </div>
              </div>
            </section>
            <section className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-3">
              <VisualFact
                label={localizeBodyCopy(locale, '年份速读')}
                value={profile.years.slice(-3).join(' / ')}
                body={localizeBodyCopy(locale, '这些是常见公历年份，边界日仍要回到农历岁次。')}
              />
              <VisualFact
                label={localizeBodyCopy(locale, '适合关注')}
                value={profile.suitableActions.slice(0, 2).map((item) => localizeBodyCopy(locale, item)).join(' / ')}
                body={localizeBodyCopy(locale, '适合项只说明节奏，不代表单独决定日期。')}
              />
              <VisualFact
                label={localizeBodyCopy(locale, '谨慎避开')}
                value={profile.unsuitableActions.slice(-1).map((item) => localizeBodyCopy(locale, item)).join('')}
                body={localizeBodyCopy(locale, '先避开明显相冲，再回到黄历详情核对。')}
              />
            </section>
            <ZodiacYearTable years={profile.years} animal={profile.animal} locale={locale} />
            <ZodiacCompatibility compatibility={profile.compatibility} locale={locale} />
            <section className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-base font-semibold">{localizeBodyCopy(locale, '相关文章')}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {articles.map((article) => {
                  const articleSeo = localizeSeo(locale, article.seo);
                  return (
                    <Link key={article.slug} href={article.path} className="rounded-md border border-border bg-background p-3 transition hover:bg-secondary/70">
                      <span className="block font-semibold">{articleSeo.h1}</span>
                      <span className="mt-1 line-clamp-2 block text-sm leading-6 text-muted-foreground">{articleSeo.deck}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
            <FaqBlock items={profile.faq} locale={locale} />
            <InternalLinkGrid links={profile.relatedLinks} locale={locale} />
          </aside>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}

function VisualFact({ label, value, body }: { label: string; value: string; body: string }) {
  return (
    <article className="rounded-2xl border border-border bg-background/75 p-4">
      <p className="text-xs font-semibold tracking-[0.18em] text-accent">{label}</p>
      <p className="mt-2 text-lg font-semibold leading-7 text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </article>
  );
}
