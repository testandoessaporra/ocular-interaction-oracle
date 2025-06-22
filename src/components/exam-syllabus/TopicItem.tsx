
;
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Topic } from '@/types/contest';
import { BookOpen, ArrowUp, ArrowDown, Copy, Edit, Trash2 } from '@/components/icons';

interface TopicItemProps {
  topic: Topic;
  index: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  showControls?: boolean;
}

const TopicItem = ({ 
  topic, 
  index, 
  onMoveUp, 
  onMoveDown, 
  onDuplicate,
  onEdit,
  onDelete,
  isFirst = false,
  isLast = false,
  showControls = false
}: TopicItemProps) => {
  return (
    <div className={`
      bg-gray-800/30 rounded-lg p-4 border transition-all
      ${topic.isCustom 
        ? 'border-green-500/30 bg-green-900/10' 
        : topic.isEdited 
          ? 'border-blue-500/30 bg-blue-900/10'
          : 'border-gray-700/30'
      }
    `}>
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-yellow-600/20 text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-semibold leading-tight">{topic.title}</h4>
            {topic.isCustom && (
              <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                PERSONALIZADO
              </Badge>
            )}
            {topic.isEdited && !topic.isCustom && (
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                EDITADO
              </Badge>
            )}
          </div>
        </div>
        
        {/* Controles reorganizados em uma única linha */}
        {showControls && (
          <div className="flex items-center gap-1">
            {/* Botões de reordenação */}
            {!isFirst && onMoveUp && (
              <Button
                onClick={onMoveUp}
                size="sm"
                variant="outline"
                className="tactical-button border-blue-600/50 text-blue-400 hover:bg-blue-600/10 h-7 w-7 p-0"
                title="Mover para cima"
              >
                <ArrowUp className="w-3 h-3" />
              </Button>
            )}
            {!isLast && onMoveDown && (
              <Button
                onClick={onMoveDown}
                size="sm"
                variant="outline"
                className="tactical-button border-blue-600/50 text-blue-400 hover:bg-blue-600/10 h-7 w-7 p-0"
                title="Mover para baixo"
              >
                <ArrowDown className="w-3 h-3" />
              </Button>
            )}
            
            {/* Botão de duplicar */}
            {onDuplicate && (
              <Button
                onClick={onDuplicate}
                size="sm"
                variant="outline"
                className="tactical-button border-purple-600/50 text-purple-400 hover:bg-purple-600/10 h-7 w-7 p-0"
                title="Duplicar tópico"
              >
                <Copy className="w-3 h-3" />
              </Button>
            )}
            
            {/* Botão de editar */}
            {onEdit && (
              <Button
                onClick={onEdit}
                size="sm"
                variant="outline"
                className="tactical-button border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/10 h-7 w-7 p-0"
                title="Editar tópico"
              >
                <Edit className="w-3 h-3" />
              </Button>
            )}
            
            {/* Botão de excluir */}
            {onDelete && (
              <Button
                onClick={onDelete}
                size="sm"
                variant="outline"
                className="tactical-button border-red-600/50 text-red-400 hover:bg-red-600/10 h-7 w-7 p-0"
                title="Excluir tópico"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>
      
      {topic.subtopics && topic.subtopics.length > 0 && (
        <div className="ml-9">
          <ul className="space-y-2">
            {topic.subtopics.map((subtopic, subtopicIndex) => (
              <li key={subtopicIndex} className="flex items-start gap-2 text-gray-300 text-sm">
                <BookOpen className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{subtopic}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopicItem;
