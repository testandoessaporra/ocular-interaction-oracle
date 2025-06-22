
import { useState, useRef } from 'react';
import { useGamification } from '@/hooks/useGamification';

interface StudySessionData {
  subject: string;
  duration: number;
  type: string;
  notes: string;
}

interface UseStudySessionProps {
  onSessionSaved: (session: { subject: string; date: string; duration: number; type: string; notes?: string }) => void;
  preselectedSubject?: string;
  preselectedDuration?: number;
}

export const useStudySession = ({ onSessionSaved, preselectedSubject, preselectedDuration }: UseStudySessionProps) => {
  const [formData, setFormData] = useState<StudySessionData>({
    subject: preselectedSubject || '',
    duration: preselectedDuration || 60,
    type: 'Teoria',
    notes: ''
  });

  const { playXPSound } = useGamification();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const updateField = (field: keyof StudySessionData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.duration || !formData.type) return;

    // Visual and sound effects (SEM XP FLUTUANTE NO MOUSE)
    if (submitButtonRef.current) {
      submitButtonRef.current.classList.add('button-press');
      setTimeout(() => {
        submitButtonRef.current?.classList.remove('button-press');
      }, 200);
    }
    
    playXPSound();

    onSessionSaved({
      subject: formData.subject,
      date: new Date().toISOString().split('T')[0],
      duration: formData.duration,
      type: formData.type,
      notes: formData.notes.trim() || undefined
    });
  };

  const isValid = Boolean(formData.subject && formData.duration && formData.type);

  return {
    formData,
    updateField,
    handleSubmit,
    isValid,
    submitButtonRef
  };
};
