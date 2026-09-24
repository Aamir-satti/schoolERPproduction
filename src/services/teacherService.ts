import apiClient from '../api/axios';
import type { ApiResponse, PaginatedResponse, Teacher, CreateTeacherRequest, ClassInfo } from '../types';

export const teacherService = {
  getAll: async (params?: Record<string, string>): Promise<PaginatedResponse<Teacher>> => {
    const response = await apiClient.get<PaginatedResponse<Teacher>>('/teachers', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Teacher>> => {
    const response = await apiClient.get<ApiResponse<Teacher>>(`/teachers/${id}`);
    return response.data;
  },

  create: async (data: CreateTeacherRequest): Promise<ApiResponse<Teacher>> => {
    const response = await apiClient.post<ApiResponse<Teacher>>('/teachers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTeacherRequest>): Promise<ApiResponse<Teacher>> => {
    const response = await apiClient.put<ApiResponse<Teacher>>(`/teachers/${id}`, data);
    return response.data;
  },

  getClasses: async (id: string): Promise<ApiResponse<ClassInfo[]>> => {
    const response = await apiClient.get<ApiResponse<ClassInfo[]>>(`/teachers/${id}/classes`);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<Teacher>> => {
    const response = await apiClient.get<ApiResponse<Teacher>>('/teachers/profile');
    return response.data;
  },
};
