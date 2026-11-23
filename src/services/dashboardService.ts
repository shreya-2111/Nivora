import { apiClient } from '@/lib/apiClient';
import { DashboardStatsResponse } from '@/types/api';

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    return apiClient.get<DashboardStatsResponse>('/api/dashboard');
  },
};
