// src/components/TabHeader.tsx
'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function TabHeader() {
  const { tabs, activeTabId, setActiveTabId, createNewTab, closeTab } = useApp();

  return (
    <div className="flex items-center border-b border-slate-200 dark:border-blue-900/30 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md overflow-x-auto scrollbar-none">
      {/* Tabs List */}
      <div className="flex items-center flex-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-r border-slate-200 dark:border-blue-900/30 cursor-pointer select-none transition-all duration-200
                ${isActive 
                  ? 'bg-white dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border-t-2 border-t-blue-500 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-blue-200 hover:bg-slate-100 dark:hover:bg-blue-900/20'
                }`}
            >
              {/* Method Badge */}
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm ${
                tab.request.method === 'GET' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                tab.request.method === 'POST' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                tab.request.method === 'DELETE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
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
                    e.stopPropagation(); // Prevent tab switch when closing
                    closeTab(tab.id);
                  }}
                  className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-blue-800/50 text-slate-400 hover:text-slate-700 dark:hover:text-blue-200 ml-1 transition-colors"
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
        onClick={() => createNewTab()}
        className="px-5 py-3 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border-l border-slate-200 dark:border-blue-900/30 hover:bg-slate-100 dark:hover:bg-blue-900/20 transition-all text-lg font-bold flex items-center justify-center"
        title="Open New Tab"
      >
        ＋
      </button>
    </div>
  );
}