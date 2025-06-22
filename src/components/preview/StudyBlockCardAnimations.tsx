
import React from 'react';
import { motion } from 'framer-motion';

interface StudyBlockCardAnimationsProps {
  index: number;
  isDragging?: boolean;
  isDragOver?: boolean;
  children: React.ReactNode;
}

const StudyBlockCardAnimations = ({ 
  index, 
  isDragging = false, 
  isDragOver = false, 
  children 
}: StudyBlockCardAnimationsProps) => {
  
  // Variants combinados para controlar TODAS as transformações scale e entrada
  const cardVariants = {
    hidden: { 
      scale: 1,
      opacity: 0, 
      y: 8,
      transition: { duration: 0.3 }
    },
    idle: { 
      scale: 1,
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    hover: { 
      scale: 1.02,
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    dragging: { 
      scale: 0.95,
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    dragOver: { 
      scale: 1.02,
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  // Determinar o estado atual baseado nas props
  const getCurrentVariant = () => {
    if (isDragging) return 'dragging';
    if (isDragOver) return 'dragOver';
    return 'idle';
  };

  return (
    <motion.div
      className="h-full w-full flex flex-col justify-between"
      variants={cardVariants}
      initial="hidden"
      animate={getCurrentVariant()}
      whileHover="hover"
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        transformOrigin: 'center center',
        backfaceVisibility: 'hidden',
        willChange: 'transform'
      }}
    >
      {children}
    </motion.div>
  );
};

export default StudyBlockCardAnimations;
