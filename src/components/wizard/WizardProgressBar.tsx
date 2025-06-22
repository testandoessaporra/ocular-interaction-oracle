
interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const WizardProgressBar = ({ currentStep, totalSteps }: WizardProgressBarProps) => {
  return (
    <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
      <div 
        className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-500"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  );
};

export default WizardProgressBar;
