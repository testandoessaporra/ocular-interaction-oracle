
import { useMemo } from 'react';

interface MomentumData {
  level: number;
  title: string;
  cssClass: string;
  description: string;
}

export const useMomentumLevel = (cycleStreak: number): MomentumData => {
  return useMemo(() => {
    if (cycleStreak === 0) {
      return {
        level: 0,
        title: "Comece um ciclo",
        cssClass: "momentum-inactive",
        description: "Inicie sua jornada"
      };
    }

    if (cycleStreak === 1) {
      return {
        level: 1,
        title: "Momentum Iniciado",
        cssClass: "momentum-level-1",
        description: "Primeiro passo dado!"
      };
    }

    if (cycleStreak === 2) {
      return {
        level: 2,
        title: "Momentum Crescendo",
        cssClass: "momentum-level-2",
        description: "Disciplina em crescimento"
      };
    }

    if (cycleStreak === 3) {
      return {
        level: 3,
        title: "Momentum Alto",
        cssClass: "momentum-level-3",
        description: "Excelente consistência!"
      };
    }

    if (cycleStreak === 4) {
      return {
        level: 4,
        title: "Momentum Épico",
        cssClass: "momentum-level-4",
        description: "Performance extraordinária!"
      };
    }

    // 5 ou mais ciclos
    return {
      level: 5,
      title: "MOMENTUM MÁXIMO!",
      cssClass: "momentum-level-5",
      description: "Lendário! Imparável!"
    };
  }, [cycleStreak]);
};
