import apiClient from '../api/axios';
import type { ApiResponse, PaginatedResponse, Student, CreateStudentRequest } from '../types';

export const studentService = {
  getAll: async (params?: Record<string, string>): Promise<PaginatedResponse<Student>> => {
    const response = await apiClient.get<PaginatedResponse<Student>>('/students', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Student>> => {
    const response = await apiClient.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data;
  },

  create: async (data: CreateStudentRequest): Promise<ApiResponse<Student>> => {
    const response = await apiClient.post<ApiResponse<Student>>('/students', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateStudentRequest>): Promise<ApiResponse<Student>> => {
    const response = await apiClient.put<ApiResponse<Student>>(`/students/${id}`, data);
    return response.data;
  },

  deactivate: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch<ApiResponse<null>>(`/students/${id}/status`, { isActive: false });
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<Student>> => {
    const response = await apiClient.get<ApiResponse<Student>>('/students/profile');
    return response.data;
  },
};
