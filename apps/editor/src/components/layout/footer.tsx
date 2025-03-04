import { Button } from '@rekorder.io/ui';
import { ArrowsHorizontal, FastForward, Play, Scissors } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { observer } from 'mobx-react';

import { editor, FooterMode } from '../../store/editor';
import { FOOTER_HEIGHT, HEADER_HEIGHT, SIDEBAR_WIDTH } from '../../constants/layout';
import { Slider } from '../ui/slider';

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

const Footer = observer(() => {
  return (
    <AnimatePresence>
      <FooterVariant key={editor.footer} footer={editor.footer} />
    </AnimatePresence>
  );
});

const FooterVariant = observer(({ footer }: { footer: FooterMode }) => {
  switch (footer) {
    case 'audio':
      return <AudioFooter />;
    case 'trim':
      return <TrimFooter />;
    default:
      return null;
  }
});

function FooterBase({ children }: { children?: React.ReactNode }) {
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
      <div className="flex items-center shrink-0 justify-between px-4 border-b border-borders-input" style={{ height: HEADER_HEIGHT }}>
        <div className="flex items-center gap-4 min-w-48">
          <Button size="small" variant="light" color="accent">
            <Scissors weight="fill" size={16} />
            <span>Trim Audio</span>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" color="accent">
            <FastForward weight="fill" size={16} className="rotate-180" />
          </Button>
          <p className="text-sm text-card-text">00:10</p>
          <Button size="icon" variant="outline" color="accent">
            <Play weight="fill" size={16} />
          </Button>
          <p className="text-sm text-card-text font-medium">00:50</p>
          <Button size="icon" variant="ghost" color="accent">
            <FastForward weight="fill" size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-4 min-w-48">
          <ArrowsHorizontal weight="bold" size={16} className="shrink-0" />
          <Slider trackClassName="h-1.5" rangeClassName="bg-accent-main" thumbClassName="border-accent-main h-4 w-4" />
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </motion.footer>
  );
}

function AudioFooter() {
  return <FooterBase></FooterBase>;
}

function TrimFooter() {
  return <FooterBase></FooterBase>;
}

export { Footer };
