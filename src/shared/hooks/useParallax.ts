import { RefObject, useEffect } from 'react';

type T = { el: RefObject<HTMLElement>, speed: number, base?: number };

export function useParallax(targets: T[], container?: RefObject<HTMLElement>) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (prefersReduced || isMobile) return; // без параллакса на мобиле/при reduce-motion

    let raf = 0;
    const run = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const top = container?.current?.getBoundingClientRect().top ?? 0;

        targets.forEach(({ el, speed, base = 0 }) => {
          const node = el.current as HTMLElement | null;
          if (!node) return;

          // Сохраняем поворот из data-rotate (иначе inline transform его перетрёт)
          const rotate = node.dataset.rotate || '';
          const y = top * speed + base;
          node.style.transform = `translate3d(0, ${y}px, 0) ${rotate}`;
          node.style.willChange = 'transform';
        });

        raf = 0;
      });
    };

    const onScroll = () => run();
    const onResize = () => run();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    run();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targets.map(t => t.el.current).join('|'), container?.current]);
}