import type { RoutingConfig } from '../../types';
import { SECURITY_EVENT_PATTERNS } from '../../types';
import { FormField } from '../ui/FormField';

interface RoutingStepProps {
  data: RoutingConfig;
  onChange: (data: RoutingConfig) => void;
}

export function RoutingStep({ data, onChange }: RoutingStepProps) {
  const update = <K extends keyof RoutingConfig>(field: K, value: RoutingConfig[K]) => {
    onChange({ ...data, [field]: value });
  };

  const togglePattern = (pattern: string) => {
    const patterns = data.securityEventPatterns.includes(pattern)
      ? data.securityEventPatterns.filter((p) => p !== pattern)
      : [...data.securityEventPatterns, pattern];
    update('securityEventPatterns', patterns);
  };

  return (
    <div className="wizard-step-content">
      <h2>Routing & Destinations</h2>
      <p className="step-description">
        Choose where your application's telemetry should be sent. Most applications route logs to
        both Operations (for uptime and performance monitoring) and Security Operations (for audit
        and compliance).
      </p>

      <div className="form-grid">
        <div className="routing-section">
          <h3>Operations Monitoring</h3>
          <FormField label="Send to Operations Team" description="Route health, performance, and error logs to your Ops team for monitoring">
            <label className="toggle">
              <input
                type="checkbox"
                checked={data.routeToOps}
                onChange={(e) => update('routeToOps', e.target.checked)}
              />
              <span className="toggle-slider" />
              <span className="toggle-label">{data.routeToOps ? 'Enabled' : 'Disabled'}</span>
            </label>
          </FormField>

          {data.routeToOps && (
            <FormField label="Ops Destination" description="Target index or destination for operations logs (leave blank for default)">
              <input
                type="text"
                value={data.opsDestination}
                onChange={(e) => update('opsDestination', e.target.value)}
                placeholder="e.g. ops-monitoring-index"
              />
            </FormField>
          )}

          <FormField label="Alert on Errors" description="Automatically create alerts when error rates exceed thresholds">
            <label className="toggle">
              <input
                type="checkbox"
                checked={data.alertOnErrors}
                onChange={(e) => update('alertOnErrors', e.target.checked)}
              />
              <span className="toggle-slider" />
              <span className="toggle-label">{data.alertOnErrors ? 'Enabled' : 'Disabled'}</span>
            </label>
          </FormField>
        </div>

        <div className="routing-section">
          <h3>Security Operations</h3>
          <FormField label="Send to SecOps Team" description="Route security-relevant events to your Security Operations team">
            <label className="toggle">
              <input
                type="checkbox"
                checked={data.routeToSecOps}
                onChange={(e) => update('routeToSecOps', e.target.checked)}
              />
              <span className="toggle-slider" />
              <span className="toggle-label">{data.routeToSecOps ? 'Enabled' : 'Disabled'}</span>
            </label>
          </FormField>

          {data.routeToSecOps && (
            <>
              <FormField label="SecOps Destination" description="Target index or destination for security events (leave blank for default)">
                <input
                  type="text"
                  value={data.secOpsDestination}
                  onChange={(e) => update('secOpsDestination', e.target.value)}
                  placeholder="e.g. security-events-index"
                />
              </FormField>

              <FormField label="Security Event Patterns" description="Which types of security events should be detected and forwarded?">
                <div className="checkbox-group">
                  {SECURITY_EVENT_PATTERNS.map(({ value, label }) => (
                    <label key={value} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={data.securityEventPatterns.includes(value)}
                        onChange={() => togglePattern(value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </>
          )}
        </div>

        <FormField label="Log Retention" description="How many days should logs be retained?">
          <div className="retention-input">
            <input
              type="number"
              min={1}
              max={365}
              value={data.retentionDays}
              onChange={(e) => update('retentionDays', parseInt(e.target.value) || 30)}
            />
            <span className="retention-suffix">days</span>
          </div>
        </FormField>
      </div>
    </div>
  );
}
