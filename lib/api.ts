const API_BASE = ''

interface ApiOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'حدث خطأ' }))
    throw new Error(error.message || 'حدث خطأ')
  }

  return response.json()
}
