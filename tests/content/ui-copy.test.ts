import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const visibleCopySources = [
  'src/lib/content/tools.ts',
  'src/lib/content/registry.ts',
  'src/lib/content/jieri-scenes.ts',
  'src/lib/content/metaphysics.ts',
  'src/lib/content/feng-shui.ts',
  'src/lib/content/zodiac.ts',
  'src/lib/content/glossary.ts',
  'src/components/almanac/AlmanacDetail.tsx',
  'src/components/layout/NotFoundContent.tsx',
  'src/components/tools/BaziForm.tsx',
  'src/components/tools/NamingForm.tsx',
  'src/components/jieri/JieriFilterPanel.tsx',
  'src/components/zodiac/ZodiacIndex.tsx',
  'src/components/almanac/SolarTermsExplorer.tsx',
  'src/components/almanac/SolarTermsList.tsx',
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/calendar/page.tsx',
  'src/app/[locale]/solar-terms/page.tsx',
  'src/app/[locale]/tools/page.tsx',
  'src/app/[locale]/jieri/[scene]/[year]/page.tsx',
  'src/app/[locale]/not-found.tsx',
  'src/i18n/messages/zh-hans.json',
  'src/i18n/messages/zh-hant.json',
];

const productDocCopyPattern =
  /页面会|頁面會|工具会|工具會|会把|會把|首屏|此功能|功能用于|功能用於|工具用于|工具用於|用户|用戶|查看|先看|先把|先选|先選|再看|再把|点击后将|點擊後將|请查看|請查看|目标事项|目標事項|交互流程|互動流程|流程安排|法律流程/;

const bannedStylePattern =
  /一句话|一句話|口播|先说人话|先說人話|不是[^。！？\n]{0,40}而是|不是[^。！？\n]{0,40}而係/;

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('visible UI copy wording', () => {
  it('keeps product-doc phrasing out of visible content sources', () => {
    const offenders = visibleCopySources.flatMap((path) => {
      const matches = source(path)
        .split('\n')
        .map((line, index) => ({ line, lineNumber: index + 1 }))
        .filter(({ line }) => productDocCopyPattern.test(line));

      return matches.map(({ line, lineNumber }) => `${path}:${lineNumber}: ${line.trim()}`);
    });

    expect(offenders).toEqual([]);
  });

  it('keeps banned template phrases out of visible content sources', () => {
    const offenders = visibleCopySources.flatMap((path) => {
      const matches = source(path)
        .split('\n')
        .map((line, index) => ({ line, lineNumber: index + 1 }))
        .filter(({ line }) => bannedStylePattern.test(line));

      return matches.map(({ line, lineNumber }) => `${path}:${lineNumber}: ${line.trim()}`);
    });

    expect(offenders).toEqual([]);
  });
});
