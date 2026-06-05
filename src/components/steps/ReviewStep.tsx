import { useState } from 'react';
import type { AppConfig } from '../../types';
import { SECURITY_EVENT_PATTERNS } from '../../types';
import { generateTicketPayload, submitTicket } from '../../services/servicenow';
import { saveConfig } from '../../services/kvstore';
import { Button } from '../ui/Button';

interface ReviewStepProps {
  config: AppConfig;
  onSaved: () => void;
}

export function ReviewStep({ config, onSaved }: ReviewStepProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const ticket = generateTicketPayload(config);
  const { identity, logging, routing } = config;

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveConfig(config);
      setSaved(true);
      onSaved();
    } catch {
      alert('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitToServiceNow = async () => {
    setSubmitting(true);
    setSubmitResult(null);
    const result = await submitTicket(ticket, '');
    if (result.success) {
      setSubmitResult({ success: true, message: `Ticket created: ${result.number}` });
    } else {
      setSubmitResult({ success: false, message: result.error || 'Submission failed' });
    }
    setSubmitting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(ticket, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPatternLabel = (value: string) =>
    SECURITY_EVENT_PATTERNS.find((p) => p.value === value)?.label || value;

  return (
    <div className="wizard-step-content">
      <h2>Review & Generate</h2>
      <p className="step-description">
        Review your configuration below. When you're ready, save it and generate your ServiceNow
        onboarding ticket.
      </p>

      <div className="review-sections">
        <div className="review-section">
          <h3>App Identity</h3>
          <dl className="review-list">
            <dt>Application Name</dt><dd>{identity.appName}</dd>
            <dt>App ID</dt><dd><code>{identity.appId}</code></dd>
            <dt>Owner</dt><dd>{identity.owner} ({identity.ownerEmail})</dd>
            <dt>Team</dt><dd>{identity.team}</dd>
            <dt>Business Unit</dt><dd>{identity.businessUnit}</dd>
            <dt>Environment</dt><dd className="capitalize">{identity.environment}</dd>
            {identity.description && <><dt>Description</dt><dd>{identity.description}</dd></>}
          </dl>
        </div>

        <div className="review-section">
          <h3>Logging Configuration</h3>
          <dl className="review-list">
            <dt>Format</dt><dd>{logging.logFormat.toUpperCase()}</dd>
            <dt>Log Levels</dt><dd>{logging.logLevels.join(', ')}</dd>
            <dt>Key Fields</dt><dd>{logging.keyFields.join(', ')}</dd>
            {logging.loggingFramework && <><dt>Framework</dt><dd>{logging.loggingFramework}</dd></>}
          </dl>
        </div>

        <div className="review-section">
          <h3>Routing & Destinations</h3>
          <dl className="review-list">
            <dt>Operations Monitoring</dt>
            <dd>{routing.routeToOps ? `Enabled${routing.opsDestination ? ` (${routing.opsDestination})` : ''}` : 'Disabled'}</dd>
            <dt>Security Operations</dt>
            <dd>{routing.routeToSecOps ? `Enabled${routing.secOpsDestination ? ` (${routing.secOpsDestination})` : ''}` : 'Disabled'}</dd>
            {routing.securityEventPatterns.length > 0 && (
              <><dt>Security Patterns</dt><dd>{routing.securityEventPatterns.map(getPatternLabel).join(', ')}</dd></>
            )}
            <dt>Retention</dt><dd>{routing.retentionDays} days</dd>
            <dt>Error Alerting</dt><dd>{routing.alertOnErrors ? 'Enabled' : 'Disabled'}</dd>
          </dl>
        </div>
      </div>

      <div className="review-actions">
        <Button onClick={handleSave} disabled={saving || saved}>
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Configuration'}
        </Button>

        <Button variant="secondary" onClick={() => setShowJson(!showJson)}>
          {showJson ? 'Hide' : 'Show'} ServiceNow Payload
        </Button>

        <Button variant="secondary" onClick={handleSubmitToServiceNow} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit to ServiceNow'}
        </Button>
      </div>

      {submitResult && (
        <div className={`submit-result ${submitResult.success ? 'success' : 'error'}`}>
          {submitResult.message}
        </div>
      )}

      {showJson && (
        <div className="json-output">
          <div className="json-header">
            <span>ServiceNow Ticket Payload</span>
            <Button variant="ghost" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <pre className="json-body">{JSON.stringify(ticket, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
