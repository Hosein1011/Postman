'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function ResponsePanel() {
  const { tabs, activeTabId } = useApp();
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const response = activeTab?.response;

  if (!response) {
    return (
      <div className="bg-deep-950 border-t border-teal/20 p-6 text-text-muted text-sm">
        Send a request to see the response.
      </div>
    );
  }

  const { status, statusText, data, loading, error } = response;

  if (loading) {
    return (
      <div className="bg-deep-950 border-t border-teal/20 p-6 text-text-muted text-sm flex items-center gap-2">
        <span className="animate-spin">⏳</span> Sending request...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-deep-950 border-t border-teal/20 p-6">
        <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
          <span>❌ Error</span>
        </div>
        <pre className="text-red-300 text-sm whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  const statusColor =
    status && status >= 200 && status < 300
      ? 'text-mint'
      : status && status >= 400
      ? 'text-red-400'
      : 'text-yellow-400';

  return (
    <div className="bg-deep-950 border-t border-teal/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className={`font-bold text-lg ${statusColor}`}>
          {status} {statusText}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-text-muted mb-2">Response Body</h3>
        <pre className="bg-deep-900 rounded-lg p-4 text-sm text-text-primary overflow-x-auto max-h-96 font-mono whitespace-pre-wrap">
          {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}