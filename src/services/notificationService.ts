import apiClient from '../api/axios';
import type { ApiResponse, Notification } from '../types';

export const notificationService = {
  getAll: async (params?: Record<string, string>): Promise<ApiResponse<Notification[]>> => {
    const response = await apiClient.get<ApiResponse<Notification[]>>('/notifications', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.get<ApiResponse<Notification>>(`/notifications/${id}`);
    return response.data;
  },

  create: async (data: Partial<Notification>): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.post<ApiResponse<Notification>>('/notifications', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Notification>): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.put<ApiResponse<Notification>>(`/notifications/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/notifications/${id}`);
    return response.data;
  },

  getPublic: async (): Promise<ApiResponse<Notification[]>> => {
    const response = await apiClient.get<ApiResponse<Notification[]>>('/notifications/public');
    return response.data;
  },
};
