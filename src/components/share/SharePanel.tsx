'use client';

import { createPortal } from 'react-dom';
import { useEffect, useId, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  MessageCircle,
  Send,
  Share2,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SITE_ORIGIN } from '@/lib/seo';
import type { LocaleCode } from '@/lib/content/types';

interface SharePanelProps {
  title: string;
  text: string;
  url: string;
  copyText?: string;
  labels?: {
    title?: string;
    copyLink?: string;
    copySummary?: string;
    copied?: string;
    nativeShare?: string;
  };
  className?: string;
  locale?: LocaleCode;
}

type ShareLabels = {
  title: string;
  copyLink: string;
  copySummary: string;
  copied: string;
  nativeShare: string;
  openDrawer: string;
  drawerTitle: string;
  drawerDeck: string;
  close: string;
  quickActions: string;
  directShare: string;
  platformCopy: string;
  copyAndOpen: string;
  copiedAndOpen: string;
  opensComposer: string;
  manualPaste: string;
};

type DirectShareTarget = {
  label: string;
  href: string;
  icon: LucideIcon;
  note: string;
};

type AssistedShareTarget = {
  key: string;
  label: string;
  content: string;
  icon: LucideIcon;
  note: string;
  appHref?: string;
  webHref: string;
};

const defaultLabels = {
  'zh-hans': {
    title: '分享这页',
    copyLink: '复制链接',
    copySummary: '复制摘要',
    copied: '已复制',
    nativeShare: '系统分享',
    openDrawer: '打开分享抽屉',
    drawerTitle: '分享方式',
    drawerDeck: '先选能直接跳转的平台；不支持网页发布的平台，会复制适配文案并打开对应 App 或网页。',
    close: '关闭',
    quickActions: '常用操作',
    directShare: '可直接跳转',
    platformCopy: '平台格式文案',
    copyAndOpen: '复制并打开',
    copiedAndOpen: '已复制，正在打开',
    opensComposer: '打开发布页',
    manualPaste: '打开后粘贴发布',
  },
  'zh-hant': {
    title: '分享這頁',
    copyLink: '複製連結',
    copySummary: '複製摘要',
    copied: '已複製',
    nativeShare: '系統分享',
    openDrawer: '打開分享抽屜',
    drawerTitle: '分享方式',
    drawerDeck: '先選能直接跳轉的平台；不支援網頁發佈的平台，會複製適配文案並打開對應 App 或網頁。',
    close: '關閉',
    quickActions: '常用操作',
    directShare: '可直接跳轉',
    platformCopy: '平台格式文案',
    copyAndOpen: '複製並打開',
    copiedAndOpen: '已複製，正在打開',
    opensComposer: '打開發佈頁',
    manualPaste: '打開後貼上發佈',
  },
} as const satisfies Record<LocaleCode, ShareLabels>;

function encode(value: string): string {
  return encodeURIComponent(value);
}

function inferLocale(url: string, locale?: LocaleCode): LocaleCode {
  if (locale) return locale;
  return url.includes('/zh-hans') ? 'zh-hans' : 'zh-hant';
}

function compactText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function getTags(locale: LocaleCode): string {
  return locale === 'zh-hant'
    ? '#今擇易 #黃曆 #擇日 #國學'
    : '#今择易 #黄历 #择日 #国学';
}

function buildPlatformCopy({
  locale,
  title,
  text,
  absoluteUrl,
  summary,
}: {
  locale: LocaleCode;
  title: string;
  text: string;
  absoluteUrl: string;
  summary: string;
}) {
  const tags = getTags(locale);
  const shortText = compactText(text);

  return {
    wechat: `${title}\n${shortText}\n${absoluteUrl}`,
    moments: `${title}\n${shortText}\n${absoluteUrl}\n${tags}`,
    xiaohongshu: `${title}\n\n${shortText}\n\n使用方式：先看整日基调，再核对宜忌、时辰和冲煞。\n\n查看完整内容：${absoluteUrl}\n\n${tags}`,
    douyin: `${title}\n${shortText}\n完整查看：${absoluteUrl}\n${tags}`,
    instagram: `${title}\n\n${shortText}\n\nRead more: ${absoluteUrl}\n\n#JinZeYi #ChineseAlmanac #Culture`,
    summary,
  };
}

function isMobileUserAgent(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function SharePanel({ title, text, url, copyText, labels, className, locale }: SharePanelProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted] = useState(() => typeof window !== 'undefined');
  const titleId = useId();
  const localeKey = inferLocale(url, locale);
  const t = { ...defaultLabels[localeKey], ...labels };
  const absoluteUrl = /^https?:\/\//.test(url)
    ? url
    : `${SITE_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
  const summary = copyText ?? `${title}\n${text}\n${absoluteUrl}`;
  const platformCopy = buildPlatformCopy({
    locale: localeKey,
    title,
    text,
    absoluteUrl,
    summary,
  });

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function copy(value: string, key: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copy(absoluteUrl, 'link');
      return;
    }

    try {
      await navigator.share({ title, text, url: absoluteUrl });
    } catch {
      // Users can cancel the native sheet. Keep the custom drawer open.
    }
  }

  async function copyAndOpen(target: AssistedShareTarget) {
    await copy(target.content, target.key);
    const href = isMobileUserAgent() && target.appHref ? target.appHref : target.webHref;
    window.open(href, '_blank', 'noopener,noreferrer');
  }

  const directTargets: DirectShareTarget[] = [
    {
      label: 'QQ',
      href: `https://connect.qq.com/widget/shareqq/index.html?url=${encode(absoluteUrl)}&title=${encode(title)}&summary=${encode(text)}`,
      icon: MessageCircle,
      note: t.opensComposer,
    },
    {
      label: 'LINE',
      href: `https://social-plugins.line.me/lineit/share?url=${encode(absoluteUrl)}`,
      icon: MessageCircle,
      note: t.opensComposer,
    },
    {
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encode(`${title} ${absoluteUrl}`)}`,
      icon: Send,
      note: t.opensComposer,
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encode(absoluteUrl)}&text=${encode(title)}`,
      icon: Send,
      note: t.opensComposer,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encode(absoluteUrl)}`,
      icon: Share2,
      note: t.opensComposer,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encode(`${title}\n${compactText(text)}`)}&url=${encode(absoluteUrl)}`,
      icon: Share2,
      note: t.opensComposer,
    },
  ];

  const assistedTargets: AssistedShareTarget[] = [
    {
      key: 'wechat',
      label: '微信',
      content: platformCopy.wechat,
      icon: MessageCircle,
      note: t.manualPaste,
      appHref: 'weixin://',
      webHref: 'https://weixin.qq.com/',
    },
    {
      key: 'moments',
      label: localeKey === 'zh-hant' ? '朋友圈' : '朋友圈',
      content: platformCopy.moments,
      icon: MessageCircle,
      note: t.manualPaste,
      appHref: 'weixin://dl/moments',
      webHref: 'https://weixin.qq.com/',
    },
    {
      key: 'xiaohongshu',
      label: localeKey === 'zh-hant' ? '小紅書' : '小红书',
      content: platformCopy.xiaohongshu,
      icon: Copy,
      note: t.manualPaste,
      webHref: 'https://www.xiaohongshu.com/',
    },
    {
      key: 'douyin',
      label: '抖音',
      content: platformCopy.douyin,
      icon: Copy,
      note: t.manualPaste,
      webHref: 'https://www.douyin.com/',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      content: platformCopy.instagram,
      icon: Copy,
      note: t.manualPaste,
      webHref: 'https://www.instagram.com/',
    },
  ];

  return (
    <section className={cn('rounded-lg border border-border bg-card p-4 shadow-sm print:hidden', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{text}</p>
        </div>
        <div className="flex flex-wrap gap-2" aria-live="polite">
          <Button type="button" onClick={() => setOpen(true)}>
            <Share2 data-icon="inline-start" />
            {t.openDrawer}
          </Button>
          <Button type="button" variant="secondary" onClick={() => void copy(absoluteUrl, 'link')}>
            {copied === 'link' ? <Check data-icon="inline-start" /> : <LinkIcon data-icon="inline-start" />}
            {copied === 'link' ? t.copied : t.copyLink}
          </Button>
        </div>
      </div>

      {mounted && open ? createPortal(
        <div className="fixed inset-0 z-[60] print:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-foreground/28 backdrop-blur-[2px]"
            aria-label={t.close}
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[1.5rem] border border-border bg-card p-4 shadow-2xl shadow-foreground/20 sm:bottom-4 sm:left-auto sm:right-4 sm:top-4 sm:w-[29rem] sm:rounded-[1.5rem] sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-foreground">{t.drawerTitle}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{t.drawerDeck}</p>
              </div>
              <Button type="button" variant="outline" size="icon-sm" onClick={() => setOpen(false)} aria-label={t.close}>
                <X />
              </Button>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background/78 p-3">
              <p className="text-xs font-semibold tracking-[0.16em] text-accent">{t.quickActions}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Button type="button" onClick={() => void nativeShare()}>
                  <Share2 data-icon="inline-start" />
                  {t.nativeShare}
                </Button>
                <Button type="button" variant="secondary" onClick={() => void copy(summary, 'summary')}>
                  {copied === 'summary' ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
                  {copied === 'summary' ? t.copied : t.copySummary}
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-foreground">{t.directShare}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {directTargets.map((target) => {
                  const Icon = target.icon;
                  return (
                    <a
                      key={target.label}
                      href={target.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: 'outline' }), 'h-auto justify-start whitespace-normal py-2')}
                    >
                      <Icon data-icon="inline-start" />
                      <span className="min-w-0 text-left">
                        <span className="block">{target.label}</span>
                        <span className="block text-xs font-normal text-muted-foreground">{target.note}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-foreground">{t.platformCopy}</p>
              <div className="mt-2 grid gap-2">
                {assistedTargets.map((target) => {
                  const Icon = copied === target.key ? Check : target.icon;
                  return (
                    <button
                      key={target.key}
                      type="button"
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/78 p-3 text-left transition hover:border-primary/35 hover:bg-secondary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => void copyAndOpen(target)}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-foreground">{target.label}</span>
                          <span className="block text-xs leading-5 text-muted-foreground">
                            {copied === target.key ? t.copiedAndOpen : target.note}
                          </span>
                        </span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                        {t.copyAndOpen}
                        <ExternalLink className="size-3" aria-hidden="true" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </section>
  );
}
