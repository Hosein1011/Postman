'use client';

import React, { useRef } from 'react';
import TabHeader from '../components/TabHeader';
import RequestBar from '../components/RequestBar';
import ResponsePanel from '../components/ResponsePanel';
import { useApp } from '../context/AppContext';
import CollectionsSidebar from '../components/CollectionsSidebar';

export default function Home() {
  const { darkMode, setDarkMode, tabs } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export: download current state as JSON
  const handleExport = () => {
    const data = JSON.stringify({ tabs }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portman-collection.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import: read file and replace tabs
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.tabs && Array.isArray(json.tabs)) {
          // Replace the entire tabs state
          // We need to access the context's setTabs – we'll assume it exists or we'll need to add it.
          // Since we only have setTabs via update functions, we'll use localStorage trick:
          localStorage.setItem('portman-tabs', JSON.stringify(json.tabs));
          window.location.reload(); // quick way to apply; better: add setTabs to context
        } else {
          alert('Invalid collection file: missing tabs array');
        }
      } catch {
        alert('Could not parse the file. Please upload a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
<aside className="hidden lg:flex flex-col w-64 border-r border-teal/20 bg-deep-900/50 p-4 backdrop-blur-sm">
  {/* Title */}
  <h1 className="text-2xl font-black tracking-wider text-mint mb-6 drop-shadow-sm">
    PORTMAN
  </h1>

  {/* Collections & History UI (replaces the old placeholder) */}
  <div className="flex-1 overflow-hidden">
    <CollectionsSidebar />
  </div>

  {/* Import/Export and Dark Mode at bottom */}
  <div className="space-y-2 mt-4">
    <button onClick={handleExport} className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border border-teal/30 hover:bg-deep-800 transition text-text-muted">
      📤 Export Collection
    </button>
    <button onClick={() => fileInputRef.current?.click()} className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border border-teal/30 hover:bg-deep-800 transition text-text-muted">
      📥 Import Collection
    </button>
    <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="w-full text-center py-2.5 text-xs font-semibold rounded-lg border border-teal/30 hover:bg-deep-800 transition-all duration-200 text-text-muted"
    >
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  </div>
</aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-deep-950">
        <TabHeader />
        <RequestBar />
        <ResponsePanel />

        {/* Mobile dark mode toggle (visible on small screens) */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-deep-800 border border-teal/30 text-text-muted p-3 rounded-full shadow-lg hover:bg-deep-700 transition"
            title="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </main>
    </div>
  );
}