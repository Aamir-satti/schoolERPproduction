import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import type { AdminDashboardData } from '../../types';
import { GraduationCap, Users, BookOpen, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: AdminDashboardData }>('/dashboard/admin');
        setData(response.data.data);
      } catch {
        setError('Unable to connect to server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-400 mt-1">Backend server may not be running.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of school operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <GraduationCap size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.studentCount ?? 0}</p>
              <p className="text-sm text-gray-500">Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Users size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.teacherCount ?? 0}</p>
              <p className="text-sm text-gray-500">Teachers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BookOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.classCount ?? 0}</p>
              <p className="text-sm text-gray-500">Classes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.attendanceSummary ? `${Math.round((data.attendanceSummary.presentToday / data.attendanceSummary.totalStudents) * 100)}%` : '0%'}
              </p>
              <p className="text-sm text-gray-500">Today's Attendance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            Fee Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Due</span>
              <span className="font-semibold">${(data?.feeSummary?.totalDue ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Collected</span>
              <span className="font-semibold text-green-600">${(data?.feeSummary?.totalCollected ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Outstanding</span>
              <span className="font-semibold text-red-600">${(data?.feeSummary?.outstanding ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold text-blue-600">${(data?.feeSummary?.currentMonthCollection ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={20} className="text-purple-600" />
            Salary Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Due</span>
              <span className="font-semibold">${(data?.salarySummary?.totalDue ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Paid</span>
              <span className="font-semibold text-green-600">${(data?.salarySummary?.totalPaid ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unpaid Records</span>
              <span className="font-semibold text-red-600">{data?.salarySummary?.unpaidCount ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Overview */}
      <div className="bg-white rounded-xl border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{data?.attendanceSummary?.presentToday ?? 0}</p>
            <p className="text-sm text-green-600">Present</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-700">{data?.attendanceSummary?.absentToday ?? 0}</p>
            <p className="text-sm text-red-600">Absent</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">{data?.attendanceSummary?.totalStudents ?? 0}</p>
            <p className="text-sm text-blue-600">Total</p>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <p className="text-2xl font-bold text-indigo-700">
              {data?.attendanceSummary?.totalStudents ? 
                `${Math.round(((data.attendanceSummary.totalStudents - data.attendanceSummary.absentToday) / data.attendanceSummary.totalStudents) * 100)}%` 
                : '0%'}
            </p>
            <p className="text-sm text-indigo-600">Rate</p>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      {data?.recentNotifications && data.recentNotifications.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {data.recentNotifications.slice(0, 5).map((notification) => (
              <div key={notification._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(notification.publicationDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
