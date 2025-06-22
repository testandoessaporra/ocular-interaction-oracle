// Framer Motion type definitions for lazy loading

export interface AnimationControls {
  start: (definition: AnimationDefinition) => Promise<void>;
  stop: () => void;
}

export type Target = string | TargetAndTransition;

export interface TargetAndTransition {
  [key: string]: string | number | TargetAndTransition;
}

export interface AnimationDefinition {
  [key: string]: string | number | AnimationDefinition;
}

export interface Transition {
  type?: "spring" | "tween" | "inertia";
  duration?: number;
  delay?: number;
  ease?: string | number[];
  times?: number[];
  repeat?: number;
  repeatType?: "loop" | "reverse" | "mirror";
  repeatDelay?: number;
  staggerChildren?: number;
  delayChildren?: number;
  staggerDirection?: 1 | -1;
  when?: "beforeChildren" | "afterChildren";
}

export interface Variant {
  [key: string]: string | number | Variant;
}

export interface Variants {
  [key: string]: Variant;
}

export interface MotionProps {
  initial?: boolean | Target | Variants;
  animate?: AnimationControls | Target | Variants;
  exit?: Target | Variants;
  transition?: Transition;
  whileHover?: Target | Variants;
  whileTap?: Target | Variants;
  whileDrag?: Target | Variants;
  whileFocus?: Target | Variants;
  whileInView?: Target | Variants;
  variants?: Variants;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  drag?: boolean | "x" | "y";
  dragConstraints?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  dragElastic?: boolean | number;
  layout?: boolean | "position" | "size";
  layoutId?: string;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  [key: string]: unknown;
}