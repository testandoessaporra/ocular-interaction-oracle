
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target } from '@/components/icons';
;

interface ExamSelectorProps {
  selectedExam: string;
  onExamChange: (exam: string) => void;
}

const ExamSelector = ({ selectedExam, onExamChange }: ExamSelectorProps) => {
  return (
    <Card className="tactical-card border-yellow-600/20">
      <CardHeader>
        <CardTitle className="tactical-title text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-yellow-600" />
          1. Escolha seu Concurso Alvo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedExam} onValueChange={onExamChange}>
          <SelectTrigger className="w-full bg-white border-yellow-600/30 text-gray-800 focus:border-yellow-600 focus:ring-yellow-600">
            <SelectValue placeholder="Selecione o concurso" />
          </SelectTrigger>
          <SelectContent className="bg-white border-yellow-600/30">
            <SelectItem value="PRF" className="text-gray-800 hover:bg-yellow-50">PRF - Polícia Rodoviária Federal</SelectItem>
            <SelectItem value="PF" className="text-gray-800 hover:bg-yellow-50">PF - Polícia Federal</SelectItem>
            <SelectItem value="PC" className="text-gray-800 hover:bg-yellow-50">PC - Polícia Civil</SelectItem>
            <SelectItem value="PM" className="text-gray-800 hover:bg-yellow-50">PM - Polícia Militar</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default ExamSelector;
