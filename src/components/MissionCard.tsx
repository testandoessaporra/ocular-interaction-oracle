
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, CheckCircle2 } from '@/components/icons';
;

interface MissionCardProps {
  subject: string;
  duration: string;
  type: 'MISSÃO TÁTICA' | 'MISSÃO FÍSICA';
  status: 'active' | 'completed' | 'pending';
  onClick?: () => void;
}

const MissionCard = ({ subject, duration, type, status, onClick }: MissionCardProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-yellow-600" />;
      case 'active':
        return <Target className="w-6 h-6 text-yellow-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getCardClass = () => {
    switch (status) {
      case 'completed':
        return 'mission-card-completed cursor-pointer hover:border-yellow-500 transition-all';
      case 'active':
        return 'mission-card-active cursor-pointer hover:border-yellow-500 transition-all';
      default:
        return 'mission-card cursor-pointer hover:border-yellow-500 transition-all';
    }
  };

  const getTypeClass = () => {
    return status === 'completed' ? 'bg-gray-600 text-gray-300' : 'bg-yellow-500 text-black';
  };

  return (
    <Card className={getCardClass()} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          {getStatusIcon()}
          
          <div className="text-2xl font-bold text-gray-800">
            {duration}
          </div>
          
          <Badge className={`text-xs font-bold px-2 py-1 ${getTypeClass()}`}>
            {type}
          </Badge>
          
          <div className="text-sm text-gray-600 font-medium">
            {subject}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionCard;
