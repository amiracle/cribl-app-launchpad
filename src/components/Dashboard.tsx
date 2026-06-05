import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { AppConfig } from '../types';
import { listConfigs, deleteConfig } from '../services/kvstore';
import { ConfigCard } from './ConfigCard';
import { Button } from './ui/Button';

export function Dashboard() {
  const [configs, setConfigs] = useState<AppConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    const data = await listConfigs();
    setConfigs(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;
    await deleteConfig(id);
    setConfigs(configs.filter((c) => c.id !== id));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Application Configurations</h1>
          <p className="dashboard-subtitle">
            Manage your application logging configurations and ServiceNow onboarding tickets.
          </p>
        </div>
        <Link to="/wizard">
          <Button>+ New Application</Button>
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading configurations...</div>
      ) : configs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#e0e0e0"/>
              <path d="M2 17l10 5 10-5" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>No applications configured yet</h2>
          <p>Get started by adding your first application. We'll help you set up proper logging and generate a ServiceNow ticket for onboarding.</p>
          <Link to="/wizard">
            <Button>+ Add Your First Application</Button>
          </Link>
        </div>
      ) : (
        <div className="config-grid">
          {configs.map((config) => (
            <ConfigCard key={config.id} config={config} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
