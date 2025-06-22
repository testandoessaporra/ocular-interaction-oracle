
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExtendedSubject } from '@/types/cycleWizard';
import { Plus } from '@/components/icons';
;

interface AddCustomSubjectCardProps {
  onAdd: (subject: ExtendedSubject) => void;
}

const AddCustomSubjectCard = ({ onAdd }: AddCustomSubjectCardProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');

  const handleAddCustomSubject = () => {
    if (customSubjectName.trim()) {
      const newSubject: ExtendedSubject = {
        name: customSubjectName.trim(),
        weight: 10, // Peso padrão para disciplinas customizadas
        difficulty: 3 as 1 | 2 | 3 | 4 | 5,
        isSelected: true,
        isCustom: true
      };
      
      onAdd(newSubject);
      setCustomSubjectName('');
      setShowCustomInput(false);
    }
  };

  const handleCancel = () => {
    setShowCustomInput(false);
    setCustomSubjectName('');
  };

  return (
    <Card className="bg-gray-800/30 border-gray-600/50 border-dashed hover:border-yellow-400/50 transition-all duration-300">
      <CardContent className="p-4 sm:p-6 h-full flex items-center justify-center">
        {showCustomInput ? (
          <div className="w-full space-y-4">
            <Input
              value={customSubjectName}
              onChange={(e) => setCustomSubjectName(e.target.value)}
              placeholder="Nome da disciplina"
              className="bg-gray-700/50 border-gray-600/50 text-white focus:border-yellow-400 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSubject()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddCustomSubject}
                size="sm"
                className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400 text-xs"
                disabled={!customSubjectName.trim()}
              >
                Adicionar
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex-1 border-gray-600/50 text-gray-300 text-xs"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowCustomInput(true)}
            variant="ghost"
            className="w-full h-full flex flex-col items-center gap-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10"
          >
            <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="text-xs sm:text-sm tactical-element">Adicionar Disciplina</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AddCustomSubjectCard;
