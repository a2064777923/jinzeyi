'use client';

import { useState } from 'react';
import { Check, Copy, Link as LinkIcon, MessageCircle, Send, Share2 } from 'lucide-react';
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

const defaultLabels = {
  'zh-hans': {
    title: '分享这页',
    copyLink: '复制链接',
    copySummary: '复制摘要',
    copied: '已复制',
    nativeShare: '系统分享',
  },
  'zh-hant': {
    title: '分享這頁',
    copyLink: '複製連結',
    copySummary: '複製摘要',
    copied: '已複製',
    nativeShare: '系統分享',
  },
} as const;

const copyTargetLabels = {
  'zh-hans': {
    wechat: '微信',
    moments: '朋友圈',
    xiaohongshu: '小红书',
    douyin: '抖音',
    duoshan: '多闪',
    instagram: 'Instagram',
    copyTo: '复制内容以分享到',
    shareTo: '分享到',
  },
  'zh-hant': {
    wechat: '微信',
    moments: '朋友圈',
    xiaohongshu: '小紅書',
    douyin: '抖音',
    duoshan: '多閃',
    instagram: 'Instagram',
    copyTo: '複製內容以分享到',
    shareTo: '分享到',
  },
} as const;

function encode(value: string): string {
  return encodeURIComponent(value);
}

function inferLocale(url: string, locale?: LocaleCode): LocaleCode {
  if (locale) return locale;
  return url.includes('/zh-hans') ? 'zh-hans' : 'zh-hant';
}

export function SharePanel({ title, text, url, copyText, labels, className, locale }: SharePanelProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const localeKey = inferLocale(url, locale);
  const t = { ...defaultLabels[localeKey], ...labels };
  const shareCopy = copyTargetLabels[localeKey];
  const absoluteUrl = /^https?:\/\//.test(url)
    ? url
    : `${SITE_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;

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

    await navigator.share({ title, text, url: absoluteUrl });
  }

  const summary = copyText ?? `${title}\n${text}\n${absoluteUrl}`;
  const linkTargets = [
    {
      label: 'QQ',
      href: `https://connect.qq.com/widget/shareqq/index.html?url=${encode(absoluteUrl)}&title=${encode(title)}&summary=${encode(text)}`,
      icon: MessageCircle,
    },
    {
      label: 'LINE',
      href: `https://social-plugins.line.me/lineit/share?url=${encode(absoluteUrl)}`,
      icon: MessageCircle,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encode(absoluteUrl)}`,
      icon: Share2,
    },
    {
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encode(`${title} ${absoluteUrl}`)}`,
      icon: Send,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encode(title)}&url=${encode(absoluteUrl)}`,
      icon: Share2,
    },
  ] as const;
  const copyTargets = [
    { label: shareCopy.wechat, key: 'wechat', icon: MessageCircle },
    { label: shareCopy.moments, key: 'moments', icon: MessageCircle },
    { label: shareCopy.xiaohongshu, key: 'xiaohongshu', icon: Copy },
    { label: shareCopy.douyin, key: 'douyin', icon: Copy },
    { label: shareCopy.duoshan, key: 'duoshan', icon: Copy },
    { label: shareCopy.instagram, key: 'instagram', icon: Copy },
  ] as const;

  return (
    <section className={cn('rounded-lg border border-border bg-card p-4 shadow-sm print:hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
        </div>
        <Button type="button" variant="outline" onClick={nativeShare}>
          <Share2 data-icon="inline-start" />
          {t.nativeShare}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" aria-live="polite">
        <Button type="button" variant="secondary" onClick={() => copy(absoluteUrl, 'link')}>
          {copied === 'link' ? <Check data-icon="inline-start" /> : <LinkIcon data-icon="inline-start" />}
          {copied === 'link' ? t.copied : t.copyLink}
        </Button>
        <Button type="button" variant="secondary" onClick={() => copy(summary, 'summary')}>
          {copied === 'summary' ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {copied === 'summary' ? t.copied : t.copySummary}
        </Button>
        {copyTargets.map((target) => {
          const Icon = copied === target.key ? Check : target.icon;
          return (
            <Button
              key={target.key}
              type="button"
              variant="outline"
              onClick={() => copy(summary, target.key)}
              aria-label={`${shareCopy.copyTo} ${target.label}`}
            >
              <Icon data-icon="inline-start" />
              {copied === target.key ? t.copied : target.label}
            </Button>
          );
        })}
        {linkTargets.map((target) => {
          const Icon = target.icon;
          return (
            <a
              key={target.label}
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline' }))}
              aria-label={`${shareCopy.shareTo} ${target.label}`}
            >
              <Icon data-icon="inline-start" />
              {target.label}
            </a>
          );
        })}
      </div>
    </section>
  );
}
