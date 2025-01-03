import { motion, Transition } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface AnimateHeightProps {
  className?: string;
  transition?: Transition;
  containerClassName?: string;
  children: React.ReactNode;
}

export function AnimateHeight({ children, className, containerClassName, transition }: AnimateHeightProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedHeight = entries[0].contentRect.height;
        setHeight(observedHeight);
      });
      resizeObserver.observe(ref.current);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <motion.div
      id="animate-height-container"
      className={className}
      style={{
        height,
        overflow: 'hidden',
      }}
      animate={{
        height,
      }}
      transition={{
        duration: 0.3,
        ...transition,
      }}
    >
      <div id="animate-height-content" className={containerClassName} ref={ref}>
        {children}
      </div>
    </motion.div>
  );
}
