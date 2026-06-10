import { AnimatePresence, motion } from 'framer-motion';

const toastVariants = {
  initial: { opacity: 0, x: 48, scale: 0.9 },
  animate: { 
    opacity: 1, 
    x: 0,  
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 } 
  },
  exit: { 
    opacity: 0, 
    x: 48, 
    scale: 0.85,
    transition: { duration: 0.18 } 
  },
};

interface Toast {
  id: number;
  message: string;
}

interface Props {
  toasts: Toast[];
}

export function ToastContainer({ toasts }: Props) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999 }}>
      <AnimatePresence initial={false}>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout // płynne przesunięcie pozostałych toastów
            variants={toastVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            className="toast-message"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}