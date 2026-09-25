import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import type { StudentDashboardData } from '../../types';
import { Calendar, ClipboardCheck, FileText, DollarSign, Bell, AlertCircle } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: StudentDashboardData }>('/dashboard/student');
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
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const today = days[new Date().getDay() - 1] || 'MONDAY';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-500">Welcome back!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ClipboardCheck size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.attendancePercentage ?? 0}%</p>
              <p className="text-sm text-gray-500">Attendance</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.timetable?.filter(t => t.dayOfWeek === today).length ?? 0}
              </p>
              <p className="text-sm text-gray-500">Today's Classes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <FileText size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.recentResults?.length ?? 0}</p>
              <p className="text-sm text-gray-500">Results</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <DollarSign size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${data?.outstandingFee ?? 0}</p>
              <p className="text-sm text-gray-500">Fee Due</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            Today's Schedule
          </h3>
          {data?.timetable && data.timetable.filter(t => t.dayOfWeek === today).length > 0 ? (
            <div className="space-y-3">
              {data.timetable
                .filter(t => t.dayOfWeek === today)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((entry) => (
                  <div key={entry._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center min-w-[70px]">
                      <p className="text-sm font-semibold text-blue-600">{entry.startTime}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{entry.subjectId?.name}</p>
                      <p className="text-xs text-gray-500">Room {entry.roomNo || 'TBA'}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No classes today.</p>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-purple-600" />
            Recent Results
          </h3>
          {data?.recentResults && data.recentResults.length > 0 ? (
            <div className="space-y-3">
              {data.recentResults.map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{result.examId?.name}</p>
                    <p className="text-xs text-gray-500">{result.totalObtained}/{result.totalMax} marks</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{result.percentage}%</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${result.resultStatus === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {result.resultStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No results available yet.</p>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={20} className="text-amber-600" />
            Notifications
          </h3>
          {data?.notifications && data.notifications.length > 0 ? (
            <div className="space-y-2">
              {data.notifications.slice(0, 5).map((notif) => (
                <div key={notif._id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                    <p className="text-xs text-gray-500">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No new notifications.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
