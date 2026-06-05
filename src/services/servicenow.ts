import type { AppConfig, ServiceNowTicket } from '../types';

export function generateTicketPayload(config: AppConfig): ServiceNowTicket {
  const { identity, logging, routing } = config;

  const priorityMap: Record<string, string> = {
    production: '2 - High',
    staging: '3 - Moderate',
    development: '4 - Low',
  };

  const descriptionLines = [
    `Application Onboarding Request`,
    ``,
    `== Application Details ==`,
    `Name: ${identity.appName}`,
    `App ID: ${identity.appId}`,
    `Owner: ${identity.owner} (${identity.ownerEmail})`,
    `Team: ${identity.team}`,
    `Business Unit: ${identity.businessUnit}`,
    `Environment: ${identity.environment}`,
    identity.description ? `Description: ${identity.description}` : '',
    ``,
    `== Logging Configuration ==`,
    `Format: ${logging.logFormat.toUpperCase()}`,
    `Log Levels: ${logging.logLevels.join(', ')}`,
    `Key Fields: ${logging.keyFields.join(', ')}`,
    logging.loggingFramework ? `Framework: ${logging.loggingFramework}` : '',
    logging.sampleLogLine ? `Sample: ${logging.sampleLogLine}` : '',
    ``,
    `== Routing & Destinations ==`,
    `Route to Operations: ${routing.routeToOps ? 'Yes' : 'No'}`,
    routing.routeToOps && routing.opsDestination ? `  Destination: ${routing.opsDestination}` : '',
    `Route to SecOps: ${routing.routeToSecOps ? 'Yes' : 'No'}`,
    routing.routeToSecOps && routing.secOpsDestination ? `  Destination: ${routing.secOpsDestination}` : '',
    routing.securityEventPatterns.length > 0 ? `Security Patterns: ${routing.securityEventPatterns.join(', ')}` : '',
    `Retention: ${routing.retentionDays} days`,
    `Alert on Errors: ${routing.alertOnErrors ? 'Yes' : 'No'}`,
  ].filter(Boolean);

  return {
    short_description: `Application Onboarding: ${identity.appName} (${identity.environment})`,
    description: descriptionLines.join('\n'),
    category: 'Software',
    subcategory: 'Application Onboarding',
    assignment_group: 'Platform Engineering',
    cmdb_ci: identity.appId,
    u_app_name: identity.appName,
    u_app_id: identity.appId,
    u_business_unit: identity.businessUnit,
    u_environment: identity.environment,
    u_owner: identity.owner,
    u_owner_email: identity.ownerEmail,
    u_team: identity.team,
    u_log_format: logging.logFormat,
    u_log_levels: logging.logLevels.join(','),
    u_route_to_ops: routing.routeToOps ? 'true' : 'false',
    u_route_to_secops: routing.routeToSecOps ? 'true' : 'false',
    priority: priorityMap[identity.environment] || '3 - Moderate',
  };
}

export async function submitTicket(
  ticket: ServiceNowTicket,
  instanceUrl: string
): Promise<{ success: boolean; number?: string; error?: string }> {
  try {
    const res = await fetch(`${instanceUrl}/api/now/table/incident`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `ServiceNow returned ${res.status}: ${errorText}` };
    }

    const data = await res.json();
    return { success: true, number: data.result?.number || 'Unknown' };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
