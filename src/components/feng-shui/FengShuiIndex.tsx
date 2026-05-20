import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { Image2HeroScene, Image2IconTile, Image2MethodDiagram } from '@/components/visual/Image2Showcase';
import { Link } from '@/i18n/navigation';
import { fengShuiCategories, fengShuiIndexPage, getFengShuiArticlesByCategory } from '@/lib/content/feng-shui';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';

const fengShuiMethodSteps = [
  {
    label: 'ENTRY',
    title: '先看入口',
    body: '玄关、门口和动线先决定气口是否顺，别急着堆摆件。',
    iconSrc: '/assets/image2/feng-shui/home.png',
  },
  {
    label: 'REST',
    title: '再看坐卧',
    body: '床、桌、沙发看背靠、视线、门窗和夜间动线。',
    iconSrc: '/assets/image2/feng-shui/office.png',
  },
  {
    label: 'FLOW',
    title: '检查动线',
    body: '通道、收纳、采光和潮湿，是最容易实际改善的位置。',
    iconSrc: '/assets/image2/feng-shui/shop.png',
  },
  {
    label: 'DIRECTION',
    title: '最后看方位',
    body: '方位和财位放在现实空间之后读，避免把问题玄学化。',
    iconSrc: '/assets/image2/feng-shui/directions.png',
  },
] as const;

export function FengShuiIndex({ locale }: { locale: LocaleCode }) {
  const seo = localizeSeo(locale, fengShuiIndexPage.seo);

  return (
    <SeoPageShell>
      <SeoPageBand>
        <SeoHero
          title={seo.h1}
          deck={seo.deck}
          kicker={localizeBodyCopy(locale, '空间清单 · 吉日入口')}
          imageSrc="/assets/image2/pages/feng-shui-showcase.png"
          imageAlt={localizeBodyCopy(locale, '新中式卡通风水空间插画')}
          badges={fengShuiCategories.map((category) => localizeBodyCopy(locale, category.name))}
          shareUrl={`/${locale}/feng-shui`}
          shareLabel={localizeBodyCopy(locale, '分享風水知識')}
          shareMode="compact"
          controls={
            <Image2HeroScene
              src="/assets/image2/pages/feng-shui-showcase.png"
              alt={localizeBodyCopy(locale, '新中式卡通室内风水罗盘插画')}
              caption={localizeBodyCopy(locale, '空间与方位')}
              priority
            />
          }
        />
      </SeoPageBand>

      <SeoPageBand tone="plain" className="pt-0">
        <Image2MethodDiagram
          title={localizeBodyCopy(locale, '空间检查顺序')}
          deck={localizeBodyCopy(locale, '先把能看见、能移动、能清理的位置做顺，再把方位和择日放进来核对。')}
          steps={fengShuiMethodSteps.map((step) => ({
            ...step,
            title: localizeBodyCopy(locale, step.title),
            body: localizeBodyCopy(locale, step.body),
            iconAlt: localizeBodyCopy(locale, `${step.title}风水图示`),
          }))}
          className="mb-5"
        />
        <div className="grid gap-5" data-anime="tiles">
          {fengShuiCategories.map((category) => {
            const articles = getFengShuiArticlesByCategory(category.slug);
            return (
              <section key={category.slug} id={category.slug} data-anime-tile data-anime-hover className="image2-art-card overflow-hidden rounded-xl border border-border bg-card p-4">
                <div className="grid gap-4 sm:grid-cols-[5rem_minmax(0,1fr)]">
                  <Image2IconTile
                    src={category.icon}
                    alt={localizeBodyCopy(locale, `${category.name}風水圖示`)}
                    className="size-20"
                    sizes="80px"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{localizeBodyCopy(locale, category.name)}</h2>
                      <Badge variant="secondary">{articles.length}</Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{localizeBodyCopy(locale, category.summary)}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {articles.map((article) => {
                    const articleSeo = localizeSeo(locale, article.seo);
                    return (
                      <Link
                        key={article.path}
                        href={article.path}
                        className="group flex min-w-0 items-start justify-between gap-3 rounded-md border border-border bg-background p-3 transition hover:border-primary/40 hover:bg-secondary/70"
                      >
                        <span className="min-w-0">
                          <span className="block font-semibold">{articleSeo.h1}</span>
                          <span className="mt-1 line-clamp-2 block text-sm leading-6 text-muted-foreground">{articleSeo.deck}</span>
                        </span>
                        <ArrowRight className="mt-1 size-4 shrink-0 text-primary transition group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </SeoPageBand>

      <SeoPageBand tone="muted">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <p className="rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            {localizeBodyCopy(locale, fengShuiIndexPage.body)}
          </p>
          <div className="flex flex-col gap-4">
            <FaqBlock items={fengShuiIndexPage.faq} locale={locale} />
            <InternalLinkGrid links={fengShuiIndexPage.relatedLinks} locale={locale} />
          </div>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
