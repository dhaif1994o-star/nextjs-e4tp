'use client';

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/test');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError('⚠️ Connection failed');
      }
    }

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Jazan AI Web</h1>

      {error && <p className="text-red-500">{error}</p>}

      {data ? (
        <pre className="text-green-500 bg-gray-800 p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        !error && <p className="text-gray-500">Connecting to API...</p>
      )}
    </main>
  );
}

