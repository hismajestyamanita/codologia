import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  delay?: number;
  threshold?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { delay = 0, threshold = 0.1 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, threshold]);

  return { ref, isVisible };
};

export const useStaggeredAnimation = (
  itemCount: number,
  baseDelay: number = 0,
  staggerDelay: number = 100
) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Показываем элементы с задержкой
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              });
            }, baseDelay + i * staggerDelay);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [itemCount, baseDelay, staggerDelay]);

  return { containerRef, visibleItems };
};