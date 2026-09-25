import apiClient from '../api/axios';
import type { ApiResponse, AttendanceRecord, AttendanceReport, AttendanceStatus } from '../types';

export const attendanceService = {
  markAttendance: async (data: {
    classId: string;
    date: string;
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[];
  }): Promise<ApiResponse<AttendanceRecord[]>> => {
    const response = await apiClient.post<ApiResponse<AttendanceRecord[]>>('/attendance', data);
    return response.data;
  },

  getClassAttendance: async (classId: string, date: string): Promise<ApiResponse<AttendanceRecord[]>> => {
    const response = await apiClient.get<ApiResponse<AttendanceRecord[]>>(`/attendance/class/${classId}/date/${date}`);
    return response.data;
  },

  getStudentAttendance: async (studentId: string, params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<AttendanceRecord[]>> => {
    const response = await apiClient.get<ApiResponse<AttendanceRecord[]>>(`/attendance/student/${studentId}`, { params });
    return response.data;
  },

  getStudentReport: async (studentId: string, params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<AttendanceReport>> => {
    const response = await apiClient.get<ApiResponse<AttendanceReport>>(`/attendance/report/student/${studentId}`, { params });
    return response.data;
  },

  getClassReport: async (classId: string, params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<AttendanceReport>> => {
    const response = await apiClient.get<ApiResponse<AttendanceReport>>(`/attendance/report/class/${classId}`, { params });
    return response.data;
  },

  downloadStudentReportPDF: async (studentId: string, params?: { startDate?: string; endDate?: string }): Promise<Blob> => {
    const response = await apiClient.get(`/attendance/report/student/${studentId}/pdf`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  downloadClassReportPDF: async (classId: string, params?: { startDate?: string; endDate?: string }): Promise<Blob> => {
    const response = await apiClient.get(`/attendance/report/class/${classId}/pdf`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
