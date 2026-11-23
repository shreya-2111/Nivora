import { apiClient } from '@/lib/apiClient';
import { MenuCategoryWithItems, BackendMenuItem } from '@/types/api';

export const menuService = {
  async getMenu(): Promise<{ categories: MenuCategoryWithItems[] }> {
    return apiClient.get<{ categories: MenuCategoryWithItems[] }>('/api/menu');
  },

  async createCategory(payload: { name: string; description?: string; is_active?: boolean }): Promise<{ category: any }> {
    return apiClient.post<{ category: any }>('/api/menu/categories', payload);
  },

  async updateCategory(id: string, payload: Partial<{ name: string; description: string; is_active: boolean }>): Promise<{ category: any }> {
    return apiClient.patch<{ category: any }>(`/api/menu/categories/${id}`, payload);
  },

  async deleteCategory(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/menu/categories/${id}`);
  },

  async reorderCategories(ids: string[]): Promise<{ message: string }> {
    return apiClient.patch<{ message: string }>('/api/menu/categories/reorder', { ids });
  },

  async createItem(payload: FormData | any): Promise<{ item: BackendMenuItem }> {
    return apiClient.post<{ item: BackendMenuItem }>('/api/menu/items', payload);
  },

  async updateItem(id: string, payload: FormData | any): Promise<{ item: BackendMenuItem }> {
    return apiClient.patch<{ item: BackendMenuItem }>(`/api/menu/items/${id}`, payload);
  },

  async deleteItem(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/menu/items/${id}`);
  },

  async reorderItems(ids: string[]): Promise<{ message: string }> {
    return apiClient.patch<{ message: string }>('/api/menu/items/reorder', { ids });
  },
};
