// TODO: API client - uses http://10.0.2.2:8080 for Android emulator, http://localhost:8080 for iOS
export const API_BASE_URL = 'http://10.0.2.2:8080';

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
}
