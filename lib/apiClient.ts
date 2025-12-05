export type ApiResponse<T> = { success: boolean; message?: string; data?: T };

async function request<T>(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init });
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const message = payload?.message || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return payload as ApiResponse<T>;
}

export async function get<T>(url: string) {
  const p = await request<T>(url, { method: 'GET' });
  return p.data as T;
}

export async function post<T>(url: string, body?: any) {
  const p = await request<T>(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return p;
}

export async function put<T>(url: string, body?: any) {
  const p = await request<T>(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return p;
}

export async function del<T>(url: string) {
  const p = await request<T>(url, { method: 'DELETE' });
  return p;
}

const apiClient = { get, post, put, del };
export default apiClient;
