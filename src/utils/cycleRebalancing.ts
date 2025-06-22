
import { logger } from '@/utils/logger';
import { calculateWeightWithDifficulty } from './cycleOptimization';

export const rebalanceSubjects = (subjects: any[], weeklyHours: number, minBlockDuration: number) => {
  logger.info('🔧 Iniciando rebalanceamento inteligente...');
  
  // Calcular distribuição inicial
  const totalAdjustedWeight = subjects.reduce((sum, subject) => 
    sum + calculateWeightWithDifficulty(subject.weight, subject.difficulty), 0
  );

  let rebalancedSubjects = subjects.map(subject => {
    const adjustedWeight = calculateWeightWithDifficulty(subject.weight, subject.difficulty);
    const hoursPerWeek = (weeklyHours * adjustedWeight / totalAdjustedWeight);
    return {
      name: subject.name,
      difficulty: subject.difficulty === 1 ? 'Alta' as const :
                 subject.difficulty === 2 ? 'Alta' as const :
                 subject.difficulty === 3 ? 'Média' as const :
                 subject.difficulty === 4 ? 'Baixa' as const :
                 'Baixa' as const,
      hoursPerWeek,
      weight: subject.weight,
      originalWeight: adjustedWeight,
      minutesPerWeek: hoursPerWeek * 60
    };
  });

  // Verificar se alguma disciplina precisa ser ajustada para o mínimo
  const minMinutes = minBlockDuration;
  const subjectsBelowMin = rebalancedSubjects.filter(s => s.minutesPerWeek < minMinutes);
  
  if (subjectsBelowMin.length > 0) {
    logger.info('⚡ Aplicando rebalanceamento para disciplinas abaixo do mínimo:', 
      subjectsBelowMin.map(s => ({ name: s.name, current: s.minutesPerWeek, needed: minMinutes }))
    );
    
    // Elevar disciplinas pequenas para o mínimo
    let totalMinutesAdded = 0;
    rebalancedSubjects = rebalancedSubjects.map(subject => {
      if (subject.minutesPerWeek < minMinutes) {
        const addedMinutes = minMinutes - subject.minutesPerWeek;
        totalMinutesAdded += addedMinutes;
        return {
          ...subject,
          minutesPerWeek: minMinutes,
          hoursPerWeek: minMinutes / 60
        };
      }
      return subject;
    });

    // Recalcular disciplinas maiores mantendo proporção relativa
    const subjectsAboveMin = rebalancedSubjects.filter(s => s.minutesPerWeek > minMinutes);
    
    if (subjectsAboveMin.length > 0) {
      const totalOriginalWeightAboveMin = subjectsAboveMin.reduce((sum, s) => sum + s.originalWeight, 0);
      const remainingMinutes = (weeklyHours * 60) - (subjectsBelowMin.length * minMinutes);
      
      rebalancedSubjects = rebalancedSubjects.map(subject => {
        if (subject.minutesPerWeek > minMinutes) {
          const proportionalMinutes = (subject.originalWeight / totalOriginalWeightAboveMin) * remainingMinutes;
          return {
            ...subject,
            minutesPerWeek: Math.max(proportionalMinutes, minMinutes),
            hoursPerWeek: Math.max(proportionalMinutes, minMinutes) / 60
          };
        }
        return subject;
      });
    }
  }

  // Garantir que o total não exceda as horas semanais
  const totalMinutes = rebalancedSubjects.reduce((sum, s) => sum + s.minutesPerWeek, 0);
  if (totalMinutes > weeklyHours * 60) {
    const factor = (weeklyHours * 60) / totalMinutes;
    rebalancedSubjects = rebalancedSubjects.map(subject => ({
      ...subject,
      minutesPerWeek: Math.max(subject.minutesPerWeek * factor, minMinutes),
      hoursPerWeek: Math.max(subject.minutesPerWeek * factor, minMinutes) / 60
    }));
  }

  logger.info('✅ Rebalanceamento concluído:', {
    original: subjects.map(s => ({ name: s.name, weight: s.weight })),
    rebalanced: rebalancedSubjects.map(s => ({ name: s.name, hours: s.hoursPerWeek, minutes: s.minutesPerWeek }))
  });

  return rebalancedSubjects.map(({ minutesPerWeek, originalWeight, ...subject }) => subject);
};
