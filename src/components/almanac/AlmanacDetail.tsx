import Image from 'next/image';
import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Heart,
  ShieldAlert,
  SunMedium,
  Target,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { HourlyFortuneTable } from './HourlyFortuneTable';
import { YiJiBadgeList } from './YiJiBadgeList';
import { FortuneMarker } from './FortuneMarker';
import { TermHint } from '@/components/knowledge/TermHint';
import { GlossaryPanel } from '@/components/knowledge/GlossaryPanel';
import { SharePanel } from '@/components/share/SharePanel';
import { PrintSummaryCard } from '@/components/share/PrintSummaryCard';
import { cn } from '@/lib/utils';
import { convertToTraditional } from '@/lib/opencc';
import { getGlossaryEntries, getGlossaryEntry } from '@/lib/content/glossary';
import { getModernHourRange } from '@/lib/almanac/hour-ranges';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/seo';
import type { DailyAlmanac, HourlyFortune } from '@/lib/almanac/types';

interface AlmanacDetailProps {
  almanac: DailyAlmanac;
  hours: HourlyFortune[];
  activeTab: string;
}

function formatToday(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDirectionPosition(direction: string) {
  const normalized = direction.replace(/\s+/g, '');
  const hasEast = normalized.includes('东') || normalized.includes('東');
  const hasWest = normalized.includes('西');
  const hasSouth = normalized.includes('南');
  const hasNorth = normalized.includes('北');

  if (hasEast && hasSouth) return 'right-[7%] bottom-[14%]';
  if (hasEast && hasNorth) return 'right-[7%] top-[14%]';
  if (hasWest && hasSouth) return 'left-[7%] bottom-[14%]';
  if (hasWest && hasNorth) return 'left-[7%] top-[14%]';
  if (hasEast) return 'right-[10%] top-1/2 -translate-y-1/2';
  if (hasWest) return 'left-[10%] top-1/2 -translate-y-1/2';
  if (hasSouth) return 'bottom-[11%] left-1/2 -translate-x-1/2';
  if (hasNorth) return 'left-1/2 top-[11%] -translate-x-1/2';
  return 'right-[12%] top-[12%]';
}

const image2Assets = {
  yi: '/assets/image2/almanac-yi.png',
  ji: '/assets/image2/almanac-ji.png',
  compass: '/assets/image2/direction-compass-cutout.png',
  wealth: '/assets/image2/direction-wealth.png',
  joy: '/assets/image2/direction-joy.png',
  blessing: '/assets/image2/direction-blessing.png',
  conflict: '/assets/image2/direction-conflict.png',
} as const;

export async function AlmanacDetail({ almanac, hours, activeTab }: AlmanacDetailProps) {
  const t = await getTranslations('Detail');
  const locale = await getLocale();
  const localize = (value: string) =>
    locale === 'zh-hant' ? convertToTraditional(value) : value;
  const localeCode = locale as 'zh-hant' | 'zh-hans';
  const todayStr = formatToday();
  const luckyHours = hours.filter((hour) => hour.fortune === '吉').length;
  const isDailyLucky = almanac.fortune === '吉';
  const luckyPercent = Math.round((luckyHours / hours.length) * 100);
  const datePath = `/almanac/${almanac.solar.year}-${String(almanac.solar.month).padStart(2, '0')}-${String(almanac.solar.day).padStart(2, '0')}`;
  const localizedDatePath = `/${locale}${datePath}`;
  const displayDate = t('titleFormat', {
    year: almanac.solar.year,
    month: almanac.solar.month,
    day: almanac.solar.day,
  });
  const glossary = {
    ganZhi: getGlossaryEntry('ganZhi', localeCode),
    chongSha: getGlossaryEntry('chongSha', localeCode),
    zhiShen: getGlossaryEntry('zhiShen', localeCode),
    shenSha: getGlossaryEntry('shenSha', localeCode),
    xingShen: getGlossaryEntry('xingShen', localeCode),
    twelveOfficer: getGlossaryEntry('twelveOfficer', localeCode),
    yiJi: getGlossaryEntry('yiJi', localeCode),
    luckyHour: getGlossaryEntry('luckyHour', localeCode),
  };
  const summaryText = localize(
    `${displayDate}判定为${almanac.fortune}日。宜 ${almanac.yi.slice(0, 6).join('、')}；忌 ${almanac.ji.slice(0, 6).join('、')}。冲${almanac.direction.chong}，煞${almanac.direction.sha}，吉时 ${luckyHours}/12。`
  );

  const overviewStats = [
    {
      label: t('overview.yi'),
      value: `${almanac.yi.length}`,
      Icon: Heart,
      className: 'border-lucky/25 bg-lucky/8 text-lucky',
    },
    {
      label: t('overview.ji'),
      value: `${almanac.ji.length}`,
      Icon: ShieldAlert,
      className: 'border-ominous/25 bg-ominous/8 text-ominous',
    },
    {
      label: t('visual.luckyHours'),
      value: `${luckyHours}/12`,
      Icon: SunMedium,
      className: 'border-accent/25 bg-accent/8 text-accent',
    },
  ] as const;

  return (
    <div className="w-full max-w-[82rem] space-y-7">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/calendar"
          className="inline-flex items-center gap-1 rounded-md text-primary transition duration-200 hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('backToCalendar')}
        </Link>
        <Link
          href={`/almanac/${todayStr}`}
          className="inline-flex items-center gap-1 rounded-md text-primary transition duration-200 hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <Target className="size-4" aria-hidden="true" />
          {t('backToToday')}
        </Link>
      </div>

      <section
        className={cn(
          'relative overflow-hidden rounded-lg border border-border/80 shadow-sm',
          isDailyLucky
            ? 'bg-[radial-gradient(circle_at_16%_12%,rgba(217,119,6,0.18),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(194,65,12,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,247,237,0.82))]'
            : 'bg-[radial-gradient(circle_at_16%_12%,rgba(220,38,38,0.12),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(71,85,105,0.22),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(241,245,249,0.88))]'
        )}
      >
        <div className="almanac-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div className="space-y-6 animate-reveal-up">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <CalendarDays className="size-3" aria-hidden="true" />
                {almanac.solar.year}-{String(almanac.solar.month).padStart(2, '0')}-{String(almanac.solar.day).padStart(2, '0')}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  isDailyLucky
                    ? 'border-lucky/30 bg-lucky/8 text-lucky'
                    : 'border-ominous/35 bg-ominous/10 text-ominous'
                )}
              >
                {t('visual.balance', { percent: luckyPercent })}
              </Badge>
            </div>

            <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
              <FortuneMarker fortune={almanac.fortune} size="lg" />
              <div>
                <h1 className="font-serif-display text-3xl font-semibold tracking-normal text-foreground sm:text-5xl">
                  {displayDate}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {localize(almanac.lunar.lunarDate)} · {t('overview.zodiac')} {localize(almanac.zodiac)} · <TermHint entry={glossary.ganZhi} /> {localize(almanac.ganZhi.day)}
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/78">
                  {localize(
                    almanac.fortune === '吉'
                      ? '今日整體基調偏順，宜事、時辰和沖煞都值得一起核對。'
                      : '今日即使有不少宜事，整體仍按值日與神煞判為凶日；大事宜多留一層審慎，小事可優先挑吉時處理。'
                  )}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {overviewStats.map((stat) => {
                const Icon = stat.Icon;
                return (
                  <div
                    key={stat.label}
                    className={cn(
                      'shimmer-panel rounded-lg border p-4 shadow-sm transition duration-300 hover:-translate-y-0.5',
                      stat.className
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground/72">{stat.label}</p>
                        <p className="mt-2 text-3xl font-semibold text-foreground">{stat.value}</p>
                      </div>
                      <span className="grid size-10 place-items-center rounded-md bg-card/75">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <VisualPanel
                tone="lucky"
                title={t('visual.yiTitle')}
                count={almanac.yi.length}
              >
                <YiJiBadgeList items={almanac.yi} type="yi" density="comfortable" />
              </VisualPanel>
              <VisualPanel
                tone="ominous"
                title={t('visual.jiTitle')}
                count={almanac.ji.length}
              >
                <YiJiBadgeList items={almanac.ji} type="ji" density="comfortable" />
              </VisualPanel>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-rows-[auto_1fr]">
            <div className="grid grid-cols-3 gap-3">
              <IconTile kind="wealth" label={t('directions.caiShen')} value={localize(almanac.direction.caiShen)} />
              <IconTile kind="joy" label={t('directions.xiShen')} value={localize(almanac.direction.xiShen)} />
              <IconTile kind="blessing" label={t('directions.fuShen')} value={localize(almanac.direction.fuShen)} />
            </div>

            <div className="relative min-h-[22rem] overflow-visible rounded-lg border border-border/80 bg-card/88 p-5 shadow-sm">
              <div className="almanac-grid absolute inset-0 opacity-35" aria-hidden="true" />
              <div className="relative">
                <p className="text-sm font-medium text-muted-foreground">{t('visual.directionMap')}</p>
                <h2 className="mt-1 font-serif-display text-2xl font-semibold text-foreground">
                  <TermHint entry={glossary.chongSha} />
                </h2>
              </div>
              <DirectionCompass
                chong={localize(almanac.direction.chong)}
                sha={localize(almanac.direction.sha)}
                caiShen={localize(almanac.direction.caiShen)}
                xiShen={localize(almanac.direction.xiShen)}
                fuShen={localize(almanac.direction.fuShen)}
                localize={localize}
                labels={[
                  t('directions.north'),
                  t('directions.east'),
                  t('directions.south'),
                  t('directions.west'),
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue={activeTab} className="gap-4">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-border bg-card p-1 shadow-sm sm:grid-cols-5">
          <TabsTrigger value="overview" className="h-10">{t('tab.overview')}</TabsTrigger>
          <TabsTrigger value="yiJi" className="h-10">{t('tab.yiJi')}</TabsTrigger>
          <TabsTrigger value="hours" className="h-10">{t('tab.hours')}</TabsTrigger>
          <TabsTrigger value="directions" className="h-10">{t('tab.directions')}</TabsTrigger>
          <TabsTrigger value="deities" className="h-10">{t('tab.deities')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <TabLead
            title={localize('整日基調與細項分開讀')}
            body={localize('黃曆詳情不能把所有欄位平均相加。整日吉凶主要由值日、神煞與日課決定；時辰吉凶則是在當天內切成十二段。這也是「有吉時但整日仍為凶」會同時出現的原因。')}
          />
          <Card className="border-border/80 shadow-sm">
            <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoBlock label={t('overview.lunarDate')} value={localize(almanac.lunar.lunarDate)} note={localize('用農曆歲次標記日期，便於對照傳統節令。')} />
              <InfoBlock
                label={glossary.ganZhi.term}
                value={`${localize(almanac.ganZhi.year)}${t('overview.yearSuffix')} ${localize(almanac.ganZhi.month)}${t('overview.monthSuffix')} ${localize(almanac.ganZhi.day)}${t('overview.daySuffix')}`}
                note={glossary.ganZhi.short}
              />
              <InfoBlock label={t('overview.zodiac')} value={localize(almanac.zodiac)} note={localize('這裡指當年生肖，立春與春節附近出生者可再用八字工具核對。')} />
              <InfoBlock label={t('overview.dayZodiac')} value={localize(almanac.dayZodiac)} note={localize('日生肖用來輔助看當日地支與沖合，不等同於本命生肖。')} />
              <InfoBlock
                label={glossary.chongSha.term}
                value={`${t('directions.chong')}${localize(almanac.direction.chong)} ${t('directions.sha')}${localize(almanac.direction.sha)}`}
                note={glossary.chongSha.short}
              />
            </CardContent>
          </Card>
          <GlossaryPanel
            title={localize('這幾個詞最常用')}
            intro={localize('名詞回到使用場景，才知道該看哪一欄。')}
            entries={getGlossaryEntries(['ganZhi', 'chongSha', 'zhiShen', 'yiJi'], localeCode)}
          />
        </TabsContent>

        <TabsContent value="yiJi" className="space-y-4">
          <TabLead
            title={localize('宜忌要看事情類型和輕重')}
            body={localize('宜忌要對應事情類型。凶日仍可能列出祭祀、出行、交易等宜事，意思是某些事項可參考；婚嫁、搬家、開業這類大事還要核對場景吉日、生肖避沖與時辰。')}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <VisualPanel
              tone="lucky"
              title={t('visual.yiTitle')}
              count={almanac.yi.length}
              large
            >
              <YiJiBadgeList items={almanac.yi} type="yi" density="comfortable" />
            </VisualPanel>
            <VisualPanel
              tone="ominous"
              title={t('visual.jiTitle')}
              count={almanac.ji.length}
              large
            >
              <YiJiBadgeList items={almanac.ji} type="ji" density="comfortable" />
            </VisualPanel>
          </div>
          <KnowledgeSteps
            steps={[
              {
                title: localize('事情要對上'),
                body: localize('把你的安排歸到婚嫁、搬家、開業、出行或修造等類型，核對是否命中宜項。'),
              },
              {
                title: localize('忌項要避開'),
                body: localize('若忌項直接命中你的安排，即使有吉時，也建議換日或改成準備性工作。'),
              },
              {
                title: localize('關鍵動作看時辰'),
                body: localize('同一天內可把簽字、出門、入宅等關鍵動作放到較合適的時辰。'),
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="hours">
          <div className="space-y-4">
            <TabLead
              title={localize('十二時辰看分佈，不取代整日吉凶')}
              body={localize(`今日 ${luckyHours} 個吉時、${hours.length - luckyHours} 個凶時。時辰適合安排具體動作，例如出門、簽字、拜訪；整日基調仍要回到值神、神煞和宜忌判斷。`)}
            />
            <HourlyWheel hours={hours} localize={localize} />
            <HourlyFortuneTable hours={hours} />
            <GlossaryPanel
              title={localize('時辰表怎麼讀')}
              intro={localize('星神名稱容易像暗號，簡短定義更容易建立方向。')}
              entries={getGlossaryEntries(['luckyHour', 'xingShen'], localeCode)}
            />
          </div>
        </TabsContent>

        <TabsContent value="directions" className="space-y-4">
          <TabLead
            title={localize('方位提醒風險，別製造恐慌')}
            body={localize('沖煞方位常用來提醒今天哪個方向或生肖關係要少硬碰。若只是日常小事，不必過度緊張；若涉及搬家、動土、安床、開業，才需要把方位和場景吉日一起核對。')}
          />
          <Card className="border-border/80 shadow-sm">
            <CardContent className="grid gap-4 p-4 lg:grid-cols-[0.9fr_1.1fr]">
              <DirectionCompass
                chong={localize(almanac.direction.chong)}
                sha={localize(almanac.direction.sha)}
                caiShen={localize(almanac.direction.caiShen)}
                xiShen={localize(almanac.direction.xiShen)}
                fuShen={localize(almanac.direction.fuShen)}
                localize={localize}
                labels={[
                  t('directions.north'),
                  t('directions.east'),
                  t('directions.south'),
                  t('directions.west'),
                ]}
                compact
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBlock label={glossary.chongSha.term} value={`${t('directions.chong')}${localize(almanac.direction.chong)} ${t('directions.sha')}${localize(almanac.direction.sha)}`} note={glossary.chongSha.detail} />
                <InfoBlock label={t('directions.caiShen')} value={localize(almanac.direction.caiShen)} note={localize('傳統上用來標示納財、交易時可參考的方位。')} />
                <InfoBlock label={t('directions.xiShen')} value={localize(almanac.direction.xiShen)} note={localize('常見於喜慶、婚嫁、拜訪等場合的方位參考。')} />
                <InfoBlock label={t('directions.fuShen')} value={localize(almanac.direction.fuShen)} note={localize('偏向福德、祈福與穩定感的方位參考。')} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deities" className="space-y-4">
          <TabLead
            title={localize('神煞提供判斷語境，別單字斷吉凶')}
            body={localize('神煞、值神、二十八星宿和彭祖百忌都屬於傳統黃曆語彙。它們用來解釋今天的整體基調，以及某些事項為什麼需要保守。')}
          />
          <Card className="border-border/80 shadow-sm">
            <CardContent className="space-y-4 p-4">
              <InfoBlock label={glossary.shenSha.term} value={almanac.gods.map(localize).join('、')} note={glossary.shenSha.short} />
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoBlock label={t('deities.duty')} value={localize(almanac.duty)} note={glossary.zhiShen.short} />
                <InfoBlock label={t('deities.twentyEightStar')} value={localize(almanac.twentyEightStar)} note={localize('二十八星宿用來補充當日星宿語境，適合當作參考層。')} />
                <InfoBlock label={t('deities.pengZu')} value={localize(almanac.pengZu)} note={localize('彭祖百忌常用一句話提醒當日不宜觸碰的事項。')} />
                <InfoBlock label={t('deities.sound')} value={localize(almanac.sound)} note={localize('納音把干支組合放入五行聲律語境，是傳統分類方法之一。')} />
                <InfoBlock label={t('deities.fetusDay')} value={localize(almanac.fetusDay)} note={localize('胎神多見於家宅、孕產相關避忌，普通日常可作文化參考。')} />
              </div>
            </CardContent>
          </Card>
          <GlossaryPanel
            title={localize('神煞欄位補充說明')}
            intro={localize('這些欄位不要求新手背熟，知道它們在判斷中的位置即可。')}
            entries={getGlossaryEntries(['shenSha', 'zhiShen', 'twelveOfficer'], localeCode)}
          />
        </TabsContent>
      </Tabs>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">{localize('下一步怎麼看')}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <NextStepLink href="/jieri" title={localize('按事情類型選吉日')} body={localize('為結婚、搬家、開業、裝修找日期，可按場景篩候選日。')} />
            <NextStepLink href="/zodiac" title={localize('核對生肖與沖煞')} body={localize('若沖到你的生肖，可到生肖頁理解地支關係。')} />
            <NextStepLink href="/tools/bazi" title={localize('結合出生資料')} body={localize('需要更個人化時，可排四柱和五行，作為後續解讀基礎。')} />
            <NextStepLink href="/calendar" title={localize('回月曆比較前後日期')} body={localize('同一件事通常有多個備選日，月曆適合連續比較。')} />
          </div>
        </div>
        <SharePanel
          title={displayDate}
          text={summaryText}
          url={localizedDatePath}
          copyText={`${SITE_NAME}\n${summaryText}\n${SITE_ORIGIN}${localizedDatePath}`}
          labels={{
            title: localize('分享或保存這日黃曆'),
            copyLink: localize('複製連結'),
            copySummary: localize('複製黃曆摘要'),
            copied: localize('已複製'),
            nativeShare: localize('系統分享'),
          }}
        />
      </section>
      <PrintSummaryCard
        title={displayDate}
        summary={summaryText}
        url={`${SITE_ORIGIN}${localizedDatePath}`}
        brand={SITE_NAME}
      />
    </div>
  );
}

function VisualPanel({
  tone,
  title,
  count,
  large = false,
  children,
}: {
  tone: 'lucky' | 'ominous';
  title: string;
  count: number;
  large?: boolean;
  children: ReactNode;
}) {
  const lucky = tone === 'lucky';
  return (
    <div
      className={cn(
        'relative overflow-visible rounded-lg border p-4 shadow-sm transition duration-300 hover:-translate-y-0.5',
        large && 'min-h-[15rem] p-5',
        lucky
          ? 'border-lucky/28 bg-lucky/8 shadow-lucky/10'
          : 'border-ominous/32 bg-ominous/8 shadow-ominous/10'
      )}
    >
      <div
        className={cn(
          'fortune-pattern fortune-pattern-bleed absolute opacity-70',
          lucky ? 'fortune-pattern-lucky' : 'fortune-pattern-ominous'
        )}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute right-3 top-3 w-16 opacity-95 sm:w-20">
        <Image2Glyph
          src={lucky ? image2Assets.yi : image2Assets.ji}
          alt=""
          sizes="80px"
        />
      </div>
      <div className="relative space-y-4 pr-16 sm:pr-20">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'grid size-11 place-items-center rounded-md border bg-card/75 font-serif-display text-2xl font-bold',
              lucky ? 'border-lucky/30 text-lucky' : 'border-ominous/30 text-ominous'
            )}
          >
            {lucky ? '宜' : '忌'}
          </span>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{count}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function Image2Glyph({
  src,
  alt,
  className,
  sizes = '80px',
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <span
      className={cn(
        'relative block aspect-square w-full overflow-visible rounded-xl border border-border/70 bg-card/90 shadow-sm',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-2"
        sizes={sizes}
      />
    </span>
  );
}

function IconTile({ kind, label, value }: { kind: 'wealth' | 'joy' | 'blessing'; label: string; value: string }) {
  const visual = {
    wealth: {
      src: image2Assets.wealth,
      className: 'border-accent/30 bg-accent/10 text-accent',
    },
    joy: {
      src: image2Assets.joy,
      className: 'border-lucky/30 bg-lucky/10 text-lucky',
    },
    blessing: {
      src: image2Assets.blessing,
      className: 'border-primary/25 bg-primary/10 text-primary',
    },
  }[kind];

  return (
    <div className="relative overflow-hidden rounded-lg border border-border/80 bg-card/88 p-3 text-center shadow-sm">
      <Image2Glyph
        src={visual.src}
        alt={`${label}新中式卡通圖示`}
        className={cn('mx-auto size-12 sm:size-14', visual.className)}
        sizes="56px"
      />
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function InfoBlock({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-background/70 p-4">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-base font-semibold leading-7 text-foreground">{value}</p>
      {note ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p> : null}
    </div>
  );
}

function TabLead({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-4xl text-sm leading-7 text-muted-foreground">{body}</p>
    </section>
  );
}

function KnowledgeSteps({ steps }: { steps: Array<{ title: string; body: string }> }) {
  return (
    <section className="grid gap-3 md:grid-cols-3">
      {steps.map((step, index) => (
        <article key={step.title} className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
            {index + 1}
          </span>
          <h3 className="mt-3 text-sm font-semibold text-foreground">{step.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
        </article>
      ))}
    </section>
  );
}

function NextStepLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="group rounded-md border border-border bg-background/70 p-3 transition hover:border-primary/35 hover:bg-secondary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-semibold text-foreground">{title}</span>
        <ArrowRight className="size-4 shrink-0 text-primary transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
      <span className="mt-1 block text-sm leading-6 text-muted-foreground">{body}</span>
    </Link>
  );
}

function HourlyWheel({ hours, localize }: { hours: HourlyFortune[]; localize: (value: string) => string }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative mx-auto aspect-square w-52 shrink-0 rounded-full border border-border bg-background shadow-inner">
          <div className="absolute inset-[18%] rounded-full border border-border bg-card" />
          <div className="absolute inset-[35%] grid place-items-center rounded-full bg-muted text-center">
            <span className="text-xs font-semibold text-muted-foreground">12</span>
            <span className="text-sm font-semibold text-foreground">時辰</span>
          </div>
          {hours.map((hour, index) => {
            const angle = index * 30;
            return (
              <span
                key={hour.name}
                className={cn(
                  'absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-xs font-semibold shadow-sm',
                  hour.fortune === '吉'
                    ? 'border-lucky/40 bg-lucky text-lucky-foreground'
                    : 'border-ominous/40 bg-background text-ominous'
                )}
                style={{
                  transform: `rotate(${angle}deg) translateY(-5.2rem) rotate(-${angle}deg) translate(-50%, -50%)`,
                }}
                title={`${localize(hour.name)} ${getModernHourRange(hour.name)} ${hour.fortune} ${localize(hour.star)}`}
              >
                {hour.fortune}
              </span>
            );
          })}
        </div>
        <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" data-anime="hours">
          {hours.map((hour) => (
            <div key={hour.name} data-anime-hour-card data-anime-hover className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/70 px-3 py-2 text-sm">
              <span className="min-w-0">
                <span className="font-semibold text-foreground">{localize(hour.name)}</span>
                <span className="ml-2 tabular-nums text-primary">{getModernHourRange(hour.name)}</span>
                <span className="ml-2 text-muted-foreground">{localize(hour.star)}</span>
              </span>
              <span className={hour.fortune === '吉' ? 'font-semibold text-lucky' : 'font-semibold text-ominous'}>
                {hour.fortune}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DirectionCompass({
  chong,
  sha,
  caiShen,
  xiShen,
  fuShen,
  localize,
  labels,
  compact = false,
}: {
  chong: string;
  sha: string;
  caiShen: string;
  xiShen: string;
  fuShen: string;
  localize: (value: string) => string;
  labels: string[];
  compact?: boolean;
}) {
  const markerItems = [
    {
      kind: 'wealth' as const,
      label: '财',
      value: caiShen,
      title: `${localize('财神')} ${caiShen}`,
      className: getDirectionPosition(caiShen),
      note: localize('交易、纳财可参考'),
    },
    {
      kind: 'joy' as const,
      label: '喜',
      value: xiShen,
      title: `${localize('喜神')} ${xiShen}`,
      className: getDirectionPosition(xiShen),
      note: localize('喜庆、拜访可参考'),
    },
    {
      kind: 'blessing' as const,
      label: '福',
      value: fuShen,
      title: `${localize('福神')} ${fuShen}`,
      className: getDirectionPosition(fuShen),
      note: localize('祈福、稳定可参考'),
    },
    {
      kind: 'conflict' as const,
      label: '煞',
      value: sha,
      title: localize(`冲${chong} · 煞${sha}`),
      className: getDirectionPosition(sha),
      note: localize(`冲${chong}，大事少硬碰`),
    },
  ];

  return (
    <div
      className={cn(
        'grid gap-4',
        compact ? 'lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-center' : 'lg:grid-cols-1'
      )}
    >
      <div
        className={cn(
          'direction-compass relative mx-auto aspect-square w-full max-w-[21rem] overflow-visible',
          compact && 'max-w-[18rem]'
        )}
      >
        <div className="direction-compass__halo absolute inset-[5%] rounded-full border border-primary/15 bg-[conic-gradient(from_35deg,rgba(4,120,87,0.14),rgba(217,119,6,0.18),rgba(220,38,38,0.1),rgba(4,120,87,0.14))]" />
        <div className="absolute inset-[10%] overflow-visible rounded-full bg-[#fff4df]">
          <Image
            src={image2Assets.compass}
            alt="新中式卡通方位羅盤圖"
            fill
            className="object-contain p-4 drop-shadow-[0_18px_28px_rgba(20,37,31,0.16)]"
            sizes={compact ? '288px' : '336px'}
          />
        </div>
        <div className="absolute inset-[35%] grid place-items-center rounded-full border border-accent/25 bg-background/82 text-center shadow-sm">
          <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
            方位
          </span>
          <span className="text-xs font-semibold text-foreground">
            {sha}
          </span>
        </div>

        {labels.map((label, index) => (
          <span
            key={label}
            className={cn(
              'absolute z-20 grid size-8 place-items-center rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground shadow-sm',
              index === 0 && 'left-1/2 top-0 -translate-x-1/2',
              index === 1 && 'right-0 top-1/2 -translate-y-1/2',
              index === 2 && 'bottom-0 left-1/2 -translate-x-1/2',
              index === 3 && 'left-0 top-1/2 -translate-y-1/2'
            )}
          >
            {label}
          </span>
        ))}

        {markerItems.map((item) => (
          <DirectionMarker
            key={`${item.kind}-${item.value}`}
            kind={item.kind}
            label={item.label}
            value={item.value}
            title={item.title}
            className={item.className}
          />
        ))}
      </div>

      <div className="grid gap-2 text-sm">
        {markerItems.map((item) => (
          <div key={`note-${item.kind}`} className="flex items-center gap-3 rounded-xl border border-border bg-background/75 p-3">
        <span className={cn('grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold text-white', markerToneClassName[item.kind])}>
              {item.label}
            </span>
          <span className="min-w-0">
              <span className="font-semibold text-foreground">{item.title}</span>
              <span className="ml-0 block text-muted-foreground sm:ml-2 sm:inline">{item.note}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const markerToneClassName = {
  wealth: 'bg-accent',
  joy: 'bg-lucky',
  blessing: 'bg-primary',
  conflict: 'bg-ominous',
} as const;

function DirectionMarker({
  kind,
  label,
  value,
  title,
  className,
}: {
  kind: 'wealth' | 'joy' | 'blessing' | 'conflict';
  label: string;
  value: string;
  title?: string;
  className?: string;
}) {
  const visual = {
    wealth: {
      src: image2Assets.wealth,
      className: 'border-accent/45 bg-accent text-accent-foreground shadow-accent/20',
    },
    joy: {
      src: image2Assets.joy,
      className: 'border-lucky/45 bg-lucky text-lucky-foreground shadow-lucky/20',
    },
    blessing: {
      src: image2Assets.blessing,
      className: 'border-primary/45 bg-primary text-primary-foreground shadow-primary/20',
    },
    conflict: {
      src: image2Assets.conflict,
      className: 'border-ominous/45 bg-ominous text-white shadow-ominous/20',
    },
  }[kind];

  return (
    <div
      className={cn(
        'direction-compass__marker absolute z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-lg sm:px-3 sm:text-xs',
        visual.className,
        className
      )}
      title={title ?? `${label}：${value}`}
    >
      <span className="relative block size-5 overflow-visible rounded-full bg-white/85">
        <Image
          src={visual.src}
          alt=""
          fill
          className="object-contain"
          sizes="20px"
        />
      </span>
      <span>{label} {value}</span>
    </div>
  );
}
