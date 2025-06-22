import { Trophy } from '@/components/icons';


;

interface ExamStatsBarProps {
  subjectsCount: number;
  totalQuestions: number;
}

const ExamStatsBar = ({ 
  subjectsCount, 
  totalQuestions
}: ExamStatsBarProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-700/50">
      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
        <div className="tactical-data-display text-2xl text-yellow-400">{subjectsCount}</div>
        <div className="text-gray-400 text-sm">Disciplinas</div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
        <div className="tactical-data-display text-2xl text-green-400">{totalQuestions}</div>
        <div className="text-gray-400 text-sm">Questões</div>
      </div>
    </div>
  );
};

export default ExamStatsBar;
