import { observer } from 'mobx-react';
import { AnimatePresence, LayoutGroup, motion, MotionConfig } from 'motion/react';
import { CaretLeft } from '@phosphor-icons/react';
import { Brand, Button } from '@rekorder.io/ui';

import { editor } from '../../../store/editor';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '../../../constants/layout';

interface SidebarBaseProps {
  back?: boolean;
  children?: React.ReactNode;
}

const SidebarBase = observer(({ back, children }: SidebarBaseProps) => {
  const handleBack = () => {
    switch (editor.sidebar) {
      case 'crop':
        if (editor.cropper.status === 'processing') editor.cropper.abort();
        break;
    }
    editor.changeSidebar('default');
  };

  return (
    <aside className="h-screen overflow-auto bg-card-background border-r border-borders-input flex flex-col fixed top-0 left-0" style={{ width: SIDEBAR_WIDTH }}>
      <div className="flex w-full items-center justify-start shrink-0 gap-1 px-5" style={{ height: HEADER_HEIGHT }}>
        <MotionConfig transition={transition}>
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {back ? (
                <motion.div layout variants={variants} initial="initial" animate="animate" exit="exit">
                  <Button size="icon" variant="ghost" color="accent" className="!rounded-full !h-8 !w-8 !-ml-2.5 " onClick={handleBack}>
                    <CaretLeft weight="bold" size={18} />
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <motion.div layout>
              <Brand mode="expanded" height={30} className="w-fit" />
            </motion.div>
          </LayoutGroup>
        </MotionConfig>
      </div>
      <div className="relative overflow-x-hidden">{children}</div>
    </aside>
  );
});

const variants = {
  exit: {
    opacity: 0,
    scale: 0.6,
  },
  initial: {
    opacity: 0,
    scale: 0.4,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};

const transition = {
  duration: 0.3,
  type: 'spring',
  bounce: 0,
};

export { SidebarBase };
