'use client';

import React from 'react';
import TabHeader from '../components/TabHeader';    // ✅ relative
import RequestBar from '../components/RequestBar';  // ✅ relative
import { useApp } from '../context/AppContext';      // ✅ relative

export default function Home() {
  const { darkMode, setDarkMode } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar – new palette */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-teal/20 bg-deep-900/50 p-4 justify-between backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-mint mb-8 drop-shadow-sm">
            PORTMAN
          </h1>
          <div className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
            Collections
          </div>
          <div className="text-sm text-text-muted italic px-1">
            No collections saved yet
          </div>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full text-center py-2.5 text-xs font-semibold rounded-lg border border-teal/30 hover:bg-deep-800 transition-all duration-200 text-text-muted"
        >
          {darkMode ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
        </button>
      </aside>

      {/* Main Workspace – new palette */}
      <main className="flex-1 flex flex-col min-w-0 bg-deep-950">
        <TabHeader />
        <RequestBar />

        <div className="flex-1 p-6 text-center text-text-muted text-sm flex items-center justify-center border-t border-teal/20">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-semibold text-text-primary">
              Welcome to Portman! 🚀
            </h2>
            <p>Your dark blue gradient theme is active.</p>
          </div>
        </div>
      </main>
    </div>
  );
}