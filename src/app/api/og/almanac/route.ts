import { type NextRequest } from 'next/server';
import { SITE_NAME } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function read(searchParams: URLSearchParams, key: string, fallback = ''): string {
  return escapeXml(searchParams.get(key) || fallback);
}

function readCount(searchParams: URLSearchParams, key: string): string {
  const value = Number(searchParams.get(key));
  return Number.isFinite(value) && value >= 0 ? String(value) : '0';
}

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = read(searchParams, 'date', '今日');
  const fortune = read(searchParams, 'fortune', '吉');
  const yiCount = readCount(searchParams, 'yi');
  const jiCount = readCount(searchParams, 'ji');
  const chong = read(searchParams, 'chong', '-');
  const sha = read(searchParams, 'sha', '-');
  const yiText = read(searchParams, 'yiText', '今日宜事');
  const jiText = read(searchParams, 'jiText', '今日忌事');
  const isBadDay = fortune === '凶' || fortune === '兇';
  const sealColor = isBadDay ? '#b42318' : '#047857';
  const sealBg = isBadDay ? '#fff1f0' : '#ecfdf5';
  const heading = isBadDay ? '今日宜慎行' : '今日宜推進';
  const note = isBadDay
    ? '凶日仍可看宜事與吉時，大事先避忌項與沖煞。'
    : '吉日也要核對忌項、生肖沖煞與具體時辰。';

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${date} 黃曆分享圖">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffaf0" />
      <stop offset="0.55" stop-color="#f5fbf7" />
      <stop offset="1" stop-color="#eef7f1" />
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#d8c9a6" stroke-width="1" opacity="0.32" />
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#paper)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" />
  <rect x="58" y="58" width="1084" height="514" rx="34" fill="#fffdf7" stroke="#d8b56d" stroke-width="2" />
  <circle cx="994" cy="148" r="88" fill="${sealBg}" stroke="${sealColor}" stroke-width="9" />
  <text x="994" y="178" text-anchor="middle" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="82" font-weight="800" fill="${sealColor}">${fortune}</text>
  <text x="96" y="126" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="34" font-weight="700" fill="#8a5a16">${SITE_NAME}</text>
  <text x="96" y="204" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="74" font-weight="800" fill="#17231d">${date} 黃曆</text>
  <text x="96" y="266" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="34" font-weight="700" fill="${sealColor}">${heading}</text>
  <g transform="translate(96 326)">
    <rect width="214" height="132" rx="22" fill="#eefaf3" stroke="#b7dfc8" />
    <text x="32" y="48" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="28" font-weight="700" fill="#047857">宜</text>
    <text x="32" y="104" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="58" font-weight="800" fill="#064e3b">${yiCount}</text>
    <rect x="242" width="214" height="132" rx="22" fill="#fff1f0" stroke="#f2b8b5" />
    <text x="274" y="48" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="28" font-weight="700" fill="#b42318">忌</text>
    <text x="274" y="104" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="58" font-weight="800" fill="#7a271a">${jiCount}</text>
    <rect x="484" width="312" height="132" rx="22" fill="#f9f1dc" stroke="#e5c06e" />
    <text x="516" y="48" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="28" font-weight="700" fill="#8a5a16">沖煞</text>
    <text x="516" y="101" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="44" font-weight="800" fill="#3f2f16">沖${chong} · 煞${sha}</text>
  </g>
  <text x="96" y="512" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="25" fill="#47564e">宜：${yiText}</text>
  <text x="96" y="550" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="25" fill="#7a3b32">忌：${jiText}</text>
  <text x="760" y="550" font-family="Noto Sans CJK TC, Noto Sans CJK SC, PingFang TC, Microsoft JhengHei, sans-serif" font-size="24" font-weight="700" fill="#59645f">${note}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
