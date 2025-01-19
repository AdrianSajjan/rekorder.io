import { AnimatePresence, motion } from 'motion/react';
import { editor, FooterMode } from '../../store/editor';
import { FOOTER_HEIGHT } from '../../constants/layout';

export function Footer() {
  return (
    <AnimatePresence mode="popLayout">
      <motion.footer key={editor.footer} exit={{ y: FOOTER_HEIGHT }} transition={{ duration: 0.3 }}>
        <FooterVariant footer={editor.footer} />
      </motion.footer>
    </AnimatePresence>
  );
}

export function FooterVariant({ footer }: { footer: FooterMode }) {
  switch (footer) {
    case 'audio':
      return <AudioFooter />;
    case 'trim':
      return <TrimFooter />;
    default:
      return null;
  }
}

function AudioFooter() {
  return <div className="bg-card-background shrink-0 border-t border-borders-input" style={{ height: FOOTER_HEIGHT }}></div>;
}

function TrimFooter() {
  return <div className="bg-card-background shrink-0 border-t border-borders-input" style={{ height: FOOTER_HEIGHT }}></div>;
}
