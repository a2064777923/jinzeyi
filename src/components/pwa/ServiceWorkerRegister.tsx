'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .then(() => caches?.keys?.())
        .then((keys) => Promise.all((keys ?? []).map((key) => caches.delete(key))))
        .catch(() => {
          // Development cleanup only. Ignore browsers that restrict cache access.
        });
      return;
    }

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
