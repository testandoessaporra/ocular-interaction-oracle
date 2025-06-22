
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from '@/components/icons';
;

interface WeeklyHoursSelectorProps {
  weeklyHours: number;
  onHoursChange: (hours: number) => void;
}

const WeeklyHoursSelector = ({ weeklyHours, onHoursChange }: WeeklyHoursSelectorProps) => {
  return (
    <Card className="tactical-card border-yellow-600/20">
      <CardHeader className="pb-3">
        <CardTitle className="tactical-title text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-600" />
          2. Carga Horária Semanal
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3 mb-3">
          <Label htmlFor="hours" className="tactical-label text-xs">Horas por semana:</Label>
          <Input
            id="hours"
            type="number"
            value={weeklyHours}
            onChange={(e) => onHoursChange(Number(e.target.value))}
            min={1}
            max={80}
            className="w-28 bg-white border-yellow-600/30 text-gray-800 focus:border-yellow-600 focus:ring-yellow-600"
          />
        </div>
        <div className="tactical-body text-xs">
          <p>Os blocos serão distribuídos automaticamente por peso e intercalados nas durações: 45min, 1h, 1h15min, 1h30min e 1h45min</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyHoursSelector;
