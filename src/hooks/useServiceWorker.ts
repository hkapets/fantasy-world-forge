import { useEffect, useState } from 'react';

interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  error?: string;
}

export function useServiceWorker(): ServiceWorkerStatus {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
  });

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported in this browser');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          '/service-worker.js',
          { scope: '/' }
        );

        console.log('[App] Service Worker registered:', registration);
        setStatus((prev) => ({ ...prev, isRegistered: true }));

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                console.log('[App] New Service Worker available');
                setStatus((prev) => ({ ...prev, updateAvailable: true }));

                const message = newWorker.postMessage({
                  type: 'SKIP_WAITING',
                });
              }
            });
          }
        });

        setInterval(async () => {
          try {
            await registration.update();
          } catch (error) {
            console.error('[App] Failed to check for updates:', error);
          }
        }, 60000);
      } catch (error) {
        console.error('[App] Failed to register Service Worker:', error);
        setStatus((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    const handleOnline = () => {
      console.log('[App] Application is online');
      setStatus((prev) => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      console.log('[App] Application is offline');
      setStatus((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    registerServiceWorker();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}

export const OfflineManager = {
  isOnline(): boolean {
    return navigator.onLine;
  },

  async clearCache(): Promise<void> {
    if ('serviceWorker' in navigator && 'controller' in navigator.serviceWorker) {
      navigator.serviceWorker.controller?.postMessage({
        type: 'CLEAR_CACHE',
      });

      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => caches.delete(name))
      );
    }
  },

  async getCacheStats(): Promise<{
    cacheCount: number;
    totalSize: number;
  }> {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return {
      cacheCount: cacheNames.length,
      totalSize,
    };
  },

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },
};
