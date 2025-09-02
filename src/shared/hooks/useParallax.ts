import { RefObject, useEffect } from 'react';

type T = { el: RefObject<HTMLElement>; speed: number; base?: number };

export function useParallax(targets: T[], container?: RefObject<HTMLElement>) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Enable parallax on all viewports; only disable for reduced motion
    if (prefersReduced) return;

    let raf = 0;
    const run = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const top = container?.current?.getBoundingClientRect().top ?? 0;

        targets.forEach(({ el, speed, base = 0 }) => {
          const node = el.current as HTMLElement | null;
          if (!node) return;

          const rotate = (node as HTMLElement).dataset?.rotate || '';
          const y = top * speed + base;
          node.style.transform = `translate3d(0, ${y}px, 0) ${rotate}`;
          node.style.willChange = 'transform';
        });

        raf = 0;
      });
    };

    const onScroll = () => run();
    const onResize = () => run();

    window.addEventListener('scroll', onScroll, { passive: true } as AddEventListenerOptions);
    window.addEventListener('resize', onResize);
    run();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targets.map((t) => t.el.current).join('|'), container?.current]);
}

