export type ApiPayload<T = unknown> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function apiFetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url);
  let payload: ApiPayload | null = null;
  try {
    payload = await res.json();
  } catch {
    // If response isn't JSON, throw a generic error
    throw new Error('Invalid JSON response');
  }

  if (!res.ok) {
    // payload may contain message from server
    const message = payload && (payload as any).message ? (payload as any).message : 'Request failed';
    throw new Error(message);
  }

  return (payload as ApiPayload<T>).data;
}

export default apiFetcher;
