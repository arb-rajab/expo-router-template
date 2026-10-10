import { getCachedServerUrl } from './server-config';
import type {
  ApiErrorBody,
  DeviceToken,
  DeviceTokenRegisterRequest,
  LoginResponse,
} from './api-types';

const API_PREFIX = '/api/v1';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly field: string | null;

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.error.message ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = body?.error.code ?? 'unknown';
    this.field = body?.error.field ?? null;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

function requireServerUrl(): string {
  const url = getCachedServerUrl();
  if (!url) {
    throw new Error('No server configured yet.');
  }
  return url;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = requireServerUrl();
  const response = await fetch(`${base}${API_PREFIX}${path}`, {
    ...init,
    // RN's fetch uses the platform's native HTTP stack, which keeps its own
    // cookie jar per host. `credentials: 'include'` makes the intent (send the
    // HttpOnly session cookie) explicit.
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(response.status, body as ApiErrorBody | null);
  }

  return body as T;
}

/** One method per endpoint. Add your own endpoints here. */
export const api = {
  login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout(): Promise<void> {
    return request<void>('/auth/logout', { method: 'POST' });
  },

  registerDeviceToken(payload: DeviceTokenRegisterRequest): Promise<DeviceToken> {
    return request<DeviceToken>('/device-tokens', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  listDeviceTokens(): Promise<DeviceToken[]> {
    return request<DeviceToken[]>('/device-tokens');
  },

  unregisterDeviceToken(deviceTokenId: string): Promise<void> {
    return request<void>(`/device-tokens/${encodeURIComponent(deviceTokenId)}`, {
      method: 'DELETE',
    });
  },
};
