import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

const baziResultSource = source('src/components/tools/BaziResult.tsx');
const baziSummarySource = source('src/components/tools/BaziSummary.tsx');
const professionalChartSource = source('src/components/tools/BaziProfessionalChart.tsx');
const elementPanelSource = source('src/components/tools/BaziElementStrengthPanel.tsx');
const baziPageSource = source('src/app/[locale]/tools/bazi/page.tsx');
const toolsContentSource = source('src/lib/content/tools.ts');

describe('professional BaZi UI source contracts', () => {
  it('renders summary before professional chart and consumes professional data', () => {
    expect(baziSummarySource).toContain('export function BaziSummary');
    expect(baziSummarySource).toContain('dayMaster');
    expect(baziSummarySource).toContain('strongest');
    expect(baziSummarySource).toContain('weakest');
    expect(baziResultSource).toContain('professional');
    expect(baziResultSource.indexOf('<BaziSummary')).toBeLessThan(
      baziResultSource.indexOf('<BaziProfessionalChart'),
    );
  });

  it('renders professional pillars with term hints and required fields', () => {
    expect(professionalChartSource).toContain('export function BaziProfessionalChart');
    expect(professionalChartSource).toContain('TermHint');
    expect(professionalChartSource).toContain('hiddenStems');
    expect(professionalChartSource).toContain('naYin');
    expect(professionalChartSource).toContain('tenGod');
    expect(professionalChartSource).toContain('grid-cols-2');
    expect(professionalChartSource).toContain('xl:grid-cols-4');
  });

  it('shows element strength as visible, hidden, and combined signals', () => {
    expect(elementPanelSource).toContain('export function BaziElementStrengthPanel');
    expect(elementPanelSource).toContain('visibleCounts');
    expect(elementPanelSource).toContain('hiddenStemWeightedCounts');
    expect(elementPanelSource).toContain('combinedScores');
    expect(elementPanelSource).toContain('strongest');
    expect(elementPanelSource).toContain('weakest');
  });

  it('updates BaZi page copy and knowledge links', () => {
    expect(baziPageSource).toContain('GlossaryPanel');
    expect(baziPageSource).toContain('dayMaster');
    expect(toolsContentSource).toContain('日主');
    expect(toolsContentSource).toContain('/knowledge/day-master');
    expect(toolsContentSource).toContain('/knowledge/ten-gods');
    expect(toolsContentSource).toContain('/knowledge/five-elements');
  });

  it('avoids deterministic and deferred-control copy in shipped BaZi UI', () => {
    const combined = [
      baziResultSource,
      baziSummarySource,
      professionalChartSource,
      elementPanelSource,
      baziPageSource,
      toolsContentSource,
    ].join('\n');

    expect(combined).not.toMatch(/必定|一定|保证|保證/);
    expect(combined).not.toMatch(/大运|大運|流年|神煞/);
  });
});
