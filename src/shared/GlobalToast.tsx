import React, { useEffect, useState } from 'react';

type Toast = { text: string, id: number };

export default function GlobalToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { text: string };
      const id = Date.now();
      setToasts(prev => [...prev, { id, text: detail.text }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
    };
    window.addEventListener('app:toast', handler as EventListener);
    return () => window.removeEventListener('app:toast', handler as EventListener);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[min(92vw,900px)] space-y-2">
      {toasts.map(t => (
        <div key={t.id}
          className="w-full rounded-full bg-[#D8F7C6] text-[#0F4D0F] border border-[#B6EE97] px-6 py-3 shadow-xl">
          <div className="font-medium">Спасибо! Мы свяжемся с вами в течение рабочего дня.</div>
          {t.text && <div className="text-sm opacity-80 mt-1">{t.text}</div>}
        </div>
      ))}
    </div>
  );
}

export function dispatchToast(text = '') {
  window.dispatchEvent(new CustomEvent('app:toast', { detail: { text } }));
}
