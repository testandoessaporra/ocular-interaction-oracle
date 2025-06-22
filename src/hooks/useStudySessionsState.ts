
import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { StudySession } from '@/types/userTypes';
import { createDebouncedSetter } from '@/utils/storageUtils';

export const useStudySessionsState = () => {
  // Memoizar a inicialização das sessões de estudo
  const initialStudySessions = useMemo(() => {
    const storedSessions = localStorage.getItem('studySessions');
    return storedSessions ? JSON.parse(storedSessions) : [];
  }, []);

  const [studySessions, setStudySessions] = useState<StudySession[]>(initialStudySessions);

  // Criar setter com debounce para localStorage
  const debouncedSetStudySessions = useMemo(() => createDebouncedSetter('studySessions'), []);

  // Persistir no localStorage com debouncing
  useEffect(() => {
    debouncedSetStudySessions(studySessions);
  }, [studySessions, debouncedSetStudySessions]);

  const addStudySession = (session: Omit<StudySession, 'id' | 'xp'>, earnedXP: number) => {
    setStudySessions(prevSessions => {
      const newSession: StudySession = {
        id: uuidv4(),
        ...session,
        xp: earnedXP
      };
      return [...prevSessions, newSession];
    });
  };

  return {
    studySessions,
    setStudySessions,
    addStudySession
  };
};
