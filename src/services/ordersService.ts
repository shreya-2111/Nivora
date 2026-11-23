import { apiClient, generateIdempotencyKey } from '@/lib/apiClient';
import { BackendOrder, BackendOrderStatus, CreateOrderPayload, PaginationMeta } from '@/types/api';

export const ordersService = {
  /**
   * Places a food order using active guest session
   * Automatically sets Idempotency-Key if not provided
   */
  async createOrder(
    payload: CreateOrderPayload,
    idempotencyKey?: string
  ): Promise<{ order: BackendOrder; duplicate?: boolean }> {
    const key = idempotencyKey || generateIdempotencyKey();
    return apiClient.post<{ order: BackendOrder; duplicate?: boolean }>(
      '/api/orders',
      payload,
      { idempotencyKey: key }
    );
  },

  /**
   * Lists orders (Staff view with pagination & filters)
   */
  async getOrders(params?: {
    status?: string;
    room_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: BackendOrder[]; pagination: PaginationMeta }> {
    return apiClient.get<{ orders: BackendOrder[]; pagination: PaginationMeta }>(
      '/api/orders',
      { params }
    );
  },

  /**
   * Retrieves single order by ID (Staff or Room Guest)
   */
  async getOrderById(id: string): Promise<{ order: BackendOrder }> {
    return apiClient.get<{ order: BackendOrder }>(`/api/orders/${id}`);
  },

  /**
   * Advances order status (Staff only)
   */
  async updateOrderStatus(id: string, status: BackendOrderStatus): Promise<{ order: BackendOrder }> {
    return apiClient.patch<{ order: BackendOrder }>(`/api/orders/${id}/status`, { status });
  },
};
