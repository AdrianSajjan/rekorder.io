import { observer } from 'mobx-react';
import { AnimatePresence, motion, Variants } from 'motion/react';

import { CropSidebar } from './sidebar/crop';
import { SidebarBase } from './sidebar/base';
import { AudioSidebar } from './sidebar/audio';
import { DefaultSidebar } from './sidebar/default';
import { SidebarPlaceholder } from './sidebar/placeholder';
import { editor, SidebarMode } from '../../store/editor';

const transition = {
  duration: 0.5,
  type: 'spring',
  bounce: 0.2,
};

const variants: Variants = {
  initial: (direction: number) => {
    return {
      opacity: 0,
      x: 110 * direction + '%',
    };
  },
  active: {
    x: '0%',
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      opacity: 0,
      x: -110 * direction + '%',
    };
  },
};

const Sidebar = observer(() => {
  if (!editor.video) {
    return <SidebarPlaceholder />;
  }

  const direction = editor.sidebar === 'default' ? -1 : 1;

  return (
    <SidebarBase back={editor.sidebar !== 'default'}>
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div key={editor.sidebar} variants={variants} initial="initial" custom={direction} animate="active" exit="exit" transition={transition} className="px-5">
          <SidebarVariant sidebar={editor.sidebar} />
        </motion.div>
      </AnimatePresence>
    </SidebarBase>
  );
});

const SidebarVariant = observer(({ sidebar }: { sidebar: SidebarMode }) => {
  switch (sidebar) {
    case 'default':
      return <DefaultSidebar />;
    case 'crop':
      return <CropSidebar />;
    case 'audio':
      return <AudioSidebar />;
  }
});

export { Sidebar };
