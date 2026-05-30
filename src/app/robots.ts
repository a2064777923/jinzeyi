import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        crawlDelay: 10,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        crawlDelay: 10,
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'bingbot',
        allow: '/',
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
      },
    ],
    sitemap: [`${SITE_ORIGIN}/sitemap.xml`],
    host: SITE_ORIGIN,
  };
}
