import type { LoggingConfig } from '../../types';
import { LOG_LEVELS, LOGGING_FRAMEWORKS } from '../../types';
import { FormField } from '../ui/FormField';
import { TagInput } from '../ui/TagInput';

interface LoggingStepProps {
  data: LoggingConfig;
  onChange: (data: LoggingConfig) => void;
}

export function LoggingStep({ data, onChange }: LoggingStepProps) {
  const update = <K extends keyof LoggingConfig>(field: K, value: LoggingConfig[K]) => {
    onChange({ ...data, [field]: value });
  };

  const toggleLevel = (level: string) => {
    const levels = data.logLevels.includes(level)
      ? data.logLevels.filter((l) => l !== level)
      : [...data.logLevels, level];
    update('logLevels', levels);
  };

  return (
    <div className="wizard-step-content">
      <h2>Logging Configuration</h2>
      <p className="step-description">
        Tell us about how your application generates logs. If you're not sure, the defaults
        (JSON format with INFO, WARN, and ERROR levels) are a great starting point.
      </p>

      <div className="form-grid">
        <FormField label="Log Format" required description="What format does your application use for log output?">
          <select value={data.logFormat} onChange={(e) => update('logFormat', e.target.value as LoggingConfig['logFormat'])}>
            <option value="json">JSON (Recommended)</option>
            <option value="clf">Common Log Format (CLF)</option>
            <option value="syslog">Syslog</option>
            <option value="custom">Custom / Other</option>
          </select>
        </FormField>

        <FormField label="Log Levels" required description="Which severity levels does your application emit?">
          <div className="checkbox-group">
            {LOG_LEVELS.map((level) => (
              <label key={level} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={data.logLevels.includes(level)}
                  onChange={() => toggleLevel(level)}
                />
                <span className={`level-badge level-${level.toLowerCase()}`}>{level}</span>
              </label>
            ))}
          </div>
        </FormField>

        <FormField
          label="Key Fields"
          description="What fields are present in each log entry? Type a field name and press Enter to add."
        >
          <TagInput
            value={data.keyFields}
            onChange={(tags) => update('keyFields', tags)}
            placeholder="Add a field name..."
          />
        </FormField>

        <FormField label="Logging Framework" description="Which logging library or framework does your app use? (optional)">
          <select value={data.loggingFramework} onChange={(e) => update('loggingFramework', e.target.value)}>
            <option value="">Not sure / Not applicable</option>
            {LOGGING_FRAMEWORKS.map((fw) => (
              <option key={fw} value={fw}>{fw}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Sample Log Line" description="Paste an example log line from your application (optional, helps us understand your format)">
          <textarea
            value={data.sampleLogLine}
            onChange={(e) => update('sampleLogLine', e.target.value)}
            placeholder='e.g. {"timestamp":"2024-01-15T10:30:00Z","level":"INFO","message":"User logged in","service":"auth-api"}'
            rows={3}
            className="mono"
          />
        </FormField>
      </div>
    </div>
  );
}
