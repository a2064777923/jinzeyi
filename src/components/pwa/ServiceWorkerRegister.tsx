'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    function registerServiceWorker() {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // PWA enhancement only. A failed registration should not affect browsing.
      });
    }

    if (document.readyState === 'complete') {
      registerServiceWorker();
      return;
    }

    window.addEventListener('load', registerServiceWorker);
    return () => window.removeEventListener('load', registerServiceWorker);
  }, []);

  return null;
}
