import type { AppConfig } from '../types';

function apiUrl(): string {
  return (window as unknown as { CRIBL_API_URL: string }).CRIBL_API_URL || '';
}

export async function listConfigs(): Promise<AppConfig[]> {
  const res = await fetch(`${apiUrl()}/kvstore/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: 'configs/' }),
  });
  if (!res.ok) return [];
  const keys: string[] = await res.json();

  const configs = await Promise.all(
    keys.map(async (key) => {
      const r = await fetch(`${apiUrl()}/kvstore/${key}`);
      if (!r.ok) return null;
      return r.json() as Promise<AppConfig>;
    })
  );
  return configs.filter((c): c is AppConfig => c !== null);
}

export async function getConfig(id: string): Promise<AppConfig | null> {
  const res = await fetch(`${apiUrl()}/kvstore/configs/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function saveConfig(config: AppConfig): Promise<void> {
  const updated = { ...config, updatedAt: new Date().toISOString() };
  await fetch(`${apiUrl()}/kvstore/configs/${config.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  });
}

export async function deleteConfig(id: string): Promise<void> {
  await fetch(`${apiUrl()}/kvstore/configs/${id}`, { method: 'DELETE' });
}

export async function getServiceNowSettings(): Promise<{ instanceUrl: string } | null> {
  const res = await fetch(`${apiUrl()}/kvstore/settings/servicenow`);
  if (!res.ok) return null;
  return res.json();
}

export async function saveServiceNowSettings(settings: { instanceUrl: string }): Promise<void> {
  await fetch(`${apiUrl()}/kvstore/settings/servicenow`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
}
