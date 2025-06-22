
import { motion } from "framer-motion";

// Configuração otimizada das animações sem transforms problemáticos
export const pageTransition = {
  initial: { 
    opacity: 0, 
    y: 6,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1
  },
  exit: { 
    opacity: 0, 
    y: -6,
    scale: 0.98
  },
  transition: { 
    duration: 0.2, 
    ease: [0.25, 0.46, 0.45, 0.94],
    type: "tween"
  },
};

export const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageTransition}
    transition={pageTransition.transition}
  >
    {children}
  </motion.div>
);
