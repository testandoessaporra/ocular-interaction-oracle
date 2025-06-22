
import { logger } from '@/utils/logger';
import React, { useState } from 'react';
import { useStudySession } from '@/hooks/useStudySession';
import StudySessionForm from '@/components/forms/StudySessionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ClipboardCheck, X } from '@/components/icons';

interface StudySessionModalProps {
  onClose: () => void;
  onSessionSaved: (session: { subject: string; date: string; duration: number; type: string; notes?: string }) => void;
  onStartTimer: (formData: { subject: string; duration: number; type: string; notes: string }) => void;
  availableSubjects: { name: string; }[];
  preselectedSubject?: string;
  preselectedDuration?: number;
}

const StudySessionModal = ({ onClose, onSessionSaved, onStartTimer, availableSubjects, preselectedSubject, preselectedDuration }: StudySessionModalProps) => {
  const {
    formData,
    updateField,
    handleSubmit,
    isValid,
    submitButtonRef
  } = useStudySession({
    onSessionSaved,
    preselectedSubject,
    preselectedDuration
  });

  const handleStartTimer = () => {
    if (!formData.subject) return;
    logger.info('StudySessionModal: Iniciando timer com dados:', { 
      data: {
        subject: formData.subject,
        duration: formData.duration,
        type: formData.type,
        notes: formData.notes
      }
    });
    
    onStartTimer(formData);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="tactical-card-enhanced tactical-border-gold-active backdrop-blur-md rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto [&>button]:hidden tactical-modal-backdrop">
        {/* REFINAMENTO: Backdrop blur premium */}
        <div className="fixed inset-0 tactical-modal-backdrop -z-10" />
        
        <div className="animate-fade-in">
          <DialogHeader className="relative pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-tactical-gold/20 tactical-border-gold">
                  <ClipboardCheck className="w-5 h-5 text-tactical-gold" />
                </div>
                <DialogTitle className="font-rajdhani text-xl text-tactical-gold font-bold tracking-tactical">
                  REGISTRAR SESSÃO
                </DialogTitle>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-tactical-disabledGray hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-red-400/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {preselectedSubject && (
              <div className="mt-3 p-3 bg-tactical-gold/10 tactical-border-gold rounded-lg">
                <p className="description-text text-tactical-gold">
                  📚 Sessão iniciada de: <span className="font-semibold">{preselectedSubject}</span>
                </p>
              </div>
            )}
          </DialogHeader>

          <div className="pb-4">
            <StudySessionForm
              formData={formData}
              availableSubjects={availableSubjects}
              onFieldChange={updateField}
              onSubmit={handleSubmit}
              onStartTimer={handleStartTimer}
              onCancel={onClose}
              isValid={isValid}
              submitButtonRef={submitButtonRef}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudySessionModal;
