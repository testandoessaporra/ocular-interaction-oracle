
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
;
import { Subject } from '@/types/cycle';
import { Clock, Target, BookOpen, Settings } from '@/components/icons';

interface SubjectConfigurationProps {
  subjects: Subject[];
  onSubjectsChange: (subjects: Subject[]) => void;
}

const SubjectConfiguration = ({ subjects, onSubjectsChange }: SubjectConfigurationProps) => {
  const updateSubject = (index: number, field: keyof Subject, value: any) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    onSubjectsChange(updatedSubjects);
  };

  const getPriorityColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Alta': return 'bg-red-100 text-red-700 border-red-300';
      case 'Média': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Baixa': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Alta': return <Target className="w-3 h-3" />;
      case 'Média': return <Clock className="w-3 h-3" />;
      case 'Baixa': return <BookOpen className="w-3 h-3" />;
      default: return <BookOpen className="w-3 h-3" />;
    }
  };

  return (
    <Card className="tactical-card border-yellow-600/20">
      <CardHeader className="pb-3">
        <CardTitle className="tactical-title text-base flex items-center gap-2">
          <Settings className="w-4 h-4 text-yellow-600" />
          CONFIGURAÇÃO DAS DISCIPLINAS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {subjects.map((subject, index) => {
          const difficulty = subject.difficulty || 'Baixa';
          
          return (
            <div 
              key={index} 
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-600/20 hover:border-yellow-600/40 hover:shadow-md transition-all duration-200"
            >
              {/* Subject Name */}
              <div className="flex-1 min-w-0">
                <Label className="tactical-label block mb-1 text-xs">
                  DISCIPLINA
                </Label>
                <div className="tactical-subtitle text-xs truncate">
                  {subject.name || 'Disciplina'}
                </div>
              </div>

              {/* Hours Input */}
              <div className="w-20">
                <Label className="tactical-label block mb-1 text-xs">
                  HORAS
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={subject.hoursPerWeek || 0}
                    onChange={(e) => updateSubject(index, 'hoursPerWeek', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border-yellow-600/30 text-gray-800 text-center font-bold focus:border-yellow-600 focus:ring-yellow-600 pr-6 text-xs"
                  />
                  <Clock className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                </div>
              </div>

              {/* Difficulty Selector */}
              <div className="w-24">
                <Label className="tactical-label block mb-1 text-xs">
                  DIFICULDADE
                </Label>
                <select
                  value={difficulty}
                  onChange={(e) => updateSubject(index, 'difficulty', e.target.value as 'Baixa' | 'Média' | 'Alta')}
                  className="w-full p-1.5 bg-white border border-yellow-600/30 rounded text-gray-800 text-xs font-medium focus:border-yellow-600 focus:ring-yellow-600 focus:outline-none"
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              {/* Priority Badge */}
              <div className="flex items-center">
                <Badge 
                  className={`px-2 py-0.5 text-xs font-bold border ${getPriorityColor(difficulty)} flex items-center gap-1`}
                >
                  {getPriorityIcon(difficulty)}
                  {difficulty.toUpperCase()}
                </Badge>
              </div>
            </div>
          );
        })}

        {/* Summary Stats */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex justify-between items-center">
            <div className="tactical-accent text-xs font-bold">
              RESUMO GERAL
            </div>
            <div className="tactical-body text-xs">
              Total: <span className="tactical-data">{subjects.reduce((sum, s) => sum + (s.hoursPerWeek || 0), 0)}h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectConfiguration;
