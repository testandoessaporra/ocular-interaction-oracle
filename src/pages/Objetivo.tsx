
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
;
import { useUser } from '@/contexts/UserContext';
import { CONTESTS } from '@/constants/contestData';
import ContestCard from '@/components/ContestCard';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Target, Trophy } from '@/components/icons';

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

const Objetivo = () => {
  const { targetExam } = useUser();

  const getCurrentExamInfo = () => {
    if (!targetExam) return null;
    
    const contest = CONTESTS.find(c => c.id === targetExam);
    
    return { contest };
  };

  const info = getCurrentExamInfo();

  return (
    <div className="min-h-screen tactical-bg overflow-x-hidden gpu-accelerate">
      <motion.div 
        className="container mx-auto px-4 py-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <h1 className="tactical-command text-3xl text-yellow-400">
            OBJETIVOS
          </h1>
        </motion.div>

        {/* Current Objective Card */}
        {info?.contest && (
          <motion.div variants={itemVariants}>
            <Card className="tactical-card border-yellow-500/30">
              <CardHeader>
                <CardTitle className="tactical-command text-lg text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-yellow-400" />
                  MISSÃO ATIVA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="tactical-subtitle text-lg text-yellow-400 mb-1">
                        {info.contest.name}
                      </h3>
                      <p className="tactical-body text-gray-300">
                        {info.contest.fullName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-900/30 rounded-lg border border-yellow-500/50">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="tactical-element text-yellow-400 text-sm">
                        {info.contest.id}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="tactical-body text-sm">Objetivo configurado com sucesso</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Contest Selection */}
        <motion.div variants={itemVariants}>
          <Card className="tactical-card">
            <CardHeader>
              <CardTitle className="tactical-command text-lg text-white">
                {info?.contest ? 'ALTERAR OBJETIVO' : 'CONFIGURAR OBJETIVO'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="tactical-command text-xl text-white mb-3">
                  Selecione seu Objetivo
                </h3>
                <p className="tactical-body text-gray-300">
                  Escolha o concurso que será seu foco principal de estudos
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {CONTESTS.map((contest) => (
                  <ContestCard key={contest.id} contest={contest} />
                ))}
              </div>

              {!targetExam && (
                <div className="flex items-center gap-2 p-4 bg-orange-900/20 rounded-lg border border-orange-500/30">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <p className="tactical-body text-orange-300">
                    Selecione um concurso para configurar seu objetivo de estudos
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Objetivo;
