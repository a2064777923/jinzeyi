import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DocumentLocale } from '@/components/layout/DocumentLocale';
import { AnimeMotionLayer } from '@/components/motion/AnimeMotionLayer';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import { UsageTracker } from '@/components/usage/UsageTracker';
import type { Metadata, Viewport } from 'next';
import { DEFAULT_OG_IMAGE, SITE_KEYWORDS, SITE_NAME, SITE_ORIGIN } from '@/lib/seo';

type Locale = (typeof routing.locales)[number];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: '今日黃曆、月曆、宜忌、時辰吉凶與二十四節氣查詢。',
  keywords: SITE_KEYWORDS,
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'default',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-title': SITE_NAME,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#047857',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function isLocale(locale: string): locale is Locale {
  return routing.locales.some((supportedLocale) => supportedLocale === locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <DocumentLocale locale={locale} />
      <ServiceWorkerRegister />
      <AnimeMotionLayer />
      <UsageTracker locale={locale} />
      <Header />
      <main className="w-full flex-1">
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
