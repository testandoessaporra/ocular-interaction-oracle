import { Target, Award, Trophy } from '@/components/icons';


;

export const MEDALS_CONFIG = [
  {
    id: 1,
    title: "Primeiro Passo",
    description: "Atingir o nível 2",
    requirement: 2,
    type: "level" as const,
    icon: Target
  },
  {
    id: 2,
    title: "Estudante Dedicado", 
    description: "Atingir o nível 5",
    requirement: 5,
    type: "level" as const,
    icon: Award
  },
  {
    id: 3,
    title: "Veterano dos Estudos",
    description: "Atingir o nível 10", 
    requirement: 10,
    type: "level" as const,
    icon: Trophy
  }
];
