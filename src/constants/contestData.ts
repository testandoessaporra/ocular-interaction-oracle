
import { Contest } from '@/types/contest';
import { EXAM_SUBJECTS } from './examData';

export const CONTESTS: Contest[] = [
  {
    id: 'PRF',
    name: 'PRF',
    fullName: 'Polícia Rodoviária Federal',
    institution: 'Ministério da Justiça e Segurança Pública',
    logoUrl: '/lovable-uploads/fc6f1347-6a5e-4d3e-8d84-f8d4c2a65cec.png',
    color: 'from-blue-900 to-blue-800',
    subjects: EXAM_SUBJECTS.PRF,
    totalQuestions: 120,
    examDate: '2025',
    status: 'upcoming'
  },
  {
    id: 'PF',
    name: 'PF - Agente',
    fullName: 'Polícia Federal - Agente',
    institution: 'Ministério da Justiça e Segurança Pública',
    logoUrl: '/lovable-uploads/2f9258a4-c8c3-45c7-a5e2-56bb78a3d645.png',
    color: 'from-green-900 to-green-800',
    subjects: EXAM_SUBJECTS.PF,
    totalQuestions: 120,
    examDate: '2025',
    status: 'upcoming'
  }
];
