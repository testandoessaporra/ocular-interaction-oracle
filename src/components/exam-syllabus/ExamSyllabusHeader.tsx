
;
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Target, Sparkles, X } from '@/components/icons';

interface ExamSyllabusHeaderProps {
  contestName: string;
  isCustomized?: boolean;
  isCurrentTarget: boolean;
  onClose: () => void;
}

const ExamSyllabusHeader = ({ 
  contestName, 
  isCustomized, 
  isCurrentTarget, 
  onClose 
}: ExamSyllabusHeaderProps) => {
  return (
    <DialogHeader className="pb-4 border-b border-gray-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-600/20 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <DialogTitle className="tactical-title text-2xl text-yellow-400 flex items-center gap-2">
              Edital Verticalizado
              {isCustomized && (
                <Sparkles className="w-5 h-5 text-blue-400" />
              )}
            </DialogTitle>
            <p className="text-gray-400 text-lg">{contestName}</p>
            {isCurrentTarget && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 tactical-data-display mt-1">
                <Target className="w-3 h-3 mr-1" />
                OBJETIVO ATUAL
              </Badge>
            )}
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </DialogHeader>
  );
};

export default ExamSyllabusHeader;
