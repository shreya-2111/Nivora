import { apiClient } from '@/lib/apiClient';
import { setGuestSession } from '@/lib/auth';
import { GuestResolveResponse } from '@/types/api';

export const guestService = {
  /**
   * Resolves a physical QR token to an active room session
   * Automatically stores the session token for subsequent guest calls
   */
  async resolveGuestToken(token: string): Promise<GuestResolveResponse> {
    const data = await apiClient.get<GuestResolveResponse>(`/api/guest/${encodeURIComponent(token)}`, {
      skipAuth: true,
      skipGuestSession: true,
    });

    if (data && data.session && data.session.token) {
      setGuestSession({
        token: data.session.token,
        room: data.room,
        issuedAt: Date.now(),
      });
    }

    return data;
  },
};
