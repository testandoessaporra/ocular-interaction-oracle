
import { useUser } from '@/contexts/UserContext';
import { LazyMedalsGrid, LazyProfileSection } from '@/components/lazy/LazyDashboardCharts';
import { LazyMotionDiv } from '@/components/lazy/LazyFramerMotion';
import { Suspense } from 'react';

// Configuração da animação stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const Dashboard = () => {
  const { userProgress } = useUser();

  return (
    <div className="min-h-screen tactical-bg overflow-x-hidden gpu-accelerate">
      <Suspense fallback={<div className="container mx-auto px-4 py-6">Carregando...</div>}>
        <LazyMotionDiv 
          className="container mx-auto px-4 py-6 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <LazyMotionDiv className="space-y-2" variants={itemVariants}>
            <h1 className="tactical-command text-3xl text-tactical-gold">
              MEDALHAS
            </h1>
          </LazyMotionDiv>

          {/* Profile Section */}
          <LazyMotionDiv variants={itemVariants}>
            <LazyProfileSection />
          </LazyMotionDiv>

          {/* Medals Grid */}
          <LazyMotionDiv variants={itemVariants}>
            <LazyMedalsGrid userProgress={userProgress} />
          </LazyMotionDiv>
        </LazyMotionDiv>
      </Suspense>
    </div>
  );
};

export default Dashboard;
