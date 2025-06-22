
import React from 'react';
import { Clock, Timer, BookOpen, Target, FileText, ClipboardCheck } from '@/components/icons';
;

interface StudySessionFormProps {
  formData: {
    subject: string;
    duration: number;
    type: string;
    notes: string;
  };
  availableSubjects: { name: string; }[];
  onFieldChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStartTimer: () => void;
  onCancel: () => void;
  isValid: boolean;
  submitButtonRef: React.RefObject<HTMLButtonElement>;
}

const StudySessionForm = ({ 
  formData, 
  availableSubjects, 
  onFieldChange, 
  onSubmit, 
  onStartTimer,
  onCancel, 
  isValid, 
  submitButtonRef 
}: StudySessionFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Campo Disciplina */}
      <div className="space-y-2">
        <label htmlFor="subject" className="tactical-label text-gray-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-tactical-gold" />
          DISCIPLINA
        </label>
        <div className="relative">
          <select
            id="subject"
            className="w-full tactical-card-enhanced tactical-border-gold-active rounded-xl px-4 py-3 pl-12 text-white tactical-body focus:outline-none focus:ring-2 focus:ring-tactical-gold focus:border-tactical-gold transition-all duration-200"
            value={formData.subject}
            onChange={(e) => onFieldChange('subject', e.target.value)}
            required
          >
            <option value="" disabled className="text-tactical-disabledGray">
              Selecione a disciplina
            </option>
            {availableSubjects.map((s) => (
              <option key={s.name} value={s.name} className="text-white bg-tactical-darkGray">
                {s.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <BookOpen className="w-4 h-4 text-tactical-gold" />
          </div>
        </div>
      </div>

      {/* Campo Duração */}
      <div className="space-y-2">
        <label htmlFor="duration" className="tactical-label text-gray-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-tactical-gold" />
          DURAÇÃO (MINUTOS)
        </label>
        <div className="relative">
          <input
            type="number"
            id="duration"
            className="w-full tactical-card-enhanced tactical-border-gold-active rounded-xl px-4 py-3 pl-12 text-white tactical-body placeholder-tactical-disabledGray focus:outline-none focus:ring-2 focus:ring-tactical-gold focus:border-tactical-gold transition-all duration-200"
            value={formData.duration}
            onChange={(e) => onFieldChange('duration', Number(e.target.value))}
            placeholder="Ex: 60"
            min="1"
            max="600"
            required
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Clock className="w-4 h-4 text-tactical-gold" />
          </div>
        </div>
      </div>

      {/* Campo Tipo de Estudo */}
      <div className="space-y-2">
        <label htmlFor="type" className="tactical-label text-gray-300 flex items-center gap-2">
          <Target className="w-4 h-4 text-tactical-gold" />
          TIPO DE ESTUDO
        </label>
        <div className="relative">
          <select
            id="type"
            className="w-full tactical-card-enhanced tactical-border-gold-active rounded-xl px-4 py-3 pl-12 text-white tactical-body focus:outline-none focus:ring-2 focus:ring-tactical-gold focus:border-tactical-gold transition-all duration-200"
            value={formData.type}
            onChange={(e) => onFieldChange('type', e.target.value)}
            required
          >
            <option value="Teoria" className="text-white bg-tactical-darkGray">Teoria</option>
            <option value="Questões" className="text-white bg-tactical-darkGray">Questões</option>
            <option value="Simulado" className="text-white bg-tactical-darkGray">Simulado</option>
            <option value="Revisão" className="text-white bg-tactical-darkGray">Revisão</option>
            <option value="Resumo" className="text-white bg-tactical-darkGray">Resumo</option>
            <option value="Flashcards" className="text-white bg-tactical-darkGray">Flashcards</option>
            <option value="Outros" className="text-white bg-tactical-darkGray">Outros</option>
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Target className="w-4 h-4 text-tactical-gold" />
          </div>
        </div>
      </div>

      {/* Campo Anotações */}
      <div className="space-y-2">
        <label htmlFor="notes" className="tactical-label text-gray-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-tactical-gold" />
          ANOTAÇÕES
        </label>
        <div className="relative">
          <textarea
            id="notes"
            className="w-full tactical-card-enhanced tactical-border-gold-active rounded-xl px-4 py-3 pl-12 pr-4 h-24 resize-none text-white tactical-body placeholder-tactical-disabledGray focus:outline-none focus:ring-2 focus:ring-tactical-gold focus:border-tactical-gold transition-all duration-200"
            value={formData.notes}
            onChange={(e) => onFieldChange('notes', e.target.value)}
            placeholder="Adicione notas sobre a sessão..."
          />
          <div className="absolute top-3 left-0 flex items-start pl-4 pointer-events-none">
            <FileText className="w-4 h-4 text-tactical-gold" />
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="tactical-btn-enhanced flex-1 py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          CANCELAR
        </button>
        
        <button
          type="button"
          onClick={onStartTimer}
          disabled={!formData.subject}
          className="flex-1 tactical-btn-primary-enhanced py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 tactical-border-gold"
        >
          <Timer className="w-4 h-4" />
          INICIAR TIMER
        </button>
        
        <button
          ref={submitButtonRef}
          type="submit"
          disabled={!isValid}
          className="tactical-btn-primary-enhanced flex-1 py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ClipboardCheck className="w-4 h-4" />
          CONFIRMAR
        </button>
      </div>
    </form>
  );
};

export default StudySessionForm;
