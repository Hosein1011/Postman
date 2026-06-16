'use client';

import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function ImportExport() {
  const { collections, setCollections } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = JSON.stringify(collections, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portman-collections.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setCollections(parsed);
          // Also persist to localStorage (already handled in context's useEffect)
        } else {
          alert('Invalid collections file. Expected an array.');
        }
      } catch {
        alert('Could not parse the file. Make sure it is a valid JSON.');
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be imported again
    e.target.value = '';
  };

  // Note: setCollections needs to be exposed from context. Currently we only have setCollections via useState in AppProvider.
  // We need to add setCollections to the context value. See note below.
  // For now, we'll assume it's available; if not, you'll add it to the context.

  return (
    <div className="mt-auto space-y-2">
      <button
        onClick={handleExport}
        className="w-full text-center py-2 text-xs font-semibold rounded-lg border border-teal/30 hover:bg-deep-800 transition-all duration-200 text-text-muted"
      >
        📤 Export Collections
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full text-center py-2 text-xs font-semibold rounded-lg border border-teal/30 hover:bg-deep-800 transition-all duration-200 text-text-muted"
      >
        📥 Import Collections
      </button>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}