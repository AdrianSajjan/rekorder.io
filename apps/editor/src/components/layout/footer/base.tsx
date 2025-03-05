import { motion } from 'motion/react';
import { FOOTER_HEIGHT, SIDEBAR_WIDTH } from '../../../constants/layout';

const variants = {
  exit: {
    y: FOOTER_HEIGHT,
  },
  initial: {
    y: FOOTER_HEIGHT,
  },
  animate: {
    y: 0,
  },
  transition: {
    duration: 0.3,
  },
};

export function FooterBase({ children }: { children?: React.ReactNode }) {
  const footer = {
    height: FOOTER_HEIGHT,
    width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
    left: SIDEBAR_WIDTH,
  };

  return (
    <motion.footer
      exit="exit"
      style={footer}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={variants.transition}
      className="bg-card-background border-t border-borders-input flex flex-col fixed bottom-0"
    >
      {children}
    </motion.footer>
  );
}
