
import { ExtendedSubject } from '@/types/cycleWizard';

interface SubjectSelectionFooterProps {
  subjects: ExtendedSubject[];
}

const SubjectSelectionFooter = ({ subjects }: SubjectSelectionFooterProps) => {
  const selectedCount = subjects.filter(s => s.isSelected).length;

  return (
    <div className="text-center">
      <p className="tactical-body text-sm text-gray-400">
        Disciplinas selecionadas: <span className="text-yellow-400 font-bold">
          {selectedCount}
        </span>
      </p>
    </div>
  );
};

export default SubjectSelectionFooter;
