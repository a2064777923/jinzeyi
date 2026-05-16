import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Noto_Sans_SC, Noto_Sans_TC } from 'next/font/google';
import '@/styles/globals.css';

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();
  const fontClass = locale === 'zh-hant' ? notoSansTC : notoSansSC;

  return (
    <html lang={locale} className={fontClass.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <main className="flex-1 mx-auto max-w-[65ch] w-full px-4 py-8">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
