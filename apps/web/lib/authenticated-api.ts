import { fetchApi } from './api-client';

export async function fetchAuthenticatedApi<T>(
  endpoint: string,
  token: string,
  options: RequestInit & { params?: Record<string, string | number | boolean> } = {}
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
