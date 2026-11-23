// ==============================================================================
// NIVORA - CENTRALIZED API CLIENT ARCHITECTURE
// Connects the Next.js Frontend to the Next.js + PostgreSQL Backend
// ==============================================================================

import { getGuestToken, getStaffToken } from './auth';
import { ApiErrorPayload } from '@/types/api';

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public data?: ApiErrorPayload;

  constructor(status: number, message: string, code?: string, data?: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
  skipGuestSession?: boolean;
  idempotencyKey?: string;
}

const DEFAULT_BASE_URL = 'http://localhost:3001';

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
  return url.replace(/\/$/, '');
}

/**
 * Generates an unguessable UUID-like idempotency key for order/service checkouts
 */
export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'idemp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
}

/**
 * Core HTTP Request Dispatcher
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Assemble Query Parameters if present
  let url = `${baseUrl}${cleanEndpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(options.params)) {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    }
    const queryStr = searchParams.toString();
    if (queryStr) {
      url += (url.includes('?') ? '&' : '?') + queryStr;
    }
  }

  // Build Request Headers
  const headers = new Headers(options.headers || {});

  // 1. Staff Authentication Header (Bearer token)
  if (!options.skipAuth) {
    const staffToken = getStaffToken();
    if (staffToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${staffToken}`);
    }
  }

  // 2. Guest Session Header
  if (!options.skipGuestSession) {
    const guestToken = getGuestToken();
    if (guestToken && !headers.has('X-Guest-Session')) {
      headers.set('X-Guest-Session', guestToken);
    }
  }

  // 3. Idempotency Key (Double-submit protection)
  if (options.idempotencyKey && !headers.has('Idempotency-Key')) {
    headers.set('Idempotency-Key', options.idempotencyKey);
  }

  // 4. Content-Type Handling (Do not set for FormData / multipart)
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const fetchConfig: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Ensures HTTP-only staff_token cookies pass through
  };

  let response: Response;
  try {
    response = await fetch(url, fetchConfig);
  } catch (netErr: any) {
    // Network failure (server down, CORS blocked, DNS unreachable)
    throw new ApiError(
      0,
      `Unable to reach Nivora Backend API at ${baseUrl}. Ensure backend is running. (${netErr.message || 'Network Error'})`,
      'NETWORK_ERROR'
    );
  }

  // Parse Response Payload
  let data: any = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  // Handle Non-2xx Responses
  if (!response.ok) {
    const errorPayload = typeof data === 'object' && data !== null ? (data as ApiErrorPayload) : { message: response.statusText };
    const errorMessage = errorPayload.message || `Request failed with status ${response.status}`;
    const errorCode = errorPayload.code || `HTTP_${response.status}`;

    throw new ApiError(response.status, errorMessage, errorCode, errorPayload);
  }

  return data as T;
}

// Reusable HTTP Methods
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
