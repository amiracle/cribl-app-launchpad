import { Routes, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Wizard } from './components/Wizard';
import { getConfig } from './services/kvstore';
import type { AppConfig } from './types';

function EditConfigPage() {
  const { id } = useParams<{ id: string }>();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getConfig(id).then((c) => {
        setConfig(c);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!config) return <div className="error-state">Configuration not found.</div>;

  return <Wizard initialConfig={config} />;
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wizard" element={<Wizard />} />
        <Route path="/config/:id" element={<EditConfigPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
