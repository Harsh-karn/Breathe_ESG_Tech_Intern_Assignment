import { useEffect, useState } from 'react';
import { fetchTenants, fetchRecords } from './lib/api';
import UploadSection from './components/UploadSection';
import ReviewInbox from './components/ReviewInbox';
import { Leaf } from 'lucide-react';

function App() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<number | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const t = await fetchTenants();
      setTenants(t);
      if (t.length > 0 && !selectedTenant) setSelectedTenant(t[0].id);
      
      const r = await fetchRecords();
      setRecords(r);
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Breathe ESG <span className="font-light text-gray-500">Ingestion</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Active Tenant:</span>
            <select 
              className="bg-gray-100 border-none rounded-lg px-3 py-1.5 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-primary outline-none"
              value={selectedTenant || ''} 
              onChange={e => setSelectedTenant(Number(e.target.value))}
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <UploadSection tenantId={selectedTenant} onUploadSuccess={loadData} />
        <ReviewInbox records={records} onRefresh={loadData} />
      </main>
    </div>
  );
}

export default App;
