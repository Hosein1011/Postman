'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function TabHeader() {
  const { tabs, activeTabId, setActiveTabId, addTab, closeTab } = useApp();

  return (
    <div className="flex items-center border-b border-teal/20 bg-deep-900/50 backdrop-blur-md overflow-x-auto scrollbar-none">
      {/* Tabs List */}
      <div className="flex items-center flex-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-r border-teal/20 cursor-pointer select-none transition-all duration-200
                ${isActive
                  ? 'bg-deep-950 text-mint border-t-2 border-t-mint shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-deep-800'
                }`}
            >
              {/* Method Badge */}
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                tab.request.method === 'GET' ? 'bg-green-900/30 text-green-400' :
                tab.request.method === 'POST' ? 'bg-amber-900/30 text-amber-400' :
                tab.request.method === 'DELETE' ? 'bg-red-900/30 text-red-400' :
                'bg-blue-900/30 text-blue-400'
              }`}>
                {tab.request.method}
              </span>

              <span className="truncate max-w-[120px]">
                {tab.request.url ? tab.request.url.replace(/^https?:\/\//, '') : tab.name}
              </span>

              {/* Close Button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="p-1 rounded-md hover:bg-deep-700 text-text-muted hover:text-text-primary ml-1 transition-colors"
                  title="Close Tab"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Tab Button */}
      <button
        onClick={() => addTab()}
        className="px-5 py-3 text-text-muted hover:text-mint border-l border-teal/20 hover:bg-deep-800 transition-all text-lg font-bold flex items-center justify-center"
        title="Open New Tab"
      >
        ＋
      </button>
    </div>
  );
}