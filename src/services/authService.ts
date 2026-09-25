import apiClient from '../api/axios';
import type { LoginRequest, LoginResponse, ApiResponse, User } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/change-password', data);
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
    return response.data;
  },
};
