import { apiClient, generateIdempotencyKey } from '@/lib/apiClient';
import {
  BackendServiceRequest,
  BackendRequestStatus,
  CreateServiceRequestPayload,
  ServiceCategoryRecord,
  PaginationMeta,
} from '@/types/api';

export const requestsService = {
  /**
   * Creates a room service requisition (Guest)
   */
  async createRequest(
    payload: CreateServiceRequestPayload,
    idempotencyKey?: string
  ): Promise<{ request: BackendServiceRequest; duplicate?: boolean }> {
    const key = idempotencyKey || generateIdempotencyKey();
    return apiClient.post<{ request: BackendServiceRequest; duplicate?: boolean }>(
      '/api/requests',
      payload,
      { idempotencyKey: key }
    );
  },

  /**
   * Lists room service requests (Staff view)
   */
  async getRequests(params?: {
    status?: string;
    room_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: BackendServiceRequest[]; pagination: PaginationMeta }> {
    return apiClient.get<{ requests: BackendServiceRequest[]; pagination: PaginationMeta }>(
      '/api/requests',
      { params }
    );
  },

  /**
   * Retrieves single service request by ID
   */
  async getRequestById(id: string): Promise<{ request: BackendServiceRequest }> {
    return apiClient.get<{ request: BackendServiceRequest }>(`/api/requests/${id}`);
  },

  /**
   * Advances request status (Staff only)
   */
  async updateRequestStatus(
    id: string,
    status: BackendRequestStatus
  ): Promise<{ request: BackendServiceRequest }> {
    return apiClient.patch<{ request: BackendServiceRequest }>(`/api/requests/${id}/status`, { status });
  },

  /**
   * Lists available service categories
   */
  async getServiceCategories(): Promise<{ service_categories: ServiceCategoryRecord[] }> {
    return apiClient.get<{ service_categories: ServiceCategoryRecord[] }>('/api/service-categories');
  },

  /**
   * Updates service category status/name
   */
  async updateServiceCategory(
    id: string,
    payload: Partial<ServiceCategoryRecord>
  ): Promise<{ service_category: ServiceCategoryRecord }> {
    return apiClient.patch<{ service_category: ServiceCategoryRecord }>(
      `/api/service-categories/${id}`,
      payload
    );
  },
};
