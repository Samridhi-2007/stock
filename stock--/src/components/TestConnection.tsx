import { useEffect, useState } from 'react';
import api from '../../src/services/api';

interface HealthResponse {
  status: string;
  timestamp: string;
  environment: string;
}

const TestConnection = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testBackendConnection = async () => {
      setStatus('loading');
      try {
        const response = await api.get<HealthResponse>('/health');
        setData(response.data);
        setStatus('success');
        console.log('Backend connection successful:', response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setStatus('error');
        console.error('Backend connection failed:', err);
      }
    };

    testBackendConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Backend Connection Test</h2>
      {status === 'loading' && <p>Connecting to backend...</p>}
      {status === 'success' && data && (
        <div className="space-y-2">
          <p className="text-green-600">✓ Connected to backend successfully!</p>
          <div className="bg-gray-50 p-3 rounded">
            <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
      {status === 'error' && (
        <p className="text-red-600">Error connecting to backend: {error}</p>
      )}
    </div>
  );
};

export default TestConnection;