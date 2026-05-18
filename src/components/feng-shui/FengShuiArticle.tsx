import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArticleLayout } from '@/components/seo/ArticleLayout';
import { fengShuiCategories, type FengShuiArticle as FengShuiArticleContent } from '@/lib/content/feng-shui';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';
import { ChecklistBlock } from './ChecklistBlock';

export function FengShuiArticle({ article, locale }: { article: FengShuiArticleContent; locale: LocaleCode }) {
  const seo = localizeSeo(locale, article.seo);
  const category = fengShuiCategories.find((item) => item.slug === article.categorySlug);

  return (
    <ArticleLayout
      title={seo.h1}
      deck={seo.deck}
      faq={article.faq}
      relatedLinks={article.relatedLinks}
      locale={locale}
      shareUrl={`/${locale}${article.path}`}
      shareLabel={localizeBodyCopy(locale, '分享这篇风水文章')}
      rail={
        <div className="flex flex-col gap-4">
          {category && (
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <span className="relative size-11 rounded-lg border border-border bg-background p-2">
                  <Image
                    src={category.icon}
                    alt={localizeBodyCopy(locale, `${category.name}風水圖示`)}
                    fill
                    className="object-contain p-2"
                    sizes="44px"
                  />
                </span>
                <div>
                  <p className="font-semibold">{localizeBodyCopy(locale, category.name)}</p>
                  <p className="text-sm text-muted-foreground">{localizeBodyCopy(locale, '风水文章')}</p>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-lg border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-semibold text-foreground">{localizeBodyCopy(locale, '资料参考')}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {article.sourceNotes.map((note) => (
                <Badge key={note} variant="outline">{localizeBodyCopy(locale, note)}</Badge>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ChecklistBlock items={article.checklist} locale={locale} />
      {article.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold leading-snug">{localizeBodyCopy(locale, section.heading)}</h2>
          <p>{localizeBodyCopy(locale, section.body)}</p>
        </section>
      ))}
    </ArticleLayout>
  );
}
