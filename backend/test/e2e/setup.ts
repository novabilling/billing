/**
 * Real E2E test helpers — hits the live API running in Docker.
 *
 * Each test suite registers a fresh tenant so tests are fully isolated.
 * No mocks — exercises the full stack: HTTP → guards → services → DB.
 */

const BASE_URL = process.env.E2E_API_URL || 'http://localhost:4000';

export interface TestTenant {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * Register a fresh tenant. Returns credentials for all auth modes.
 */
export async function registerTenant(suffix?: string): Promise<TestTenant> {
  const ts = Date.now();
  const tag = suffix || 'default';
  const email = `e2e-${tag}-${ts}@test.local`;

  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'E2E Test User',
      email,
      password: 'TestPassword123',
      companyName: `E2E ${tag} ${ts}`,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Registration failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    id: data.tenant.id,
    name: data.tenant.name,
    email: data.tenant.email,
    apiKey: data.apiKey,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface ApiResponse<T = any> {
  status: number;
  ok: boolean;
  data: T;
}

/**
 * Create an HTTP helper bound to a tenant's API key.
 */
export function createApiClient(apiKey: string) {
  async function request<T = any>(
    method: HttpMethod,
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}/api${path.startsWith('/') ? path : `/${path}`}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let data: any;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return { status: res.status, ok: res.ok, data };
  }

  return {
    get: <T = any>(path: string) => request<T>('GET', path),
    post: <T = any>(path: string, body?: unknown) => request<T>('POST', path, body),
    patch: <T = any>(path: string, body?: unknown) => request<T>('PATCH', path, body),
    put: <T = any>(path: string, body?: unknown) => request<T>('PUT', path, body),
    del: <T = any>(path: string) => request<T>('DELETE', path),
  };
}

/**
 * Create an HTTP helper bound to a tenant's JWT (for /tenants/me endpoints).
 */
export function createJwtClient(accessToken: string) {
  async function request<T = any>(
    method: HttpMethod,
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}/api${path.startsWith('/') ? path : `/${path}`}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let data: any;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return { status: res.status, ok: res.ok, data };
  }

  return {
    get: <T = any>(path: string) => request<T>('GET', path),
    post: <T = any>(path: string, body?: unknown) => request<T>('POST', path, body),
    patch: <T = any>(path: string, body?: unknown) => request<T>('PATCH', path, body),
    del: <T = any>(path: string) => request<T>('DELETE', path),
  };
}

/**
 * Health check — call before test suites to ensure API is reachable.
 */
export async function waitForApi(timeoutMs = 30_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) return;
    } catch {
      // keep retrying
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`API not reachable at ${BASE_URL} after ${timeoutMs}ms`);
}
