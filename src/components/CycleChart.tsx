
;
import { TacticalRadar } from '@/components/TacticalIcons';
import { Clock } from '@/components/icons';

interface Subject {
  name: string;
  weight: number;
  color?: string;
}

interface CycleChartProps {
  subjects: Subject[];
  weeklyHours: number;
}

const getSubjectColor = (subject: string) => {
  const colorMap: { [key: string]: string } = {
    'Legislação de Trânsito': 'bg-blue-700',
    'Língua Portuguesa': 'bg-emerald-700',
    'Raciocínio Lógico-Matemático': 'bg-purple-700',
    'Noções de Física': 'bg-red-700',
    'Noções de Direito Penal': 'bg-amber-700',
    'Informática': 'bg-green-700',
    'Direitos Humanos e Cidadania': 'bg-pink-700',
    'Noções de Direito Constitucional': 'bg-sky-700',
    'Noções de Direito Administrativo': 'bg-orange-800',
    'Legislação Especial': 'bg-indigo-700',
    'Direito Processual Penal': 'bg-rose-700',
    'Ética no Serviço Público': 'bg-gray-700',
    'Geopolítica Brasileira': 'bg-orange-700',
    'História da PRF': 'bg-teal-700'
  };
  
  return colorMap[subject] || 'bg-gray-600';
};

const CycleChart = ({ subjects, weeklyHours }: CycleChartProps) => {
  if (!subjects || subjects.length === 0) return null;

  const totalWeight = subjects.reduce((sum, subject) => sum + subject.weight, 0);

  return (
    <div className="tactical-card rounded-xl p-6 md:p-8 shadow-xl border border-yellow-400/30 bg-gray-900/80">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <div className="p-2 md:p-3 bg-gray-800/80 rounded-xl shadow-lg border border-yellow-400/30">
          <TacticalRadar className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="tactical-title text-lg md:text-xl text-yellow-400 mb-1">
            DISTRIBUIÇÃO DE DISCIPLINAS
          </h3>
          <p className="tactical-body text-xs md:text-sm text-gray-400">
            Análise tática do ciclo de estudos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {subjects.map((subject, index) => {
          const percentage = ((subject.weight / totalWeight) * 100).toFixed(0);
          const hours = ((subject.weight / totalWeight) * weeklyHours).toFixed(1);
          const colorClass = getSubjectColor(subject.name);
          
          return (
            <div key={index} className="bg-gray-800/80 border border-yellow-400/20 rounded-xl p-4 hover:bg-gray-800/60 hover:border-yellow-400/40 transition-all duration-300 group">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-3 h-8 md:w-4 md:h-10 ${colorClass} rounded-lg flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow border border-gray-600/50`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="tactical-body text-xs md:text-sm font-semibold truncate text-gray-200 mb-2">
                    {subject.name}
                  </h4>
                  <div className="flex items-center gap-3 md:gap-4 mt-2">
                    <div className="flex items-center gap-1 md:gap-2">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                      <span className="tactical-data text-xs md:text-sm font-mono text-yellow-300">{hours}h</span>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 text-yellow-100 text-xs px-2 md:px-3 py-1 rounded-full font-bold tactical-data shadow-sm border border-yellow-400/30">
                      {percentage}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CycleChart;
