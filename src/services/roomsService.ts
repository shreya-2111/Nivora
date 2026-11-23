import { apiClient } from '@/lib/apiClient';
import { RoomRecord } from '@/types/api';

export const roomsService = {
  async getRooms(): Promise<{ rooms: RoomRecord[] }> {
    return apiClient.get<{ rooms: RoomRecord[] }>('/api/rooms');
  },

  async createRoom(payload: {
    room_number: string;
    floor?: number | null;
    status?: 'ACTIVE' | 'INACTIVE';
  }): Promise<{ room: RoomRecord }> {
    return apiClient.post<{ room: RoomRecord }>('/api/rooms', payload);
  },

  async updateRoom(
    id: string,
    payload: Partial<{ room_number: string; floor: number | null; status: 'ACTIVE' | 'INACTIVE' }>
  ): Promise<{ room: RoomRecord }> {
    return apiClient.patch<{ room: RoomRecord }>(`/api/rooms/${id}`, payload);
  },

  async deleteRoom(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/rooms/${id}`);
  },
};
