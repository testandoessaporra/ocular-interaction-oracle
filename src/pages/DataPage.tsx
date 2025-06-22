
import React, { useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { formatDuration } from '@/utils/blockGenerator';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, TrendingUp, Calendar, BookOpen, Target } from '@/components/icons';

interface StudyRecord {
  id: string;
  subject: string;
  date: string;
  duration: number;
  type: string;
  notes?: string;
}

const DataPage = () => {
  const { studySessions } = useUser();

  // Cálculos de estatísticas
  const stats = useMemo(() => {
    const totalSessions = studySessions.length;
    const totalHours = studySessions.reduce((acc, session) => acc + (session.duration || 0), 0);
    const averageDuration = totalSessions > 0 ? totalHours / totalSessions : 0;
    
    // Horas por matéria
    const hoursBySubject = studySessions.reduce((acc, session) => {
      const duration = session.duration || 0;
      acc[session.subject] = (acc[session.subject] || 0) + duration;
      return acc;
    }, {} as Record<string, number>);

    // Sessões dos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSessions = studySessions.filter(session => 
      new Date(session.date) >= sevenDaysAgo
    );

    return {
      totalSessions,
      totalHours,
      averageDuration,
      hoursBySubject,
      recentSessions: recentSessions.length,
      weeklyHours: recentSessions.reduce((acc, session) => acc + (session.duration || 0), 0)
    };
  }, [studySessions]);

  // Componentes dos cards de estatísticas
  const StatCard = ({ icon: Icon, title, value, subtitle, delay = 0 }: {
    icon: any;
    title: string;
    value: string;
    subtitle: string;
    delay?: number;
  }) => (
    <div className="animate-slide-up-bounce" style={{ animationDelay: `${delay}ms` }}>
      <Card className="tactical-card-enhanced tactical-border-subtle hover:tactical-border-gold transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-tactical-gold/20 tactical-border-gold">
              <Icon className="w-6 h-6 text-tactical-gold" />
            </div>
            <div className="flex-1">
              <p className="tactical-body text-tactical-disabledGray text-sm">{title}</p>
              <p className="tactical-data-display text-tactical-gold text-2xl font-bold">{value}</p>
              <p className="tactical-body text-white text-xs">{subtitle}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Componente para registros de estudo
  const StudyRecordCard = ({ record, index }: { record: StudyRecord; index: number }) => (
    <div className="animate-slide-up-bounce" style={{ animationDelay: `${50 + (index * 50)}ms` }}>
      <Card className="tactical-card-enhanced tactical-border-subtle hover:tactical-border-gold transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-tactical-gold/20">
                <BookOpen className="w-4 h-4 text-tactical-gold" />
              </div>
              <div>
                <h4 className="tactical-element text-white font-medium">{record.subject}</h4>
                <p className="tactical-body text-tactical-disabledGray text-sm">
                  {new Date(record.date).toLocaleDateString('pt-BR')} • {record.type}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="tactical-data-display text-tactical-gold font-semibold">
                {formatDuration(record.duration)}
              </p>
            </div>
          </div>
          {record.notes && (
            <div className="mt-3 pt-3 tactical-border-subtle border-t">
              <p className="tactical-body text-tactical-disabledGray text-sm">{record.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen tactical-bg">
      <div className="tactical-bg border-b border-tactical-mediumGray/50">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-fade-in">
            <h1 className="tactical-command text-3xl text-white mb-2">
              Dados da Operação
            </h1>
            <p className="tactical-body text-tactical-disabledGray">
              Análise completa do desempenho e histórico de estudos
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Target}
            title="Total de Sessões"
            value={stats.totalSessions.toString()}
            subtitle="sessões registradas"
            delay={50}
          />
          <StatCard
            icon={Clock}
            title="Horas Totais"
            value={`${stats.totalHours.toFixed(1)}h`}
            subtitle="tempo acumulado"
            delay={100}
          />
          <StatCard
            icon={TrendingUp}
            title="Média por Sessão"
            value={formatDuration(stats.averageDuration)}
            subtitle="duração média"
            delay={150}
          />
          <StatCard
            icon={Calendar}
            title="Últimos 7 Dias"
            value={`${stats.weeklyHours.toFixed(1)}h`}
            subtitle={`${stats.recentSessions} sessões`}
            delay={200}
          />
        </div>

        {/* Horas por Matéria */}
        {Object.keys(stats.hoursBySubject).length > 0 && (
          <div className="animate-slide-up-bounce" style={{ animationDelay: '300ms' }}>
            <Card className="tactical-card-enhanced tactical-border-subtle">
              <CardHeader className="tactical-border-subtle border-b">
                <CardTitle className="flex items-center gap-3 tactical-command text-tactical-gold">
                  <BarChart3 className="w-5 h-5" />
                  Distribuição por Matéria
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(stats.hoursBySubject)
                    .sort(([,a], [,b]) => (b || 0) - (a || 0))
                    .map(([subject, hours], index) => {
                      const hoursValue = hours || 0;
                      const percentage = stats.totalHours > 0 ? (hoursValue / stats.totalHours) * 100 : 0;
                      return (
                        <div
                          key={subject}
                          className="space-y-2 animate-slide-up-bounce"
                          style={{ animationDelay: `${350 + (index * 50)}ms` }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="tactical-element text-white font-medium">{subject}</span>
                            <span className="tactical-data-display text-tactical-gold">{hoursValue.toFixed(1)}h</span>
                          </div>
                          <div className="h-2 bg-tactical-darkGray rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${percentage}%`, animationDelay: `${400 + (index * 50)}ms` }} 
                              className="h-full tactical-gradient-gold animate-progress-fill"
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Registros de Estudo */}
        <div className="animate-slide-up-bounce" style={{ animationDelay: '400ms' }}>
          <Card className="tactical-card-enhanced tactical-border-subtle">
            <CardHeader className="tactical-border-subtle border-b">
              <CardTitle className="flex items-center gap-3 tactical-command text-tactical-gold">
                <BookOpen className="w-5 h-5" />
                Histórico de Estudos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {studySessions.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto tactical-scrollbar">
                  {studySessions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record, index) => (
                      <StudyRecordCard key={record.id} record={record} index={index} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-tactical-disabledGray mx-auto mb-3" />
                  <p className="tactical-body text-tactical-disabledGray">
                    Nenhum registro de estudo encontrado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataPage;
