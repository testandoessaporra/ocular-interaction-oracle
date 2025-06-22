
;
import { Button } from '@/components/ui/button';
import { FileText, Target, Sparkles } from '@/components/icons';

interface ExamSyllabusActionBarProps {
  totalQuestions: number;
  subjectsCount: number;
  isCustomized?: boolean;
  onCreateOperation: () => void;
  onClose: () => void;
}

const ExamSyllabusActionBar = ({ 
  totalQuestions, 
  subjectsCount, 
  isCustomized, 
  onCreateOperation, 
  onClose 
}: ExamSyllabusActionBarProps) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
      <div className="text-gray-400 text-sm">
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Edital completo • {totalQuestions} questões • {subjectsCount} disciplinas
          {isCustomized && (
            <span className="text-blue-400 ml-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Personalizado
            </span>
          )}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onCreateOperation}
          className="tactical-button bg-yellow-600 hover:bg-yellow-700 text-black"
        >
          <Target className="w-4 h-4 mr-2" />
          Criar Operação
        </Button>
        <Button
          onClick={onClose}
          className="tactical-button bg-gray-700 hover:bg-gray-600 text-white"
        >
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default ExamSyllabusActionBar;
