import { observer } from 'mobx-react';
import { AnimatePresence, LayoutGroup, motion, MotionConfig } from 'motion/react';
import { CaretLeft } from '@phosphor-icons/react';

import { Brand, Button } from '@rekorder.io/ui';
import { editor } from '../../../store/editor';

interface SidebarBaseProps {
  back?: boolean;
  children?: React.ReactNode;
}

const SidebarBase = observer(({ back, children }: SidebarBaseProps) => {
  return (
    <aside className="h-screen overflow-auto w-96 shrink-0 bg-card-background border-r border-borders-input flex flex-col ">
      <div className="h-16 flex w-full items-center justify-start shrink-0 gap-1 px-5">
        <MotionConfig transition={transition}>
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {back ? (
                <motion.div layout variants={variants} initial="initial" animate="animate" exit="exit">
                  <Button size="icon" variant="ghost" color="accent" className="!rounded-full !h-8 !w-8 !-ml-2.5 " onClick={() => editor.changeSidebar('default')}>
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
