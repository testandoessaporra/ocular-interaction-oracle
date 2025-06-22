
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Contest } from '@/types/contest';
import { useUser } from '@/contexts/UserContext';
;
import { useToast } from '@/hooks/use-toast';
import ExamSyllabusModal from './ExamSyllabusModal';
import { CheckCircle, Circle, Eye, Target, Calendar, FileText } from '@/components/icons';

interface ContestCardProps {
  contest: Contest;
}

const ContestCard = ({ contest }: ContestCardProps) => {
  const { targetExam, setTargetExam } = useUser();
  const { toast } = useToast();
  const [showSyllabus, setShowSyllabus] = useState(false);
  const isSelected = targetExam === contest.id;

  const handleSetTarget = () => {
    if (isSelected) {
      setTargetExam(null);
      toast({
        title: "🎯 Objetivo Removido",
        description: "Você pode definir um novo objetivo a qualquer momento.",
        duration: 2000,
      });
    } else {
      setTargetExam(contest.id);
      toast({
        title: "🎯 Objetivo Definido!",
        description: `${contest.name} agora é seu foco principal de estudos.`,
        duration: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'upcoming': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'closed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Inscrições Abertas';
      case 'upcoming': return 'Em Breve';
      case 'closed': return 'Encerrado';
      default: return 'Indefinido';
    }
  };

  return (
    <>
      <Card className={`
        tactical-card border-2 transition-all duration-300 cursor-pointer h-full
        hover:scale-102 hover:shadow-xl group relative overflow-hidden
        ${isSelected 
          ? 'border-yellow-500/80 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 shadow-yellow-500/20' 
          : 'border-gray-600/30 hover:border-yellow-500/50'
        }
      `}>
        {/* Background Gradient Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${contest.color} opacity-5`}></div>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-yellow-500 text-black p-1 rounded-full">
              <Target className="w-4 h-4" />
            </div>
          </div>
        )}

        <CardContent className="p-6 relative z-10 h-full flex flex-col">
          {/* Header with Logo and Status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {contest.logoUrl && (
                <img 
                  src={contest.logoUrl} 
                  alt={`Logo ${contest.name}`}
                  className="w-12 h-12 object-contain rounded-lg bg-white/10 p-1"
                />
              )}
              <div>
                <h3 className="tactical-title text-xl font-bold text-yellow-400">{contest.name}</h3>
                <p className="text-gray-400 text-sm">{contest.institution}</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(contest.status)} text-xs tactical-data-display`}>
              {getStatusText(contest.status)}
            </Badge>
          </div>

          {/* Contest Full Name */}
          <h4 className="text-gray-300 font-medium mb-4 leading-tight">
            {contest.fullName}
          </h4>

          {/* Contest Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Questões</span>
              </div>
              <p className="tactical-data-display text-lg text-white">{contest.totalQuestions || '---'}</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Previsão</span>
              </div>
              <p className="tactical-data-display text-lg text-white">{contest.examDate || '---'}</p>
            </div>
          </div>

          {/* Disciplines Count */}
          <div className="bg-gray-800/30 rounded-lg p-3 mb-6 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Disciplinas</span>
              <span className="tactical-data-display text-yellow-400 font-bold">
                {contest.subjects.length}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-auto">
            <Button
              onClick={() => setShowSyllabus(true)}
              variant="outline"
              className="w-full tactical-button border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Edital Completo
            </Button>

            <Button
              onClick={handleSetTarget}
              className={`
                w-full tactical-button transition-all duration-300 font-bold
                ${isSelected 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-black' 
                  : 'bg-gray-700 hover:bg-yellow-600 text-white hover:text-black border border-yellow-600/30 hover:border-yellow-600'
                }
              `}
            >
              {isSelected ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Objetivo Definido
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Definir como Objetivo
                </>
              )}
            </Button>
          </div>
        </CardContent>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 to-yellow-400/0 group-hover:from-yellow-400/5 group-hover:to-orange-400/5 transition-all duration-300 pointer-events-none"></div>
      </Card>

      {/* Syllabus Modal */}
      {showSyllabus && (
        <ExamSyllabusModal
          contestId={contest.id}
          contestName={contest.fullName}
          onClose={() => setShowSyllabus(false)}
        />
      )}
    </>
  );
};

export default ContestCard;
