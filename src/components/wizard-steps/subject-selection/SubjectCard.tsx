
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExtendedSubject } from '@/types/cycleWizard';
import { BookOpen, Check, X } from '@/components/icons';
;

interface SubjectCardProps {
  subject: ExtendedSubject;
  index: number;
  onToggle: (index: number) => void;
  onRemove: (index: number) => void;
}

const SubjectCard = ({ subject, index, onToggle, onRemove }: SubjectCardProps) => {
  const isSelected = subject.isSelected;
  
  return (
    <Card
      className={`
        transition-all duration-300 hover:scale-105 cursor-pointer relative
        ${isSelected 
          ? 'bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-400/60 shadow-lg' 
          : 'bg-gray-800/50 border-gray-600/50 hover:border-yellow-400/30'
        }
      `}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`
            p-2 rounded-lg border transition-all duration-300
            ${isSelected 
              ? 'bg-yellow-400/20 border-yellow-400/60' 
              : 'bg-gray-700/50 border-gray-600/50'
            }
          `}>
            <BookOpen className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-yellow-400' : 'text-gray-400'}`} />
          </div>
          
          {subject.isCustom && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div 
          onClick={() => onToggle(index)}
          className="cursor-pointer"
        >
          <h4 className={`tactical-element text-xs sm:text-sm mb-3 leading-tight ${isSelected ? 'text-white' : 'text-white'}`}>
            {subject.name}
          </h4>
          
          <div className="flex items-center justify-between">
            <span className={`text-xs tactical-body ${isSelected ? 'text-gray-200' : 'text-gray-400'}`}>
              Peso: {subject.weight}
              {subject.isCustom && ' (Personalizada)'}
            </span>
            
            <div className={`
              w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
              ${isSelected 
                ? 'bg-yellow-400 border-yellow-400' 
                : 'bg-transparent border-gray-500'
              }
            `}>
              {isSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-black" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
