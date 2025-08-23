// src/shared/analytics.ts
type Dict = Record<string, any>;

const ENABLED = import.meta.env.VITE_ENABLE_ANALYTICS === 'true' && !import.meta.env.DEV;

const GA4_ID = (import.meta.env.VITE_GA4_ID || '').trim();
const YM_ID  = Number(import.meta.env.VITE_YM_ID || 0);
const VK_ID  = (import.meta.env.VITE_VK_PIXEL_ID || '').trim();

function loadScript(src: string, attrs: Dict = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    if (document.querySelector(`script[src="${src}"]`)) return resolve();

    const s = document.createElement('script');
    // по умолчанию async, но если attrs.defer === true — не ставим async
    if (attrs && (attrs as any).defer) {
      (s as any).defer = true;
    } else {
      s.async = true;
    }
    s.src = src;
    Object.entries(attrs).forEach(([k, v]) => (s as any)[k] = v);
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function onIdle(fn: () => void) {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(fn, { timeout: 2000 });
  } else {
    setTimeout(fn, 0);
  }
}

/** GA4 */
async function initGA4() {
  if (!GA4_ID) return;
  if (typeof window === 'undefined') return;
  if ((window as any).gtag) return;

  await loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`, { defer: true });
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
  (window as any).gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA4_ID, { send_page_view: true, transport_type: 'beacon' });
}

/** Yandex.Metrika */
async function initYM() {
  if (!YM_ID) return;
  if (typeof window === 'undefined') return;
  if ((window as any).ym) return;

  await loadScript('https://mc.yandex.ru/metrika/tag.js');
  (window as any).ym = (window as any).ym || function() { ((window as any).ym.a = (window as any).ym.a || []).push(arguments); };
  (window as any).ym(YM_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
  });
}

/** VK Pixel */
async function initVK() {
  if (!VK_ID) return;
  if (typeof window === 'undefined') return;
  if ((window as any).VK && (window as any).VK.Retargeting) return;

  await loadScript('https://vk.com/js/api/openapi.js?169');
  try {
    (window as any).VK.Retargeting.Init(VK_ID);
    (window as any).VK.Retargeting.Hit();
  } catch {}
}

export function initAnalytics() {
  if (typeof window === 'undefined' || !ENABLED) return;
  // грузим на простое, чтобы не блокировать рендер
  onIdle(() => {
    initGA4();
    initYM();
    initVK();
  });
}

/** Унифицированное событие для лид-форм */
export function trackEvent(name: string, params: Dict = {}) {
  try {
    if ((window as any).gtag && GA4_ID) (window as any).gtag('event', name, params);
    if ((window as any).ym && YM_ID)    (window as any).ym(YM_ID, 'reachGoal', name, params);
    if ((window as any).VK && (window as any).VK.Retargeting && VK_ID) {
      // В VK можно либо Event(name), либо Hit — используем Event, если доступен
      if ((window as any).VK.Retargeting.Event) (window as any).VK.Retargeting.Event(name);
      else (window as any).VK.Retargeting.Hit();
    }
  } catch {}
}