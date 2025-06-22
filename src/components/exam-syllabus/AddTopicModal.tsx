
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, X } from '@/components/icons';
;

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, subtopics: string, position: number) => void;
  maxPosition: number;
}

const AddTopicModal = ({ isOpen, onClose, onAdd, maxPosition }: AddTopicModalProps) => {
  const [title, setTitle] = useState('');
  const [subtopics, setSubtopics] = useState('');
  const [position, setPosition] = useState(maxPosition);

  const handleSubmit = () => {
    onAdd(title, subtopics, position);
    setTitle('');
    setSubtopics('');
    setPosition(maxPosition);
  };

  const handleClose = () => {
    onClose();
    setTitle('');
    setSubtopics('');
    setPosition(maxPosition);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl tactical-card border-2 border-green-500/30 bg-gray-900">
        <DialogHeader>
          <DialogTitle className="tactical-title text-xl text-green-400">
            Adicionar Novo Tópico
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-green-400 font-medium">Título do Tópico *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Novo tópico personalizado..."
              className="tactical-input bg-gray-800/50 border-green-600/30 text-white mt-1"
            />
          </div>
          
          <div>
            <Label className="text-green-400 font-medium">Posição na sequência</Label>
            <Input
              type="number"
              min="1"
              max={maxPosition}
              value={position}
              onChange={(e) => setPosition(parseInt(e.target.value) || 1)}
              className="tactical-input bg-gray-800/50 border-green-600/30 text-white mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Posição onde o tópico será inserido (1 a {maxPosition})
            </p>
          </div>
          
          <div>
            <Label className="text-green-400 font-medium">Subtópicos (opcional)</Label>
            <Textarea
              value={subtopics}
              onChange={(e) => setSubtopics(e.target.value)}
              placeholder="Digite um subtópico por linha..."
              rows={4}
              className="tactical-input bg-gray-800/50 border-green-600/30 text-white mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Cada linha será um subtópico separado
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="tactical-button bg-green-600 hover:bg-green-700 text-white flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Adicionar Tópico
          </Button>
          <Button
            onClick={handleClose}
            variant="outline"
            className="tactical-button border-gray-600/50 text-gray-400"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTopicModal;
