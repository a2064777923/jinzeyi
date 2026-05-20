import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '今擇易',
    short_name: '今擇易',
    description: '今日黃曆、月曆、宜忌、時辰吉凶與二十四節氣查詢。',
    start_url: '/zh-hant',
    scope: '/',
    display: 'standalone',
    background_color: '#F4FAF6',
    theme_color: '#047857',
    lang: 'zh-Hant',
    categories: ['lifestyle', 'education', 'utilities'],
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: '今日黃曆',
        short_name: '今日',
        url: '/zh-hant',
        icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: '月曆',
        short_name: '月曆',
        url: '/zh-hant/calendar',
        icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
  };
}
