
export const SUBJECT_COLORS = {
  'Legislação de Trânsito': 'bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500/30 text-blue-300 hover:from-gray-700 hover:to-gray-800 hover:border-blue-400/50',
  'Língua Portuguesa': 'bg-gradient-to-br from-gray-800 to-gray-900 border-emerald-500/30 text-emerald-300 hover:from-gray-700 hover:to-gray-800 hover:border-emerald-400/50',
  'Raciocínio Lógico-Matemático': 'bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/30 text-purple-300 hover:from-gray-700 hover:to-gray-800 hover:border-purple-400/50',
  'Noções de Física': 'bg-gradient-to-br from-gray-800 to-gray-900 border-red-500/30 text-red-300 hover:from-gray-700 hover:to-gray-800 hover:border-red-400/50',
  'Noções de Direito Penal': 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-500/30 text-amber-300 hover:from-gray-700 hover:to-gray-800 hover:border-amber-400/50',
  'Informática': 'bg-gradient-to-br from-gray-800 to-gray-900 border-green-500/30 text-green-300 hover:from-gray-700 hover:to-gray-800 hover:border-green-400/50',
  'Direitos Humanos e Cidadania': 'bg-gradient-to-br from-gray-800 to-gray-900 border-pink-500/30 text-pink-300 hover:from-gray-700 hover:to-gray-800 hover:border-pink-400/50',
  'Noções de Direito Constitucional': 'bg-gradient-to-br from-gray-800 to-gray-900 border-sky-500/30 text-sky-300 hover:from-gray-700 hover:to-gray-800 hover:border-sky-400/50',
  'Noções de Direito Administrativo': 'bg-gradient-to-br from-gray-800 to-gray-900 border-orange-500/30 text-orange-300 hover:from-gray-700 hover:to-gray-800 hover:border-orange-400/50',
  'Legislação Especial': 'bg-gradient-to-br from-gray-800 to-gray-900 border-indigo-500/30 text-indigo-300 hover:from-gray-700 hover:to-gray-800 hover:border-indigo-400/50',
  'Direito Processual Penal': 'bg-gradient-to-br from-gray-800 to-gray-900 border-rose-500/30 text-rose-300 hover:from-gray-700 hover:to-gray-800 hover:border-rose-400/50',
  'Ética no Serviço Público': 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-500/30 text-gray-300 hover:from-gray-700 hover:to-gray-800 hover:border-gray-400/50',
  'Geopolítica Brasileira': 'bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-500/30 text-yellow-300 hover:from-gray-700 hover:to-gray-800 hover:border-yellow-400/50',
  'História da PRF': 'bg-gradient-to-br from-gray-800 to-gray-900 border-teal-500/30 text-teal-300 hover:from-gray-700 hover:to-gray-800 hover:border-teal-400/50'
} as const;

export const SUBJECT_BORDER_COLORS = {
  'Legislação de Trânsito': 'border-blue-500/60',
  'Língua Portuguesa': 'border-emerald-500/60',
  'Raciocínio Lógico-Matemático': 'border-purple-500/60',
  'Noções de Física': 'border-red-500/60',
  'Noções de Direito Penal': 'border-amber-500/60',
  'Informática': 'border-green-500/60',
  'Direitos Humanos e Cidadania': 'border-pink-500/60',
  'Noções de Direito Constitucional': 'border-sky-500/60',
  'Noções de Direito Administrativo': 'border-orange-500/60',
  'Legislação Especial': 'border-indigo-500/60',
  'Direito Processual Penal': 'border-rose-500/60',
  'Ética no Serviço Público': 'border-gray-500/60',
  'Geopolítica Brasileira': 'border-yellow-500/60',
  'História da PRF': 'border-teal-500/60'
} as const;

export const getSubjectColor = (subject: string): string => {
  return SUBJECT_COLORS[subject as keyof typeof SUBJECT_COLORS] || 
         'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-500/30 text-gray-300 hover:from-gray-700 hover:to-gray-800 hover:border-gray-400/50';
};

export const getSubjectBorderColor = (subject: string): string => {
  return SUBJECT_BORDER_COLORS[subject as keyof typeof SUBJECT_BORDER_COLORS] || 
         'border-gray-500/60';
};
