
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Accordion } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getSyllabusWithCustomData, saveCustomSyllabusData, getCustomSyllabusData } from '@/constants/syllabusData';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import SyllabusEditor from './SyllabusEditor';
import { Topic } from '@/types/contest';
import ExamSyllabusHeader from './exam-syllabus/ExamSyllabusHeader';
import SubjectItem from './exam-syllabus/SubjectItem';
import { Button } from '@/components/ui/button';
import { Target } from '@/components/icons';
;

interface ExamSyllabusModalProps {
  contestId: string;
  contestName: string;
  onClose: () => void;
}

const ExamSyllabusModal = ({ contestId, contestName, onClose }: ExamSyllabusModalProps) => {
  const { targetExam } = useUser();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  
  const syllabus = getSyllabusWithCustomData(contestId);

  if (!syllabus) {
    return null;
  }

  const handleCreateOperation = () => {
    toast({
      title: "🚀 Recurso em Desenvolvimento",
      description: "A criação de operações a partir do edital estará disponível em breve!",
      duration: 3000,
    });
  };

  const handleSaveSubject = (subjectName: string, topics: Topic[]) => {
    const customData = getCustomSyllabusData();
    if (!customData[contestId]) {
      customData[contestId] = {};
    }
    customData[contestId][subjectName] = topics;
    saveCustomSyllabusData(customData);
    setEditingSubject(null);
  };

  const handleRestoreSubject = (subjectName: string) => {
    const customData = getCustomSyllabusData();
    if (customData[contestId] && customData[contestId][subjectName]) {
      delete customData[contestId][subjectName];
      if (Object.keys(customData[contestId]).length === 0) {
        delete customData[contestId];
      }
      saveCustomSyllabusData(customData);
    }
    setEditingSubject(null);
  };

  const isCurrentTarget = targetExam === contestId;

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className={`
          tactical-card border-2 border-yellow-500/30 bg-gray-900 [&>button]:hidden
          ${isMobile 
            ? 'w-[95vw] h-[95vh] max-w-none max-h-none m-2 p-3' 
            : 'max-w-6xl max-h-[95vh] p-6'
          }
        `}>
          <ExamSyllabusHeader
            contestName={contestName}
            isCustomized={syllabus.isCustomized}
            isCurrentTarget={isCurrentTarget}
            onClose={onClose}
          />

          <ScrollArea className={`flex-1 ${isMobile ? 'max-h-[65vh]' : 'max-h-[60vh]'}`}>
            <Accordion type="single" collapsible className="space-y-3">
              {syllabus.subjects.map((subject, index) => (
                <SubjectItem
                  key={subject.name}
                  subject={subject}
                  index={index}
                  onEdit={setEditingSubject}
                />
              ))}
            </Accordion>
          </ScrollArea>

          <div className={`
            flex items-center justify-between pt-4 border-t border-gray-700/50
            ${isMobile ? 'flex-col gap-3' : 'flex-row'}
          `}>
            <div className={`text-gray-400 text-sm ${isMobile ? 'text-center' : ''}`}>
              Edital completo • {syllabus.subjects.length} disciplinas
            </div>
            <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
              <Button
                onClick={handleCreateOperation}
                className={`
                  tactical-button bg-yellow-600 hover:bg-yellow-700 text-black
                  ${isMobile ? 'flex-1 text-sm' : ''}
                `}
              >
                <Target className="w-4 h-4 mr-2" />
                Criar Operação
              </Button>
              <Button
                onClick={onClose}
                className={`
                  tactical-button bg-gray-700 hover:bg-gray-600 text-white
                  ${isMobile ? 'flex-1 text-sm' : ''}
                `}
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Syllabus Editor */}
      {editingSubject && (
        <SyllabusEditor
          topics={syllabus.subjects.find(s => s.name === editingSubject)?.topics || []}
          subjectName={editingSubject}
          examId={contestId}
          onSave={(topics) => handleSaveSubject(editingSubject, topics)}
          onRestore={() => handleRestoreSubject(editingSubject)}
          isOpen={!!editingSubject}
          onClose={() => setEditingSubject(null)}
        />
      )}
    </>
  );
};

export default ExamSyllabusModal;
