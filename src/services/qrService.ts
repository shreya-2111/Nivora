import { apiClient } from '@/lib/apiClient';
import { QrCodeRecord } from '@/types/api';

export const qrService = {
  async getQrCodes(includeImage = true): Promise<{ qr_codes: QrCodeRecord[] }> {
    return apiClient.get<{ qr_codes: QrCodeRecord[] }>('/api/qr', {
      params: { include_image: includeImage },
    });
  },

  async createQrCode(roomId: string): Promise<{ qr_code: QrCodeRecord }> {
    return apiClient.post<{ qr_code: QrCodeRecord }>('/api/qr', { room_id: roomId });
  },

  async updateQrCode(id: string, isActive: boolean): Promise<{ qr_code: QrCodeRecord }> {
    return apiClient.patch<{ qr_code: QrCodeRecord }>(`/api/qr/${id}`, { is_active: isActive });
  },
};
