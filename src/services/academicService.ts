import apiClient from '../api/axios';
import type { ApiResponse, ClassInfo, SubjectInfo, TimetableEntry } from '../types';

export const academicService = {
  // Classes
  getClasses: async (): Promise<ApiResponse<ClassInfo[]>> => {
    const response = await apiClient.get<ApiResponse<ClassInfo[]>>('/classes');
    return response.data;
  },

  getClass: async (id: string): Promise<ApiResponse<ClassInfo>> => {
    const response = await apiClient.get<ApiResponse<ClassInfo>>(`/classes/${id}`);
    return response.data;
  },

  createClass: async (data: { name: string; code: string }): Promise<ApiResponse<ClassInfo>> => {
    const response = await apiClient.post<ApiResponse<ClassInfo>>('/classes', data);
    return response.data;
  },

  updateClass: async (id: string, data: Partial<ClassInfo>): Promise<ApiResponse<ClassInfo>> => {
    const response = await apiClient.put<ApiResponse<ClassInfo>>(`/classes/${id}`, data);
    return response.data;
  },

  // Subjects
  getSubjects: async (params?: Record<string, string>): Promise<ApiResponse<SubjectInfo[]>> => {
    const response = await apiClient.get<ApiResponse<SubjectInfo[]>>('/subjects', { params });
    return response.data;
  },

  createSubject: async (data: Partial<SubjectInfo>): Promise<ApiResponse<SubjectInfo>> => {
    const response = await apiClient.post<ApiResponse<SubjectInfo>>('/subjects', data);
    return response.data;
  },

  // Timetables
  getClassTimetable: async (classId: string, sectionId: string): Promise<ApiResponse<TimetableEntry[]>> => {
    const response = await apiClient.get<ApiResponse<TimetableEntry[]>>(`/timetables/class/${classId}/section/${sectionId}`);
    return response.data;
  },

  getTeacherTimetable: async (teacherId: string): Promise<ApiResponse<TimetableEntry[]>> => {
    const response = await apiClient.get<ApiResponse<TimetableEntry[]>>(`/timetables/teacher/${teacherId}`);
    return response.data;
  },

  createTimetableEntry: async (data: Partial<TimetableEntry>): Promise<ApiResponse<TimetableEntry>> => {
    const response = await apiClient.post<ApiResponse<TimetableEntry>>('/timetables', data);
    return response.data;
  },
};
