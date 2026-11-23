import { apiClient } from '@/lib/apiClient';
import { HotelSettings } from '@/types/api';

export const hotelService = {
  async getHotel(): Promise<{ hotel: HotelSettings }> {
    return apiClient.get<{ hotel: HotelSettings }>('/api/hotel', { skipAuth: true, skipGuestSession: true });
  },

  async updateHotel(payload: Partial<HotelSettings> | FormData): Promise<{ hotel: HotelSettings }> {
    return apiClient.patch<{ hotel: HotelSettings }>('/api/hotel', payload);
  },
};
