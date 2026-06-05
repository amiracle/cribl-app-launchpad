import type { AppConfig } from '../types';
import { Link } from 'react-router-dom';

interface ConfigCardProps {
  config: AppConfig;
  onDelete: (id: string) => void;
}

export function ConfigCard({ config, onDelete }: ConfigCardProps) {
  const { identity, status } = config;

  return (
    <div className="config-card">
      <div className="config-card-header">
        <h3>{identity.appName}</h3>
        <span className={`status-badge status-${status}`}>{status}</span>
      </div>
      <div className="config-card-body">
        <p><strong>App ID:</strong> <code>{identity.appId}</code></p>
        <p><strong>Owner:</strong> {identity.owner}</p>
        <p><strong>Team:</strong> {identity.team}</p>
        <p><strong>Environment:</strong> <span className="capitalize">{identity.environment}</span></p>
      </div>
      <div className="config-card-footer">
        <Link to={`/config/${config.id}`} className="btn btn-secondary btn-sm">
          View / Edit
        </Link>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(config.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
