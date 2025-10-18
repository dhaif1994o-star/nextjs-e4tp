'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl =
          typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://nextjs-e4tp-yx8g.vercel.app';

        const res = await fetch(`${baseUrl}/api/test`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const json = await res.json();
        setData(json);
      } catch {
        setError('❌ Connection failed: Failed to fetch');
      }
    }

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black">
      <h1 className="text-3xl font-bold mb-4">Jazan AI Web</h1>

      {error && <p className="text-red-500">{error}</p>}

      {data ? (
        <pre className="text-green-500 bg-gray-800 p-4 rounded text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        !error && <p className="text-gray-500">Connecting to API...</p>
      )}
    </main>
  );
}
