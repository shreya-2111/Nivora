'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getStaffToken, getStaffUser, clearStaffSession } from '@/lib/auth';
import { authService } from '@/services/authService';
import { StaffUser } from '@/types/api';

export function useAdminAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(getStaffUser());
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStaffToken());

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const token = getStaffToken();
      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          if (requireAuth) {
            router.replace('/admin/login');
          }
        }
        return;
      }

      // Check current session validity
      try {
        const res = await authService.getMe();
        if (isMounted && res?.user) {
          setUser(res.user);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        // If unauthorized, clear and redirect
        if (err?.status === 401 || err?.status === 403) {
          clearStaffSession();
          if (isMounted) {
            setIsAuthenticated(false);
            setUser(null);
            if (requireAuth) {
              router.replace('/admin/login');
            }
          }
        } else {
          // Network or offline fallback: keep cached staff session if available
          const cached = getStaffUser();
          if (isMounted && cached) {
            setUser(cached);
            setIsAuthenticated(true);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [requireAuth, router]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout request failed or backend unreachable:', err);
    } finally {
      clearStaffSession();
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/admin/login');
    }
  }, [router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
}
