import { CheckCircle, XCircle } from '@phosphor-icons/react';
import { observer } from 'mobx-react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { cn } from '@rekorder.io/utils';

type ModifyButtonStatus = 'idle' | 'processing' | 'completed' | 'error';

interface ActionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  progress: number;
  container?: string;
  status: ModifyButtonStatus;
  onAbort?: () => void;
}

const ActionButton = observer(({ status, progress, children, container, onAbort, ...props }: ActionButtonProps) => {
  return (
    <div className={cn('relative overflow-hidden', container)}>
      <button
        {...props}
        className={cn('h-10 w-full rounded-[0.62rem] text-sm font-medium text-primary-text relative overflow-hidden disabled:pointer-events-none transition-colors duration-300', {
          'bg-success-main': status === 'completed',
          'bg-destructive-main': status === 'error',
          'bg-background-dark': status === 'processing',
          'bg-primary-main hover:bg-primary-dark': status === 'idle',
        })}
      >
        <MotionConfig transition={{ duration: 0.5, type: 'spring' }}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div className="relative z-10 h-full w-full flex items-center px-4" key={status} initial="initial" animate="animate" exit="exit" variants={variants}>
              {children}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {status === 'processing' ? (
              <motion.div exit={variants.exit} animate={{ width: status === 'processing' ? progress + '%' : '100%' }} className="z-0 absolute top-0 left-0 h-full bg-success-main" />
            ) : null}
          </AnimatePresence>
        </MotionConfig>
      </button>
      <AnimatePresence>
        {status === 'processing' ? (
          <motion.button exit="exit" initial="initial" animate="animate" variants={variants} className="group absolute top-0 left-0 h-10 px-4 z-20 flex items-center" onClick={onAbort}>
            <span className="text-xs text-text-dark group-hover:underline">Cancel</span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

const ActionButtonContent = observer(({ status, progress, label }: { label: string; status: ModifyButtonStatus; progress: number }) => {
  switch (status) {
    case 'idle':
      return <div className="mx-auto">{label}</div>;
    case 'processing':
      return <div className="ml-auto text-text-dark text-xs">{progress}%</div>;
    case 'completed':
      return <CheckCircle size={24} weight="regular" className="mx-auto" />;
    case 'error':
      return <XCircle size={24} weight="regular" className="mx-auto" />;
  }
});

const variants = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -40,
    opacity: 0,
  },
};

export { ActionButton, ActionButtonContent };
