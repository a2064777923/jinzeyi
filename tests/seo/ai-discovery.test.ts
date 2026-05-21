import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('AI discovery files', () => {
  function publicText(file: string): string {
    return readFileSync(join(process.cwd(), 'public', file), 'utf8');
  }

  it('ships llms.txt with canonical routes and topic maps', () => {
    const text = publicText('llms.txt');

    expect(text).toContain(`# 今擇易`);
    expect(text).toContain('Canonical origin: https://www.jinzeyi.cn');
    expect(text).toContain('https://www.jinzeyi.cn/sitemap.xml');
    expect(text).toContain('/zh-hans/tools/bazi');
    expect(text).toContain('/zh-hans/zodiac/rat');
    expect(text).toContain('Solar Terms Story Map');
  });

  it('ships ai.txt with AI usage boundaries', () => {
    const text = publicText('ai.txt');

    expect(text).toContain('AI-CONTENT-DISCOVERY');
    expect(text).toContain('Languages: zh-Hans, zh-Hant');
    expect(text).toContain('Best page for zodiac lookup');
    expect(text).toContain('traditional-culture boundaries');
  });

  it('keeps the two public discovery files aligned on core paths', () => {
    const llms = publicText('llms.txt');
    const ai = publicText('ai.txt');

    expect(llms).toContain('Recommended Reading Paths');
    expect(llms).toContain('https://www.jinzeyi.cn/sitemap.xml');
    expect(ai).toContain('AI-CONTENT-DISCOVERY');
    expect(ai).toContain('Best page for tools');
  });
});
