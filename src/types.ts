export interface AppIdentity {
  appName: string;
  appId: string;
  owner: string;
  ownerEmail: string;
  team: string;
  businessUnit: string;
  environment: 'development' | 'staging' | 'production';
  description: string;
}

export interface LoggingConfig {
  logFormat: 'json' | 'clf' | 'syslog' | 'custom';
  logLevels: string[];
  keyFields: string[];
  sampleLogLine: string;
  loggingFramework: string;
}

export interface RoutingConfig {
  routeToOps: boolean;
  opsDestination: string;
  routeToSecOps: boolean;
  secOpsDestination: string;
  securityEventPatterns: string[];
  retentionDays: number;
  alertOnErrors: boolean;
}

export interface AppConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'submitted' | 'approved';
  identity: AppIdentity;
  logging: LoggingConfig;
  routing: RoutingConfig;
}

export interface ServiceNowTicket {
  short_description: string;
  description: string;
  category: string;
  subcategory: string;
  assignment_group: string;
  cmdb_ci: string;
  u_app_name: string;
  u_app_id: string;
  u_business_unit: string;
  u_environment: string;
  u_owner: string;
  u_owner_email: string;
  u_team: string;
  u_log_format: string;
  u_log_levels: string;
  u_route_to_ops: string;
  u_route_to_secops: string;
  priority: string;
}

export const DEFAULT_IDENTITY: AppIdentity = {
  appName: '',
  appId: '',
  owner: '',
  ownerEmail: '',
  team: '',
  businessUnit: '',
  environment: 'production',
  description: '',
};

export const DEFAULT_LOGGING: LoggingConfig = {
  logFormat: 'json',
  logLevels: ['INFO', 'WARN', 'ERROR'],
  keyFields: ['timestamp', 'level', 'message', 'service', 'traceId'],
  sampleLogLine: '',
  loggingFramework: '',
};

export const DEFAULT_ROUTING: RoutingConfig = {
  routeToOps: true,
  opsDestination: '',
  routeToSecOps: true,
  secOpsDestination: '',
  securityEventPatterns: ['auth_failures', 'privilege_escalation'],
  retentionDays: 30,
  alertOnErrors: true,
};

export const BUSINESS_UNITS = [
  'Engineering',
  'Product',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'Human Resources',
  'Legal',
  'Customer Success',
  'Other',
];

export const LOG_LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];

export const SECURITY_EVENT_PATTERNS = [
  { value: 'auth_failures', label: 'Authentication Failures' },
  { value: 'privilege_escalation', label: 'Privilege Escalation' },
  { value: 'data_access', label: 'Sensitive Data Access' },
  { value: 'config_changes', label: 'Configuration Changes' },
  { value: 'account_lockouts', label: 'Account Lockouts' },
  { value: 'api_abuse', label: 'API Abuse / Rate Limiting' },
];

export const LOGGING_FRAMEWORKS = [
  'Winston',
  'Pino',
  'Log4j',
  'Bunyan',
  'console.log',
  'Python logging',
  'Serilog',
  'Other',
  'Unknown',
];
