import type { AppIdentity } from '../../types';
import { BUSINESS_UNITS } from '../../types';
import { FormField } from '../ui/FormField';

interface IdentityStepProps {
  data: AppIdentity;
  onChange: (data: AppIdentity) => void;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function IdentityStep({ data, onChange }: IdentityStepProps) {
  const update = (field: keyof AppIdentity, value: string) => {
    const next = { ...data, [field]: value };
    if (field === 'appName' && data.appId === toSlug(data.appName)) {
      next.appId = toSlug(value);
    }
    onChange(next);
  };

  return (
    <div className="wizard-step-content">
      <h2>App Identity</h2>
      <p className="step-description">
        Tell us about the application you're onboarding. This information will be used to tag your
        logs and register your app in the CMDB.
      </p>

      <div className="form-grid">
        <FormField label="Application Name" required description="A human-readable name for your application">
          <input
            type="text"
            value={data.appName}
            onChange={(e) => update('appName', e.target.value)}
            placeholder="e.g. Customer Portal"
          />
        </FormField>

        <FormField label="App ID" required description="A machine-friendly identifier (auto-generated from name)">
          <input
            type="text"
            value={data.appId}
            onChange={(e) => update('appId', e.target.value)}
            placeholder="e.g. customer-portal"
          />
        </FormField>

        <FormField label="Owner Name" required description="The person responsible for this application">
          <input
            type="text"
            value={data.owner}
            onChange={(e) => update('owner', e.target.value)}
            placeholder="e.g. Jane Smith"
          />
        </FormField>

        <FormField label="Owner Email" required description="Contact email for the application owner">
          <input
            type="email"
            value={data.ownerEmail}
            onChange={(e) => update('ownerEmail', e.target.value)}
            placeholder="e.g. jane.smith@company.com"
          />
        </FormField>

        <FormField label="Team" required description="The team that owns and maintains this application">
          <input
            type="text"
            value={data.team}
            onChange={(e) => update('team', e.target.value)}
            placeholder="e.g. Platform Engineering"
          />
        </FormField>

        <FormField label="Business Unit" required description="Which part of the organization does this app belong to?">
          <select value={data.businessUnit} onChange={(e) => update('businessUnit', e.target.value)}>
            <option value="">Select a business unit...</option>
            {BUSINESS_UNITS.map((bu) => (
              <option key={bu} value={bu}>{bu}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Environment" required description="Which environment is this configuration for?">
          <select value={data.environment} onChange={(e) => update('environment', e.target.value as AppIdentity['environment'])}>
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </FormField>

        <FormField label="Description" description="A brief description of what this application does (optional)">
          <textarea
            value={data.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="e.g. Handles customer account management and billing"
            rows={3}
          />
        </FormField>
      </div>
    </div>
  );
}
