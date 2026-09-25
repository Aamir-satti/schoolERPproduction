import apiClient from '../api/axios';
import type { ApiResponse, Exam, Mark, Result } from '../types';

export const examService = {
  getAll: async (params?: Record<string, string>): Promise<ApiResponse<Exam[]>> => {
    const response = await apiClient.get<ApiResponse<Exam[]>>('/exams', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Exam>> => {
    const response = await apiClient.get<ApiResponse<Exam>>(`/exams/${id}`);
    return response.data;
  },

  create: async (data: Partial<Exam>): Promise<ApiResponse<Exam>> => {
    const response = await apiClient.post<ApiResponse<Exam>>('/exams', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Exam>): Promise<ApiResponse<Exam>> => {
    const response = await apiClient.put<ApiResponse<Exam>>(`/exams/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/exams/${id}`);
    return response.data;
  },

  // Marks
  enterMarks: async (data: {
    examId: string;
    subjectId: string;
    marks: { studentId: string; obtainedMarks: number; remarks?: string }[];
  }): Promise<ApiResponse<Mark[]>> => {
    const response = await apiClient.post<ApiResponse<Mark[]>>('/marks', data);
    return response.data;
  },

  uploadMarksCSV: async (examId: string, subjectId: string, file: File): Promise<ApiResponse<{ imported: number; failed: number; errors: string[] }>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/marks/upload/${examId}/${subjectId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Results
  getStudentResult: async (studentId: string, examId: string): Promise<ApiResponse<Result>> => {
    const response = await apiClient.get<ApiResponse<Result>>(`/results/student/${studentId}/exam/${examId}`);
    return response.data;
  },

  getStudentResults: async (studentId: string): Promise<ApiResponse<Result[]>> => {
    const response = await apiClient.get<ApiResponse<Result[]>>(`/results/student/${studentId}`);
    return response.data;
  },

  downloadResultPDF: async (studentId: string, examId: string): Promise<Blob> => {
    const response = await apiClient.get(`/results/student/${studentId}/exam/${examId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
