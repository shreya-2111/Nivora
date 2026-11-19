const configuredApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/+$/, '');
const API_BASE_URL = configuredApiUrl.endsWith('/api') ? configuredApiUrl : `${configuredApiUrl}/api`;

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export function getGuestSessionToken() {
  if (typeof window === 'undefined') return undefined;
  return window.sessionStorage.getItem('nivora.guest-session') || undefined;
}

export function getIdempotencyKey(scope: 'order' | 'request') {
  if (typeof window === 'undefined') return crypto.randomUUID();

  const keyName = `nivora.${scope}-idempotency-key`;
  let key = window.sessionStorage.getItem(keyName);
  if (!key) {
    key = crypto.randomUUID();
    window.sessionStorage.setItem(keyName, key);
  }
  return key;
}

export function clearIdempotencyKey(scope: 'order' | 'request') {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(`nivora.${scope}-idempotency-key`);
  }
}

export function setStaffRefreshToken(token: string) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('nivora.staff-refresh-token', token);
  }
}

export function clearStaffRefreshToken() {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem('nivora.staff-refresh-token');
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  guestSession: string | null = getGuestSessionToken() || null,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (guestSession) headers.set('X-Guest-Session', guestSession);

  const send = () => fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });
  let response = await send();
  const refreshToken = typeof window === 'undefined'
    ? null
    : window.sessionStorage.getItem('nivora.staff-refresh-token');

  if (
    response.status === 401 &&
    !guestSession &&
    !path.startsWith('/auth/') &&
    refreshToken
  ) {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    let refreshPayload: { message?: string; refresh_token?: string };
    try {
      refreshPayload = await refreshResponse.json();
    } catch {
      throw new ApiError('The backend returned an invalid refresh response.', refreshResponse.status);
    }
    if (!refreshResponse.ok) {
      clearStaffRefreshToken();
      throw new ApiError(
        refreshPayload.message || 'Staff session expired. Please sign in again.',
        refreshResponse.status,
      );
    }
    if (refreshPayload.refresh_token) setStaffRefreshToken(refreshPayload.refresh_token);
    response = await send();
  }

  let payload: { message?: string; code?: string };
  try {
    payload = await response.json();
  } catch {
    throw new ApiError('The backend returned an invalid response.', response.status);
  }

  if (!response.ok) {
    throw new ApiError(
      payload.message || `Request failed with status ${response.status}`,
      response.status,
      payload.code,
    );
  }

  return payload as T;
}
