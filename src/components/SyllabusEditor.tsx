import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Topic } from '@/types/contest';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
;
import TopicItem from './exam-syllabus/TopicItem';
import AddTopicModal from './exam-syllabus/AddTopicModal';
import { Plus, Edit, Trash2, RotateCcw, Save, X } from '@/components/icons';

interface SyllabusEditorProps {
  topics: Topic[];
  subjectName: string;
  examId: string;
  onSave: (topics: Topic[]) => void;
  onRestore: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const SyllabusEditor = ({ topics, subjectName, examId, onSave, onRestore, isOpen, onClose }: SyllabusEditorProps) => {
  const [editingTopics, setEditingTopics] = useState<Topic[]>(topics);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [duplicateConfirm, setDuplicateConfirm] = useState<Topic | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleAddTopic = (title: string, subtopics: string, position: number) => {
    if (!title.trim()) {
      toast({
        title: "⚠️ Campo obrigatório",
        description: "O título do tópico é obrigatório.",
        duration: 3000,
      });
      return;
    }

    const subtopicsArray = subtopics
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newTopic: Topic = {
      id: `custom-${Date.now()}`,
      title: title,
      subtopics: subtopicsArray,
      isCustom: true,
      position: position
    };

    // Inserir na posição especificada
    const updatedTopics = [...editingTopics];
    const insertIndex = Math.min(Math.max(0, position - 1), updatedTopics.length);
    updatedTopics.splice(insertIndex, 0, newTopic);

    // Reordenar posições
    const reorderedTopics = updatedTopics.map((topic, index) => ({
      ...topic,
      position: index + 1
    }));

    setEditingTopics(reorderedTopics);
    setIsAddingTopic(false);

    toast({
      title: "✅ Tópico Adicionado",
      description: "Novo tópico adicionado com sucesso!",
      duration: 2000,
    });
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic({
      ...topic,
      isEdited: true
    });
  };

  const handleSaveEdit = () => {
    if (!editingTopic) return;

    const updatedTopics = editingTopics.map(topic =>
      topic.id === editingTopic.id ? editingTopic : topic
    );

    setEditingTopics(updatedTopics);
    setEditingTopic(null);

    toast({
      title: "✅ Tópico Editado",
      description: "Tópico editado com sucesso!",
      duration: 2000,
    });
  };

  const handleDeleteTopic = (topicId: string) => {
    const updatedTopics = editingTopics.filter(topic => topic.id !== topicId);
    // Reordenar posições após exclusão
    const reorderedTopics = updatedTopics.map((topic, index) => ({
      ...topic,
      position: index + 1
    }));
    
    setEditingTopics(reorderedTopics);
    setDeleteConfirm(null);

    toast({
      title: "🗑️ Tópico Removido",
      description: "Tópico removido com sucesso!",
      duration: 2000,
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const updatedTopics = [...editingTopics];
    [updatedTopics[index], updatedTopics[index - 1]] = [updatedTopics[index - 1], updatedTopics[index]];
    
    // Reordenar posições
    const reorderedTopics = updatedTopics.map((topic, idx) => ({
      ...topic,
      position: idx + 1
    }));
    
    setEditingTopics(reorderedTopics);
  };

  const handleMoveDown = (index: number) => {
    if (index === editingTopics.length - 1) return;
    
    const updatedTopics = [...editingTopics];
    [updatedTopics[index], updatedTopics[index + 1]] = [updatedTopics[index + 1], updatedTopics[index]];
    
    // Reordenar posições
    const reorderedTopics = updatedTopics.map((topic, idx) => ({
      ...topic,
      position: idx + 1
    }));
    
    setEditingTopics(reorderedTopics);
  };

  const handleDuplicateTopic = (topic: Topic) => {
    const duplicatedTopic: Topic = {
      ...topic,
      id: `duplicated-${Date.now()}`,
      title: `${topic.title} (Cópia)`,
      isCustom: true,
      isEdited: false
    };

    const updatedTopics = [...editingTopics, duplicatedTopic];
    // Reordenar posições
    const reorderedTopics = updatedTopics.map((t, index) => ({
      ...t,
      position: index + 1
    }));

    setEditingTopics(reorderedTopics);
    setDuplicateConfirm(null);

    toast({
      title: "📋 Tópico Duplicado",
      description: "Tópico duplicado com sucesso!",
      duration: 2000,
    });
  };

  const handleSaveChanges = () => {
    onSave(editingTopics);
    onClose();

    toast({
      title: "💾 Alterações Salvas",
      description: `Edital de ${subjectName} atualizado com sucesso!`,
      duration: 3000,
    });
  };

  const handleRestoreDefault = () => {
    onRestore();
    setRestoreConfirm(false);
    onClose();

    toast({
      title: "🔄 Edital Restaurado",
      description: `${subjectName} restaurado para o padrão original.`,
      duration: 3000,
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`
          tactical-card border-2 border-yellow-500/30 bg-gray-900
          ${isMobile 
            ? 'w-[95vw] h-[95vh] max-w-none max-h-none m-2 p-3' 
            : 'max-w-4xl max-h-[90vh] p-6'
          }
        `}>
          <DialogHeader className="pb-4 border-b border-gray-700/50">
            <DialogTitle className={`tactical-title text-yellow-400 flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              <Edit className="w-5 h-5" />
              Editor de Edital - {isMobile ? subjectName.substring(0, 20) + '...' : subjectName}
            </DialogTitle>
          </DialogHeader>

          {/* Área de controles principais - fora do scroll */}
          <div className={`flex items-center justify-between py-3 border-b border-gray-700/50 ${isMobile ? 'flex-col gap-2' : ''}`}>
            <Button
              onClick={() => setIsAddingTopic(true)}
              className={`tactical-button bg-green-600 hover:bg-green-700 text-white ${isMobile ? 'w-full text-sm' : ''}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Tópico
            </Button>
            <div className={`text-sm text-gray-400 ${isMobile ? 'text-center' : ''}`}>
              {editingTopics.length} tópicos
            </div>
          </div>

          {/* Lista de tópicos com scroll */}
          <div className={`flex-1 overflow-y-auto space-y-4 pr-2 ${isMobile ? 'max-h-[45vh]' : 'max-h-[50vh]'}`}>
            {editingTopics.map((topic, index) => (
              <TopicItem
                key={topic.id}
                topic={topic}
                index={index}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                onDuplicate={() => setDuplicateConfirm(topic)}
                onEdit={() => handleEditTopic(topic)}
                onDelete={() => setDeleteConfirm(topic.id)}
                isFirst={index === 0}
                isLast={index === editingTopics.length - 1}
                showControls={true}
              />
            ))}
            
            {editingTopics.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>Nenhum tópico encontrado.</p>
                <p className="text-sm mt-1">Clique em "Adicionar Tópico" para começar.</p>
              </div>
            )}
          </div>

          {/* Botões de ação - fixos no final */}
          <div className={`flex items-center justify-between pt-4 border-t border-gray-700/50 ${isMobile ? 'flex-col gap-3' : ''}`}>
            <Button
              onClick={() => setRestoreConfirm(true)}
              variant="outline"
              className={`tactical-button border-orange-600/50 text-orange-400 hover:bg-orange-600/10 ${isMobile ? 'w-full text-sm' : ''}`}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
            <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
              <Button
                onClick={handleSaveChanges}
                className={`tactical-button bg-yellow-600 hover:bg-yellow-700 text-black ${isMobile ? 'flex-1 text-sm' : ''}`}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className={`tactical-button border-gray-600/50 text-gray-400 ${isMobile ? 'flex-1 text-sm' : ''}`}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar tópico */}
      <AddTopicModal
        isOpen={isAddingTopic}
        onClose={() => setIsAddingTopic(false)}
        onAdd={handleAddTopic}
        maxPosition={editingTopics.length + 1}
      />

      {/* Modal para editar tópico */}
      {editingTopic && (
        <Dialog open={!!editingTopic} onOpenChange={() => setEditingTopic(null)}>
          <DialogContent className={`tactical-card border-2 border-blue-500/30 bg-gray-900 ${isMobile ? 'w-[95vw] max-w-none m-2 p-3' : ''}`}>
            <DialogHeader>
              <DialogTitle className="tactical-title text-blue-400">Editar Tópico</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-blue-400 font-medium">Título</Label>
                <Input
                  value={editingTopic.title}
                  onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })}
                  className="tactical-input bg-gray-800/50 border-blue-600/30 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-blue-400 font-medium">Subtópicos</Label>
                <Textarea
                  value={editingTopic.subtopics?.join('\n') || ''}
                  onChange={(e) => setEditingTopic({
                    ...editingTopic,
                    subtopics: e.target.value.split('\n').map(s => s.trim()).filter(s => s.length > 0)
                  })}
                  rows={5}
                  className="tactical-input bg-gray-800/50 border-blue-600/30 text-white mt-1"
                />
              </div>
            </div>
            <div className={`flex justify-end gap-2 pt-4 ${isMobile ? 'flex-col' : ''}`}>
              <Button
                onClick={() => setEditingTopic(null)}
                variant="outline"
                className={`tactical-button border-gray-600/50 text-gray-400 ${isMobile ? 'w-full' : ''}`}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEdit}
                className={`tactical-button bg-blue-600 hover:bg-blue-700 text-white ${isMobile ? 'w-full' : ''}`}
              >
                Salvar Edição
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogos de confirmação */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="tactical-card border-2 border-red-500/30 bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Tem certeza que deseja excluir este tópico? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="tactical-button border-gray-600/50 text-gray-400">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteTopic(deleteConfirm)}
              className="tactical-button bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!duplicateConfirm} onOpenChange={() => setDuplicateConfirm(null)}>
        <AlertDialogContent className="tactical-card border-2 border-purple-500/30 bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-purple-400">Duplicar Tópico</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Deseja realmente duplicar o tópico? Se deixar assim, ele vai repetir nas suas recomendações automatizadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="tactical-button border-gray-600/50 text-gray-400">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => duplicateConfirm && handleDuplicateTopic(duplicateConfirm)}
              className="tactical-button bg-purple-600 hover:bg-purple-700 text-white"
            >
              Duplicar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreConfirm} onOpenChange={setRestoreConfirm}>
        <AlertDialogContent className="tactical-card border-2 border-orange-500/30 bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-orange-400">Restaurar Padrão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Tem certeza que deseja restaurar o edital padrão? Todas as modificações personalizadas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="tactical-button border-gray-600/50 text-gray-400">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreDefault}
              className="tactical-button bg-orange-600 hover:bg-orange-700 text-white"
            >
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SyllabusEditor;
