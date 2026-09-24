import apiClient from '../api/axios';
import type { ApiResponse, FeeStructure, FeePayment, FeeLedgerEntry, SalaryProfile, SalaryRecord } from '../types';

export const financeService = {
  // Fee Structures
  getFeeStructures: async (params?: Record<string, string>): Promise<ApiResponse<FeeStructure[]>> => {
    const response = await apiClient.get<ApiResponse<FeeStructure[]>>('/fees/structures', { params });
    return response.data;
  },

  getFeeStructure: async (id: string): Promise<ApiResponse<FeeStructure>> => {
    const response = await apiClient.get<ApiResponse<FeeStructure>>(`/fees/structures/${id}`);
    return response.data;
  },

  createFeeStructure: async (data: Partial<FeeStructure>): Promise<ApiResponse<FeeStructure>> => {
    const response = await apiClient.post<ApiResponse<FeeStructure>>('/fees/structures', data);
    return response.data;
  },

  updateFeeStructure: async (id: string, data: Partial<FeeStructure>): Promise<ApiResponse<FeeStructure>> => {
    const response = await apiClient.put<ApiResponse<FeeStructure>>(`/fees/structures/${id}`, data);
    return response.data;
  },

  // Fee Ledger
  getStudentLedger: async (studentId: string): Promise<ApiResponse<FeeLedgerEntry[]>> => {
    const response = await apiClient.get<ApiResponse<FeeLedgerEntry[]>>(`/fees/student/${studentId}/ledger`);
    return response.data;
  },

  // Fee Payments
  recordPayment: async (data: Partial<FeePayment>): Promise<ApiResponse<FeePayment>> => {
    const response = await apiClient.post<ApiResponse<FeePayment>>('/fees/payments', data);
    return response.data;
  },

  getPayment: async (id: string): Promise<ApiResponse<FeePayment>> => {
    const response = await apiClient.get<ApiResponse<FeePayment>>(`/fees/payments/${id}`);
    return response.data;
  },

  downloadChallanPDF: async (paymentId: string): Promise<Blob> => {
    const response = await apiClient.get(`/fees/challan/${paymentId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Dashboard
  getFeeDashboard: async (): Promise<ApiResponse<{
    totalDue: number;
    totalCollected: number;
    outstanding: number;
    currentMonthCollection: number;
  }>> => {
    const response = await apiClient.get('/fees/dashboard');
    return response.data;
  },

  // Salary Profiles
  getSalaryProfiles: async (): Promise<ApiResponse<SalaryProfile[]>> => {
    const response = await apiClient.get<ApiResponse<SalaryProfile[]>>('/salaries/profiles');
    return response.data;
  },

  createSalaryProfile: async (data: Partial<SalaryProfile>): Promise<ApiResponse<SalaryProfile>> => {
    const response = await apiClient.post<ApiResponse<SalaryProfile>>('/salaries/profiles', data);
    return response.data;
  },

  // Salary Records
  getSalaryRecords: async (params?: Record<string, string>): Promise<ApiResponse<SalaryRecord[]>> => {
    const response = await apiClient.get<ApiResponse<SalaryRecord[]>>('/salaries/records', { params });
    return response.data;
  },

  generateMonthlySalaries: async (month: string): Promise<ApiResponse<SalaryRecord[]>> => {
    const response = await apiClient.post<ApiResponse<SalaryRecord[]>>('/salaries/records/generate', { month });
    return response.data;
  },

  recordSalaryPayment: async (id: string, data: { paidAmount: number; paymentMethod: string; referenceNo?: string; remarks?: string }): Promise<ApiResponse<SalaryRecord>> => {
    const response = await apiClient.post<ApiResponse<SalaryRecord>>(`/salaries/records/${id}/pay`, data);
    return response.data;
  },

  getSalaryDashboard: async (): Promise<ApiResponse<{
    totalDue: number;
    totalPaid: number;
    unpaidCount: number;
  }>> => {
    const response = await apiClient.get('/salaries/dashboard');
    return response.data;
  },
};
