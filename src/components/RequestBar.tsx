'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { HttpMethod, Param, Header } from '../types';
import { isValidHttpUrl } from '../lib/validators';

export default function RequestBar() {
  const { tabs, activeTabId, updateActiveTabRequest, updateActiveTabResponse, clearActiveTabFields } = useApp();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const request = activeTab?.request;

  // ✅ ALL hooks must be called unconditionally before any early return
  const [bodyText, setBodyText] = useState(request?.body || '');
  useEffect(() => {
    setBodyText(request?.body || '');
  }, [request?.body]);

  // ⚠️ Early return AFTER hooks – safe now
  if (!activeTab || !request) {
    return (
      <div className="px-4 py-3 text-text-muted text-sm bg-deep-950 border-b border-teal/20">
        No active tab
      </div>
    );
  }

  // ─── Helpers ──────────────────────────────
  const updateUrl = (url: string) => updateActiveTabRequest((prev) => ({ ...prev, url }));
  const updateMethod = (method: HttpMethod) => updateActiveTabRequest((prev) => ({ ...prev, method }));
  const updateBody = (body: string) => {
    setBodyText(body);
    updateActiveTabRequest((prev) => ({ ...prev, body }));
  };

  // Params
  const addParam = () => {
    updateActiveTabRequest((prev) => ({
      ...prev,
      params: [...prev.params, { id: crypto.randomUUID(), key: '', value: '', enabled: true }],
    }));
  };
  const removeParam = (id: string) => {
    updateActiveTabRequest((prev) => ({ ...prev, params: prev.params.filter((p) => p.id !== id) }));
  };
  const updateParam = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    updateActiveTabRequest((prev) => ({
      ...prev,
      params: prev.params.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  // Headers
  const addHeader = () => {
    updateActiveTabRequest((prev) => ({
      ...prev,
      headers: [...prev.headers, { id: crypto.randomUUID(), key: '', value: '', enabled: true }],
    }));
  };
  const removeHeader = (id: string) => {
    updateActiveTabRequest((prev) => ({ ...prev, headers: prev.headers.filter((h) => h.id !== id) }));
  };
  const updateHeader = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    updateActiveTabRequest((prev) => ({
      ...prev,
      headers: prev.headers.map((h) => (h.id === id ? { ...h, [field]: value } : h)),
    }));
  };

  // ─── Real Send Handler ─────────────────────
  const handleSend = async () => {
    if (!request) return;

    // Validation
    if (!request.url.trim()) {
      updateActiveTabResponse(() => ({
        status: null, statusText: '', data: null, loading: false, error: 'URL cannot be empty.',
      }));
      return;
    }
    if (!isValidHttpUrl(request.url)) {
      updateActiveTabResponse(() => ({
        status: null, statusText: '', data: null, loading: false, error: 'Invalid URL. Must start with http:// or https://',
      }));
      return;
    }

    // Set loading
    updateActiveTabResponse(() => ({ status: null, statusText: '', data: null, loading: true, error: null }));

    try {
      // Build headers
      const headers: Record<string, string> = {};
      request.headers.forEach((h) => {
        if (h.enabled && h.key.trim()) headers[h.key.trim()] = h.value;
      });

      // Query string
      const enabledParams = request.params.filter((p) => p.enabled && p.key.trim());
      const queryString = enabledParams
        .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join('&');
      const fullUrl = queryString ? `${request.url}?${queryString}` : request.url;

      const options: RequestInit = {
        method: request.method,
        headers: { 'Content-Type': 'application/json', ...headers },
      };

      if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
        options.body = request.body;
      }

      const response = await fetch(fullUrl, options);
      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

      updateActiveTabResponse(() => ({
        status: response.status,
        statusText: response.statusText,
        data,
        loading: false,
        error: null,
      }));
    } catch (err: any) {
      updateActiveTabResponse(() => ({
        status: null, statusText: '', data: null, loading: false,
        error: err.message || 'Network error. Please check your connection.',
      }));
    }
  };

  const showBody = ['POST', 'PUT', 'PATCH'].includes(request.method);

  // ─── Render ────────────────────────────────
  return (
    <div className="bg-deep-950 border-b border-teal/20 p-4 space-y-4">
      {/* Method + URL + Send + Clear */}
      <div className="flex gap-2">
        <select
          value={request.method}
          onChange={(e) => updateMethod(e.target.value as HttpMethod)}
          className="bg-deep-900 text-text-primary border border-teal/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-mint cursor-pointer"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          placeholder="https://api.example.com/v1/resources"
          value={request.url}
          onChange={(e) => updateUrl(e.target.value)}
          className="flex-1 bg-deep-900 text-text-primary border border-teal/30 rounded px-4 py-2 text-sm placeholder-text-muted focus:outline-none focus:border-mint"
        />

        <button onClick={handleSend} className="px-5 py-2 bg-mint hover:bg-emerald-600 text-white font-semibold rounded text-sm transition">
          Send
        </button>

        <button onClick={clearActiveTabFields} className="px-3 py-2 bg-deep-800 hover:bg-deep-700 text-text-muted border border-teal/20 rounded text-sm">
          Clear
        </button>
      </div>

      {/* Params */}
      <details className="group">
        <summary className="text-sm font-semibold text-text-muted cursor-pointer hover:text-text-primary">
          Params {request.params.length > 0 && `(${request.params.length})`}
        </summary>
        <div className="mt-2 space-y-2">
          {request.params.map((param) => (
            <div key={param.id} className="flex gap-2 items-center">
              <input placeholder="Key" value={param.key} onChange={(e) => updateParam(param.id, 'key', e.target.value)} className="flex-1 bg-deep-900 text-text-primary border border-teal/30 rounded px-3 py-1.5 text-sm placeholder-text-muted" />
              <input placeholder="Value" value={param.value} onChange={(e) => updateParam(param.id, 'value', e.target.value)} className="flex-1 bg-deep-900 text-text-primary border border-teal/30 rounded px-3 py-1.5 text-sm placeholder-text-muted" />
              <label className="flex items-center gap-1 text-xs text-text-muted">
                <input type="checkbox" checked={param.enabled} onChange={(e) => updateParam(param.id, 'enabled', e.target.checked)} className="accent-mint" /> On
              </label>
              <button onClick={() => removeParam(param.id)} className="text-red-400 hover:text-red-300 text-sm" aria-label="Remove param">✕</button>
            </div>
          ))}
          <button onClick={addParam} className="text-xs text-mint hover:underline">+ Add param</button>
        </div>
      </details>

      {/* Headers */}
      <details className="group">
        <summary className="text-sm font-semibold text-text-muted cursor-pointer hover:text-text-primary">
          Headers {request.headers.length > 0 && `(${request.headers.length})`}
        </summary>
        <div className="mt-2 space-y-2">
          {request.headers.map((header) => (
            <div key={header.id} className="flex gap-2 items-center">
              <input placeholder="Key" value={header.key} onChange={(e) => updateHeader(header.id, 'key', e.target.value)} className="flex-1 bg-deep-900 text-text-primary border border-teal/30 rounded px-3 py-1.5 text-sm placeholder-text-muted" />
              <input placeholder="Value" value={header.value} onChange={(e) => updateHeader(header.id, 'value', e.target.value)} className="flex-1 bg-deep-900 text-text-primary border border-teal/30 rounded px-3 py-1.5 text-sm placeholder-text-muted" />
              <label className="flex items-center gap-1 text-xs text-text-muted">
                <input type="checkbox" checked={header.enabled} onChange={(e) => updateHeader(header.id, 'enabled', e.target.checked)} className="accent-mint" /> On
              </label>
              <button onClick={() => removeHeader(header.id)} className="text-red-400 hover:text-red-300 text-sm" aria-label="Remove header">✕</button>
            </div>
          ))}
          <button onClick={addHeader} className="text-xs text-mint hover:underline">+ Add header</button>
        </div>
      </details>

      {/* Body (only for POST/PUT/PATCH) */}
      {showBody && (
        <details open>
          <summary className="text-sm font-semibold text-text-muted cursor-pointer hover:text-text-primary">Body (raw JSON)</summary>
          <textarea
            rows={6}
            placeholder='Enter JSON body...'
            value={bodyText}
            onChange={(e) => updateBody(e.target.value)}
            className="w-full mt-2 bg-deep-900 text-text-primary border border-teal/30 rounded p-3 text-sm font-mono placeholder-text-muted resize-y"
          />
        </details>
      )}
    </div>
  );
}