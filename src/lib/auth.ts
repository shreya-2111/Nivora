// ==============================================================================
// NIVORA - CLIENT AUTHENTICATION & SESSION STORAGE UTILITIES
// Safe for both Next.js Server-Side Rendering (SSR) and Client Components
// ==============================================================================

import { GuestSessionData, StaffUser, AuthSessionResponse } from '@/types/api';

const GUEST_SESSION_KEY = 'nivora_guest_session';
const STAFF_TOKEN_KEY = 'nivora_staff_token';
const STAFF_REFRESH_TOKEN_KEY = 'nivora_staff_refresh_token';
const STAFF_USER_KEY = 'nivora_staff_user';

// In-memory fallback if storage is inaccessible (e.g. strict private browsing or SSR)
let memoryGuestToken: string | null = null;
let memoryStaffToken: string | null = null;

// Helper to safely access browser storage
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

// ==============================================================================
// GUEST SESSION MANAGEMENT
// ==============================================================================

export function getGuestToken(): string | null {
  if (!isBrowser()) return memoryGuestToken;
  try {
    const raw = sessionStorage.getItem(GUEST_SESSION_KEY) || localStorage.getItem(GUEST_SESSION_KEY);
    if (!raw) return memoryGuestToken;
    const parsed = JSON.parse(raw);
    return parsed.token || null;
  } catch {
    return memoryGuestToken;
  }
}

export function getGuestSession(): GuestSessionData | null {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(GUEST_SESSION_KEY) || localStorage.getItem(GUEST_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GuestSessionData;
  } catch {
    return null;
  }
}

export function setGuestSession(session: GuestSessionData): void {
  memoryGuestToken = session.token;
  if (!isBrowser()) return;
  try {
    const serialized = JSON.stringify(session);
    sessionStorage.setItem(GUEST_SESSION_KEY, serialized);
    // Also store in localStorage as persistent fallback for mobile refresh
    localStorage.setItem(GUEST_SESSION_KEY, serialized);
  } catch (err) {
    console.warn('Failed to write guest session to browser storage:', err);
  }
}

export function clearGuestSession(): void {
  memoryGuestToken = null;
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(GUEST_SESSION_KEY);
    localStorage.removeItem(GUEST_SESSION_KEY);
  } catch {}
}

export function hasActiveGuestSession(): boolean {
  return !!getGuestToken();
}

// ==============================================================================
// ADMIN / STAFF SESSION MANAGEMENT
// ==============================================================================

export function getStaffToken(): string | null {
  if (!isBrowser()) return memoryStaffToken;
  try {
    return sessionStorage.getItem(STAFF_TOKEN_KEY) || localStorage.getItem(STAFF_TOKEN_KEY) || memoryStaffToken;
  } catch {
    return memoryStaffToken;
  }
}

export function getStaffRefreshToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return sessionStorage.getItem(STAFF_REFRESH_TOKEN_KEY) || localStorage.getItem(STAFF_REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStaffUser(): StaffUser | null {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(STAFF_USER_KEY) || localStorage.getItem(STAFF_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStaffSession(session: AuthSessionResponse): void {
  memoryStaffToken = session.token;
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(STAFF_TOKEN_KEY, session.token);
    sessionStorage.setItem(STAFF_REFRESH_TOKEN_KEY, session.refresh_token);
    sessionStorage.setItem(STAFF_USER_KEY, JSON.stringify(session.user));

    // Also sync to localStorage for persistent admin sessions
    localStorage.setItem(STAFF_TOKEN_KEY, session.token);
    localStorage.setItem(STAFF_REFRESH_TOKEN_KEY, session.refresh_token);
    localStorage.setItem(STAFF_USER_KEY, JSON.stringify(session.user));
  } catch (err) {
    console.warn('Failed to write staff session to storage:', err);
  }
}

export function clearStaffSession(): void {
  memoryStaffToken = null;
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(STAFF_TOKEN_KEY);
    sessionStorage.removeItem(STAFF_REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(STAFF_USER_KEY);
    localStorage.removeItem(STAFF_TOKEN_KEY);
    localStorage.removeItem(STAFF_REFRESH_TOKEN_KEY);
    localStorage.removeItem(STAFF_USER_KEY);
  } catch {}
}

export function isStaffAuthenticated(): boolean {
  return !!getStaffToken();
}
