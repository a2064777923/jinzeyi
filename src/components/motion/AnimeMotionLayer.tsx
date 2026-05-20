'use client';

import { useEffect } from 'react';

type AnimeRuntime = typeof import('animejs');
type AnimeInstance = ReturnType<AnimeRuntime['animate']>;
type AnimeStagger = AnimeRuntime['stagger'];

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getTargets(scope: HTMLElement): HTMLElement[] {
  const hourTargets = Array.from(scope.querySelectorAll<HTMLElement>('[data-anime-hour-card]'));
  if (hourTargets.length > 0) return hourTargets;

  const resultTargets = Array.from(scope.querySelectorAll<HTMLElement>('[data-anime-result-card]'));
  if (resultTargets.length > 0) return resultTargets;

  const calendarTargets = Array.from(scope.querySelectorAll<HTMLElement>('[data-anime-calendar-cell]'));
  if (calendarTargets.length > 0) return calendarTargets;

  const orbitTargets = Array.from(scope.querySelectorAll<HTMLElement>('[data-anime-orbit-item]'));
  if (orbitTargets.length > 0) return orbitTargets;

  const tileTargets = Array.from(scope.querySelectorAll<HTMLElement>('[data-anime-tile]'));
  if (tileTargets.length > 0) return tileTargets;

  const itemTargets = Array.from(scope.querySelectorAll<HTMLElement>('[data-anime-item]'));
  if (itemTargets.length > 0) return itemTargets;

  const stepTargets = Array.from(scope.querySelectorAll<HTMLElement>('[data-anime-step]'));
  if (stepTargets.length > 0) return stepTargets;

  return [scope];
}

function runEntranceAnimation(
  scope: HTMLElement,
  animate: AnimeRuntime['animate'],
  stagger: AnimeStagger
): AnimeInstance {
  const targets = getTargets(scope);
  const preset = scope.dataset.anime;
  const startDelay = Number(scope.dataset.animeDelay ?? 0);

  for (const target of targets) {
    target.style.willChange = 'transform, opacity, filter';
  }

  if (preset === 'hours') {
    const fills = Array.from(scope.querySelectorAll<HTMLElement>('[data-anime-hour-fill]'));
    for (const fill of fills) {
      fill.style.transformOrigin = 'bottom';
      fill.style.willChange = 'transform';
    }
    animate(fills, {
      scaleY: [0.18, 1],
      duration: 720,
      delay: stagger(42, { start: startDelay + 90 }),
      ease: 'outExpo',
      onComplete: () => {
        for (const fill of fills) {
          fill.style.willChange = '';
        }
      },
    });

    return animate(targets, {
      opacity: [0, 1],
      y: [14, 0],
      scale: [0.98, 1],
      duration: 520,
      delay: stagger(36, { start: startDelay }),
      ease: 'outExpo',
      onComplete: () => {
        for (const target of targets) {
          target.style.willChange = '';
        }
      },
    });
  }

  if (preset === 'calendar') {
    return animate(targets, {
      opacity: [0, 1],
      y: [10, 0],
      scale: [0.96, 1],
      duration: 420,
      delay: stagger(18, { start: startDelay, grid: [7, Math.ceil(targets.length / 7)] }),
      ease: 'outExpo',
      onComplete: () => {
        for (const target of targets) {
          target.style.willChange = '';
        }
      },
    });
  }

  if (preset === 'zodiac-orbit') {
    return animate(targets, {
      opacity: [0, 1],
      scale: [0.72, 1],
      filter: ['blur(5px)', 'blur(0px)'],
      duration: 560,
      delay: stagger(42, { start: startDelay }),
      ease: 'outExpo',
      onComplete: () => {
        for (const target of targets) {
          target.style.willChange = '';
        }
      },
    });
  }

  if (preset === 'tiles') {
    return animate(targets, {
      opacity: [0, 1],
      y: [16, 0],
      scale: [0.985, 1],
      filter: ['blur(5px)', 'blur(0px)'],
      duration: 500,
      delay: stagger(48, { start: startDelay }),
      ease: 'outExpo',
      onComplete: () => {
        for (const target of targets) {
          target.style.willChange = '';
        }
      },
    });
  }

  if (preset === 'result') {
    return animate(targets, {
      opacity: [0, 1],
      y: [18, 0],
      scale: [0.985, 1],
      filter: ['blur(6px)', 'blur(0px)'],
      duration: 560,
      delay: stagger(64, { start: startDelay }),
      ease: 'outExpo',
      onComplete: () => {
        for (const target of targets) {
          target.style.willChange = '';
        }
      },
    });
  }

  if (preset === 'method') {
    return animate(targets, {
      opacity: [0, 1],
      y: [22, 0],
      rotateX: { from: 5 },
      filter: ['blur(7px)', 'blur(0px)'],
      duration: 680,
      delay: stagger(78, { start: startDelay }),
      ease: 'outExpo',
      onComplete: () => {
        for (const target of targets) {
          target.style.willChange = '';
        }
      },
    });
  }

  if (preset === 'hero' || preset === 'home-hero') {
    return animate(targets, {
      opacity: [0, 1],
      y: [30, 0],
      scale: [0.985, 1],
      filter: ['blur(8px)', 'blur(0px)'],
      duration: 820,
      delay: stagger(88, { start: startDelay }),
      ease: 'outExpo',
      onComplete: () => {
        for (const target of targets) {
          target.style.willChange = '';
        }
      },
    });
  }

  return animate(targets, {
    opacity: [0, 1],
    y: [18, 0],
    duration: 560,
    delay: stagger(54, { start: startDelay }),
    ease: 'outExpo',
    onComplete: () => {
      for (const target of targets) {
        target.style.willChange = '';
      }
    },
  });
}

function bindHoverAnimation(
  element: HTMLElement,
  animate: AnimeRuntime['animate']
): () => void {
  let active: AnimeInstance | null = null;

  const enter = () => {
    active?.cancel();
    element.style.willChange = 'transform, filter';
    active = animate(element, {
      y: -4,
      scale: 1.012,
      filter: 'saturate(1.06)',
      duration: 190,
      ease: 'out(3)',
    });
  };

  const leave = () => {
    active?.cancel();
    active = animate(element, {
      y: 0,
      scale: 1,
      filter: 'saturate(1)',
      duration: 230,
      ease: 'out(3)',
      onComplete: () => {
        element.style.willChange = '';
      },
    });
  };

  element.addEventListener('pointerenter', enter);
  element.addEventListener('pointerleave', leave);
  element.addEventListener('focusin', enter);
  element.addEventListener('focusout', leave);

  return () => {
    active?.cancel();
    element.removeEventListener('pointerenter', enter);
    element.removeEventListener('pointerleave', leave);
    element.removeEventListener('focusin', enter);
    element.removeEventListener('focusout', leave);
  };
}

export function AnimeMotionLayer() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(MOTION_QUERY).matches;
    if (reduceMotion) return;

    let mounted = true;
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    const seenScopes = new WeakSet<Element>();
    const seenHoverTargets = new WeakSet<Element>();
    const runningAnimations = new Set<AnimeInstance>();
    const cleanups = new Set<() => void>();

    import('animejs').then(({ animate, stagger }) => {
      if (!mounted) return;

      const registerScope = (scope: HTMLElement) => {
        if (seenScopes.has(scope)) return;
        seenScopes.add(scope);
        observer?.observe(scope);
      };

      const registerHover = (element: HTMLElement) => {
        if (seenHoverTargets.has(element)) return;
        seenHoverTargets.add(element);
        cleanups.add(bindHoverAnimation(element, animate));
      };

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const scope = entry.target as HTMLElement;
            observer?.unobserve(scope);
            const animation = runEntranceAnimation(scope, animate, stagger);
            runningAnimations.add(animation);
            animation.then(() => {
              runningAnimations.delete(animation);
            });
          }
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.14 }
      );

      const scan = (root: ParentNode) => {
        if (root instanceof HTMLElement) {
          if (root.matches('[data-anime]')) registerScope(root);
          if (root.matches('[data-anime-hover]')) registerHover(root);
        }

        root.querySelectorAll?.<HTMLElement>('[data-anime]').forEach(registerScope);
        root.querySelectorAll?.<HTMLElement>('[data-anime-hover]').forEach(registerHover);
      };

      scan(document.body);
      mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) scan(node);
          }
        }
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      mounted = false;
      observer?.disconnect();
      mutationObserver?.disconnect();
      for (const cleanup of cleanups) cleanup();
      for (const animation of runningAnimations) animation.cancel();
      cleanups.clear();
      runningAnimations.clear();
    };
  }, []);

  return null;
}
