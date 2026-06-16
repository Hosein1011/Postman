'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function CollectionsSidebar() {
  const {
    collections,
    saveCurrentTabsAsCollection,
    deleteCollection,
    loadCollection,
    history,
    clearHistory,
    setActiveTabId,
    addTab,
  } = useApp();

  const handleHistoryClick = (item: { request: any; responseStatus: number | null }) => {
    const newId = crypto.randomUUID();
    addTab({
      id: newId,
      name: item.request.method + ' ' + (item.request.url ? item.request.url.replace(/^https?:\/\//, '') : 'Request'),
      request: { ...item.request },
      response: { status: null, statusText: '', data: null, loading: false, error: null },
    });
    setActiveTabId(newId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Collections Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
          Collections
        </div>
        {collections.length === 0 && (
          <p className="text-xs text-text-muted italic mb-4">No saved collections</p>
        )}
        {collections.map((col) => (
          <div
            key={col.id}
            className="flex items-center group hover:bg-deep-800 rounded px-2 py-1.5 mb-1 transition"
          >
            <button
              onClick={() => loadCollection(col)}
              className="flex-1 text-left text-sm text-text-primary truncate"
              title={`${col.name} (${col.requests.length} requests)`}
            >
              📁 {col.name} <span className="text-xs text-text-muted">({col.requests.length})</span>
            </button>
            <button
              onClick={() => deleteCollection(col.id)}
              className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition ml-1"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={saveCurrentTabsAsCollection}
          className="w-full mt-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-teal/30 hover:bg-deep-800 transition text-text-muted"
        >
          💾 Save Current Tabs as Collection
        </button>

        {/* History Section */}
        <div className="mt-8 mb-2 text-xs font-bold text-text-muted uppercase tracking-widest">
          History
        </div>
        {history.length === 0 && (
          <p className="text-xs text-text-muted italic">No requests yet</p>
        )}
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center group hover:bg-deep-800 rounded px-2 py-1.5 mb-1 transition cursor-pointer"
            onClick={() => handleHistoryClick(item)}
          >
            <span
              className={`text-[10px] font-bold mr-2 px-1.5 py-0.5 rounded ${
                item.request.method === 'GET' ? 'bg-green-900/30 text-green-400' :
                item.request.method === 'POST' ? 'bg-amber-900/30 text-amber-400' :
                item.request.method === 'DELETE' ? 'bg-red-900/30 text-red-400' :
                'bg-blue-900/30 text-blue-400'
              }`}
            >
              {item.request.method}
            </span>
            <span className="flex-1 text-sm text-text-primary truncate">
              {item.request.url ? item.request.url.replace(/^https?:\/\//, '') : '(no url)'}
            </span>
            <span className="text-[10px] text-text-muted ml-2">
              {new Date(item.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="w-full mt-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-teal/30 hover:bg-deep-800 transition text-text-muted"
          >
            🗑 Clear History
          </button>
        )}
      </div>
    </div>
  );
}