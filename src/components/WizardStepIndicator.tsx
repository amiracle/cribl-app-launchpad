const STEPS = ['App Identity', 'Logging', 'Routing', 'Review'];

interface WizardStepIndicatorProps {
  currentStep: number;
}

export function WizardStepIndicator({ currentStep }: WizardStepIndicatorProps) {
  return (
    <div className="wizard-steps">
      {STEPS.map((label, i) => (
        <div
          key={label}
          className={`wizard-step-item ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
        >
          <div className="wizard-step-number">
            {i < currentStep ? (
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M16.5 5.5L7.5 14.5L3.5 10.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span className="wizard-step-label">{label}</span>
          {i < STEPS.length - 1 && <div className="wizard-step-connector" />}
        </div>
      ))}
    </div>
  );
}
