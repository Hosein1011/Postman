'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function ResponsePanel() {
  const { tabs, activeTabId } = useApp();
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const response = activeTab?.response;

  if (!activeTab || !response) {
    return (
      <div className="flex-1 p-6 text-center text-text-muted text-sm flex items-center justify-center border-t border-teal/20">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-text-primary">Welcome to Portman! 🚀</h2>
          <p>Your dark blue gradient theme is active.</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (response.loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center border-t border-teal/20">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mint"></div>
          <span className="text-sm text-text-muted">Sending request...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (response.error) {
    return (
      <div className="flex-1 p-6 border-t border-teal/20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400 font-bold">Error</span>
            </div>
            <p className="text-sm text-red-300 font-mono">{response.error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Success: show status and data
  const statusColor =
    response.status && response.status >= 200 && response.status < 300
      ? 'text-green-400'
      : 'text-red-400';

  const formattedData = response.data
    ? JSON.stringify(response.data, null, 2)
    : '';

  return (
    <div className="flex-1 p-6 border-t border-teal/20 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Status */}
        <div className="flex items-center gap-3">
          <span className={`text-lg font-bold ${statusColor}`}>
            {response.status} {response.statusText}
          </span>
          <span className="text-xs text-text-muted bg-deep-800 px-2 py-0.5 rounded">
            Response
          </span>
        </div>

        {/* Data */}
        <div className="bg-deep-900 border border-teal/20 rounded-lg p-4">
          <pre className="text-sm text-text-primary font-mono whitespace-pre-wrap break-all">
            {formattedData || 'No response data'}
          </pre>
        </div>
      </div>
    </div>
  );
}