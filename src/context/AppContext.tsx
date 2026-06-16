'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tab, Collection, CollectionItem, HistoryItem, RequestConfig } from '../types';

interface AppContextType {
  tabs: Tab[];
  activeTabId: string;
  collections: Collection[];
  history: HistoryItem[];
  darkMode: boolean;

  setActiveTabId: (id: string) => void;
  setDarkMode: (mode: boolean) => void;
  createNewTab: (initialRequest?: RequestConfig, name?: string) => void;
  closeTab: (id: string) => void;
  updateActiveTabRequest: (updater: (prev: RequestConfig) => RequestConfig) => void;
  updateActiveTabResponse: (updater: (prev: Tab['response']) => Tab['response']) => void;
  clearActiveTabFields: () => void;
  setCollections: (collections: Collection[]) => void;
  saveCurrentTabsAsCollection: () => void;
  deleteCollection: (id: string) => void;
  loadCollection: (collection: Collection) => void;
  addHistory: (url: string, method: string) => void;
  clearHistory: () => void;
}

const defaultRequest: RequestConfig = {
  url: '',
  method: 'GET',
  headers: [{ id: '1', key: '', value: '', enabled: true }],
  params: [{ id: '1', key: '', value: '', enabled: true }],
  body: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const savedCollections = localStorage.getItem('portman_collections');
    const savedHistory = localStorage.getItem('portman_history');
    const savedTheme = localStorage.getItem('portman_darkmode');

    if (savedCollections) setCollections(JSON.parse(savedCollections));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedTheme) setDarkMode(JSON.parse(savedTheme));

    const initialId = crypto.randomUUID();
    setTabs([
      {
        id: initialId,
        name: 'New Request',
        request: { ...defaultRequest },
        response: { status: null, statusText: '', data: null, loading: false, error: null },
      },
    ]);
    setActiveTabId(initialId);
  }, []);

  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('portman_collections', JSON.stringify(collections));
      localStorage.setItem('portman_history', JSON.stringify(history));
      localStorage.setItem('portman_darkmode', JSON.stringify(darkMode));
    }
  }, [collections, history, darkMode, tabs]);

  const createNewTab = (initialRequest?: RequestConfig, name?: string) => {
    const newId = crypto.randomUUID();
    const newTab: Tab = {
      id: newId,
      name: name || 'New Request',
      request: initialRequest ? JSON.parse(JSON.stringify(initialRequest)) : { ...defaultRequest },
      response: { status: null, statusText: '', data: null, loading: false, error: null },
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;
    const remainingTabs = tabs.filter((t) => t.id !== id);
    setTabs(remainingTabs);
    if (activeTabId === id) {
      setActiveTabId(remainingTabs[remainingTabs.length - 1].id);
    }
  };

  const updateActiveTabRequest = (updater: (prev: RequestConfig) => RequestConfig) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, request: updater(tab.request) } : tab))
    );
  };

  const updateActiveTabResponse = (updater: (prev: Tab['response']) => Tab['response']) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, response: updater(tab.response) } : tab))
    );
  };

  const clearActiveTabFields = () => {
    updateActiveTabRequest(() => ({
      url: '',
      method: 'GET',
      headers: [{ id: crypto.randomUUID(), key: '', value: '', enabled: true }],
      params: [{ id: crypto.randomUUID(), key: '', value: '', enabled: true }],
      body: '',
    }));
    updateActiveTabResponse(() => ({ status: null, statusText: '', data: null, loading: false, error: null }));
  };

  // ─── Collections (matching your Collection / CollectionItem types) ─────
  const saveCurrentTabsAsCollection = () => {
    if (tabs.length === 0) return;
    const collectionItems: CollectionItem[] = tabs.map((tab) => ({
      id: crypto.randomUUID(),
      name: tab.name,
      ...tab.request,   // spreads url, method, headers, params, body
    }));
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name: `Collection ${collections.length + 1}`,
      requests: collectionItems,
    };
    const updated = [...collections, newCollection];
    setCollections(updated);
    localStorage.setItem('portman_collections', JSON.stringify(updated));
  };

  const deleteCollection = (id: string) => {
    const updated = collections.filter((c) => c.id !== id);
    setCollections(updated);
    localStorage.setItem('portman_collections', JSON.stringify(updated));
  };

  const loadCollection = (collection: Collection) => {
    const newTabs: Tab[] = collection.requests.map((item) => ({
      id: crypto.randomUUID(),
      name: item.name,
      request: {
        url: item.url,
        method: item.method,
        headers: item.headers,
        params: item.params,
        body: item.body,
      },
      response: { status: null, statusText: '', data: null, loading: false, error: null },
    }));
    setTabs(newTabs);
    setActiveTabId(newTabs[0]?.id ?? null);
  };

  // ─── History (matching your HistoryItem type) ─────────────────────────
  const addHistory = (url: string, method: string) => {
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab) return;
    const newHistory: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      request: { ...activeTab.request },   // deep copy
      responseStatus: activeTab.response.status,
    };
    const updated = [newHistory, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem('portman_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('portman_history');
  };

  return (
    <AppContext.Provider
      value={{
        tabs,
        activeTabId,
        collections,
        history,
        darkMode,
        setActiveTabId,
        setDarkMode,
        createNewTab,
        closeTab,
        updateActiveTabRequest,
        updateActiveTabResponse,
        clearActiveTabFields,
        setCollections,
        saveCurrentTabsAsCollection,
        deleteCollection,
        loadCollection,
        addHistory,
        clearHistory,
      }}
    >
      <div
        className={
          darkMode
            ? 'dark text-text-primary bg-deep-950 min-h-screen flex flex-col'
            : 'text-black bg-white min-h-screen flex flex-col'
        }
      >
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}