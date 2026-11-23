import { apiClient } from '@/lib/apiClient';
import { setStaffSession, clearStaffSession, getStaffRefreshToken } from '@/lib/auth';
import { AuthSessionResponse, StaffUser } from '@/types/api';

export const authService = {
  async login(email: string, password: string): Promise<AuthSessionResponse> {
    const data = await apiClient.post<AuthSessionResponse>(
      '/api/auth/login',
      { email, password },
      { skipAuth: true }
    );
    if (data && data.token) {
      setStaffSession(data);
    }
    return data;
  },

  async logout(): Promise<{ message: string }> {
    try {
      const result = await apiClient.post<{ message: string }>('/api/auth/logout');
      return result;
    } finally {
      clearStaffSession();
    }
  },

  async getMe(): Promise<{ user: StaffUser }> {
    return apiClient.get<{ user: StaffUser }>('/api/auth/me');
  },

  async refresh(): Promise<AuthSessionResponse> {
    const refreshToken = getStaffRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const data = await apiClient.post<AuthSessionResponse>(
      '/api/auth/refresh',
      { refresh_token: refreshToken },
      { skipAuth: true }
    );
    if (data && data.token) {
      setStaffSession(data);
    }
    return data;
  },
};
