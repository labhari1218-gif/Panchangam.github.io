type Payload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, payload: Payload = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer?.push({ event: name, ...payload });

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  }
}
