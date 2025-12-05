import type { ApiPayload } from '@/lib/types/api';
import { safeParseJson, ensureDataAs } from '@/lib/utils';

// Keep apiFetcher for read-only usage (used by SWR). It unwraps `payload.data` and throws on HTTP errors.
export async function apiFetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url);
  const payload = (await safeParseJson(res)) as ApiPayload<T> | null;

  if (!res.ok) {
    const message = payload && payload.message ? payload.message : res.statusText || 'Request failed';
    throw new Error(message);
  }

  // If the API returns the wrapper, unwrap; otherwise return raw payload
  if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data;
  }
  return ensureDataAs<T>(payload) as T;
}

// For mutation endpoints we want the full ApiPayload so the caller can inspect `success` and `message`.
export async function requestApi<T = unknown>(method: string, url: string, body?: unknown): Promise<ApiPayload<T>> {
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url, init);
  const payload = (await safeParseJson(res)) as ApiPayload<T> | null;

  // If we couldn't parse JSON, return a generic wrapper
  if (!payload) {
    return { success: res.ok, message: res.ok ? undefined : res.statusText || 'Request failed', data: undefined as unknown as T };
  }

  return payload;
}

// Convenience wrappers
export const get = <T = unknown>(url: string) => apiFetcher<T>(url);
export const post = <T = unknown>(url: string, body?: unknown) => requestApi<T>('POST', url, body);
export const put = <T = unknown>(url: string, body?: unknown) => requestApi<T>('PUT', url, body);
export const del = <T = unknown>(url: string) => requestApi<T>('DELETE', url);

const apiClient = { get, post, put, del, apiFetcher, requestApi };
export default apiClient;
