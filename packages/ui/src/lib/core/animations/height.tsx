import { motion, Transition } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { theme } from '../../theme';

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
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const observedHeight = entries[0].contentRect.height;
      setHeight(observedHeight);
    });
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <motion.div animate={{ height }} className={className} style={style.container} transition={Object.assign(settings, transition)}>
      <div className={containerClassName} ref={ref}>
        {children}
      </div>
    </motion.div>
  );
}

const settings: Transition = {
  type: 'spring',
  duration: 0.4,
  bounce: 0,
};

const style = theme.createStyles({
  container: {
    overflow: 'hidden',
  },
});
