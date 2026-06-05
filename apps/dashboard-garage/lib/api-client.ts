const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;
  const baseUrl = API_URL.endsWith('/api/v1') ? API_URL : `${API_URL}/api/v1`;
  let url = `${baseUrl}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }

  return data.data as T;
}
