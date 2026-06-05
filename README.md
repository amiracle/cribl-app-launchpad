# Cribl Launchpad

Cribl Launchpad is a [Cribl App Platform](https://docs.cribl.io/apps/) application that helps non-technical application owners set up proper observability for their self-created applications. Whether you built your app with an AI coding assistant, a low-code platform, or with help from a developer friend, Launchpad walks you through everything needed to get your application's logs properly configured and routed to the right teams.

## The Problem

Organizations are seeing a surge of "vibe coded" applications — tools built by business users, citizen developers, and teams using AI assistants. These applications often ship without proper logging, without ownership tags, and without any plan for how operational and security teams will monitor them. When something goes wrong, nobody knows who owns the app, what it logs, or where to look.

## What Launchpad Does

Launchpad provides a guided, step-by-step wizard that collects everything needed to onboard an application into your organization's observability stack:

**Step 1 — App Identity**
Register your application with a name, owner, team, business unit, and environment. This information feeds into your CMDB and ensures the right people get paged when something breaks.

**Step 2 — Logging Configuration**
Describe how your application logs: what format (JSON, syslog, etc.), which severity levels it emits, and what fields are in each log entry. Sensible defaults are pre-filled so you don't need to be a logging expert.

**Step 3 — Routing & Destinations**
Choose where your telemetry goes. Most applications route to both Operations (for uptime and performance monitoring) and Security Operations (for audit, compliance, and threat detection). Pick which security event patterns to detect — authentication failures, privilege escalation, sensitive data access, and more.

**Step 4 — Review & Generate**
Review your configuration, save it for future reference, and generate a ServiceNow onboarding ticket. You can copy the ticket payload to paste into ServiceNow manually, or submit it directly if your organization has configured the integration.

## Who Is This For

- **Business users** who built an internal tool and need to "make it official"
- **Citizen developers** who used AI assistants or low-code platforms to create applications
- **Team leads** responsible for ensuring their team's apps meet observability standards
- **Platform teams** who want a self-service path for application onboarding instead of manual intake

## Key Features

- **Guided wizard** — No observability expertise required. Plain-English descriptions explain every field.
- **Smart defaults** — JSON logging, standard severity levels, and common key fields are pre-filled.
- **Saved configurations** — Configurations persist in Cribl's KV Store so you can revisit and update them.
- **ServiceNow integration** — Generate a properly formatted onboarding ticket with all CMDB fields populated, or submit directly via API.
- **Dual routing** — Configure telemetry to flow to both Ops and SecOps with appropriate filtering.

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Package for Cribl App Platform (.tgz)
npm run package
```

## Installing in Cribl

1. Run `npm run package` to produce a `.tgz` bundle in the `build/` directory.
2. In the Cribl UI, navigate to Apps and click "Add App."
3. Upload the `.tgz` file.
4. (Optional) Configure your ServiceNow instance domain in `config/proxies.yml` before packaging to enable direct ticket submission.

## ServiceNow Integration

Launchpad can generate ServiceNow tickets in two ways:

1. **Copy & paste** — The Review step shows the full ticket payload as formatted JSON. Copy it and create the ticket manually.
2. **Direct submission** — Uncomment and configure the ServiceNow domain in `config/proxies.yml`, store your credentials in the app's KV Store, and submit tickets directly from the wizard.

## Tech Stack

- React 19 + TypeScript
- Vite (build tooling)
- React Router (client-side navigation)
- Cribl App Platform APIs (KV Store, Proxy)
