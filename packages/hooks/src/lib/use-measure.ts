import { useEffect, useRef, useState } from 'react';

interface MeasureElement {
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const [measure, setMeasure] = useState<MeasureElement>({ width: 0, height: 0, top: 0, left: 0, bottom: 0, right: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const fn = () => setMeasure(element.getBoundingClientRect());
    const observer = new ResizeObserver(fn);
    observer.observe(element);
    fn();

    return () => observer.disconnect();
  }, [ref]);

  return [ref, measure] as const;
}
