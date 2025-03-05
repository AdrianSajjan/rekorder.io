import { observer } from 'mobx-react';
import { AnimatePresence } from 'motion/react';

import { FooterBase } from './footer/base';
import { TrimFooter } from './footer/trim';
import { AudioFooter } from './footer/audio';
import { editor, FooterMode } from '../../store/editor';

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
      return (
        <FooterBase>
          <AudioFooter />
        </FooterBase>
      );
    case 'trim':
      return (
        <FooterBase>
          <TrimFooter />
        </FooterBase>
      );
    default:
      return null;
  }
});

export { Footer };
