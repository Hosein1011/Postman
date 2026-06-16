// src/types/index.ts

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestConfig {
  url: string;
  method: HttpMethod | string;
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body: string;
}

export interface ResponseConfig {
  status: number | null;
  statusText: string;
  data: any | null;
  loading: boolean;
  error: string | null;
}

export interface Tab {
  id: string;
  name: string;
  request: RequestConfig;
  response: ResponseConfig;
}

// For collections, it's better to use CollectionItem so each saved request can have a name
export interface CollectionItem extends RequestConfig {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  name: string;
  requests: CollectionItem[];
}

export interface HistoryItem {
  id: string;
  timestamp: number; // Use number here so you can easily save Date.now()
  request: RequestConfig;
  responseStatus: number | null;
}