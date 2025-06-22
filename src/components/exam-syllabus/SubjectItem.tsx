
;
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { SubjectWithTopics } from '@/types/contest';
import { useIsMobile } from '@/hooks/use-mobile';
import TopicItem from './TopicItem';
import { Edit, Sparkles } from '@/components/icons';

interface SubjectItemProps {
  subject: SubjectWithTopics;
  index: number;
  onEdit: (subjectName: string) => void;
}

const getSubjectColor = (index: number) => {
  const colors = [
    'border-blue-500/50 bg-blue-500/10',
    'border-emerald-500/50 bg-emerald-500/10',
    'border-purple-500/50 bg-purple-500/10',
    'border-orange-500/50 bg-orange-500/10',
    'border-red-500/50 bg-red-500/10',
    'border-yellow-500/50 bg-yellow-500/10',
    'border-pink-500/50 bg-pink-500/10',
    'border-indigo-500/50 bg-indigo-500/10',
    'border-green-500/50 bg-green-500/10',
    'border-gray-500/50 bg-gray-500/10'
  ];
  return colors[index % colors.length];
};

const SubjectItem = ({ subject, index, onEdit }: SubjectItemProps) => {
  const isMobile = useIsMobile();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(subject.name);
  };

  const handleEditTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(subject.name);
  };

  return (
    <AccordionItem
      value={subject.name}
      className={`border rounded-xl ${getSubjectColor(index)} border-2`}
    >
      <AccordionTrigger className={`px-6 py-4 hover:no-underline ${isMobile ? 'flex-col gap-3' : ''}`}>
        <div className={`flex items-center justify-between w-full ${isMobile ? 'flex-col gap-3' : 'mr-4'}`}>
          <div className={`flex items-center gap-4 ${isMobile ? 'w-full justify-center text-center' : ''}`}>
            <div className="tactical-data-display text-lg font-bold text-white min-w-[2rem]">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className={`${isMobile ? 'text-center' : 'text-left'}`}>
              <h3 className={`tactical-title text-lg text-white font-semibold flex items-center gap-2 ${isMobile ? 'justify-center text-base' : ''}`}>
                {subject.name}
                {subject.isCustomized && <Sparkles className="w-4 h-4 text-blue-400" />}
              </h3>
              <p className={`text-gray-400 text-sm ${isMobile ? 'text-center' : ''}`}>
                {subject.topics?.length || 0} tópicos principais
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-3 ${isMobile ? 'w-full justify-center' : ''}`}>
            <Button
              onClick={handleEditClick}
              onTouchEnd={handleEditTouch}
              size={isMobile ? "sm" : "sm"}
              variant="outline"
              className={`
                tactical-button border-purple-600/50 text-purple-400 hover:bg-purple-600/10
                ${isMobile ? 'min-h-[44px] min-w-[44px] touch-manipulation' : ''}
              `}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <Edit className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
              {isMobile && <span className="ml-1 text-xs">EDITAR</span>}
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-4">
        <div className="space-y-4">
          {subject.topics?.map((topic, topicIndex) => (
            <TopicItem key={topic.id} topic={topic} index={topicIndex} />
          )) || (
            <p className="text-gray-400 text-center py-4">
              Detalhamento dos tópicos em breve...
            </p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SubjectItem;
