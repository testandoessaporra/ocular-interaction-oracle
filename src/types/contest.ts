
export interface Contest {
  id: string;
  name: string;
  fullName: string;
  institution: string;
  logoUrl?: string;
  color: string;
  subjects: Subject[];
  totalQuestions?: number;
  examDate?: string;
  status: 'active' | 'upcoming' | 'closed';
}

export interface Subject {
  name: string;
  weight?: number;
  questions?: number;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  subtopics?: string[];
  isCustom?: boolean;
  isEdited?: boolean;
  position?: number;
}

export interface ExamSyllabus {
  examId: string;
  subjects: SubjectWithTopics[];
  isCustomized?: boolean;
}

export interface SubjectWithTopics extends Subject {
  topics: Topic[];
  isCustomized?: boolean;
}

export interface CustomSyllabusData {
  [examId: string]: {
    [subjectName: string]: Topic[];
  };
}
