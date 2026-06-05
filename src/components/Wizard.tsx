import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppConfig, AppIdentity, LoggingConfig, RoutingConfig } from '../types';
import { DEFAULT_IDENTITY, DEFAULT_LOGGING, DEFAULT_ROUTING } from '../types';
import { WizardStepIndicator } from './WizardStepIndicator';
import { IdentityStep } from './steps/IdentityStep';
import { LoggingStep } from './steps/LoggingStep';
import { RoutingStep } from './steps/RoutingStep';
import { ReviewStep } from './steps/ReviewStep';
import { Button } from './ui/Button';

interface WizardProps {
  initialConfig?: AppConfig;
}

export function Wizard({ initialConfig }: WizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [identity, setIdentity] = useState<AppIdentity>(initialConfig?.identity || DEFAULT_IDENTITY);
  const [logging, setLogging] = useState<LoggingConfig>(initialConfig?.logging || DEFAULT_LOGGING);
  const [routing, setRouting] = useState<RoutingConfig>(initialConfig?.routing || DEFAULT_ROUTING);

  const config: AppConfig = {
    id: initialConfig?.id || crypto.randomUUID(),
    createdAt: initialConfig?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: initialConfig?.status || 'draft',
    identity,
    logging,
    routing,
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      return !!(identity.appName && identity.appId && identity.owner && identity.ownerEmail && identity.team && identity.businessUnit);
    }
    if (step === 1) {
      return identity.appName.length > 0 && logging.logLevels.length > 0;
    }
    return true;
  };

  const next = () => {
    if (validateStep() && step < 3) setStep(step + 1);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="wizard">
      <WizardStepIndicator currentStep={step} />

      <div className="wizard-body">
        {step === 0 && <IdentityStep data={identity} onChange={setIdentity} />}
        {step === 1 && <LoggingStep data={logging} onChange={setLogging} />}
        {step === 2 && <RoutingStep data={routing} onChange={setRouting} />}
        {step === 3 && <ReviewStep config={config} onSaved={() => navigate('/')} />}
      </div>

      {step < 3 && (
        <div className="wizard-nav">
          <Button variant="secondary" onClick={back} disabled={step === 0}>
            Back
          </Button>
          <Button onClick={next} disabled={!validateStep()}>
            {step === 2 ? 'Review' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}
