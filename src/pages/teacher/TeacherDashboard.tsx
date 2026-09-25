import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import type { TeacherDashboardData } from '../../types';
import { BookOpen, Calendar, ClipboardCheck, FileText, AlertCircle } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: TeacherDashboardData }>('/dashboard/teacher');
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
        <div className="animate-spin w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full"></div>
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

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const today = days[new Date().getDay() - 1] || 'MONDAY';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-500">Welcome back!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.assignedClasses?.length ?? 0}</p>
              <p className="text-sm text-gray-500">My Classes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Calendar size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.todayTimetable?.length ?? 0}</p>
              <p className="text-sm text-gray-500">Today's Classes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <ClipboardCheck size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.attendanceTasks?.filter(t => !t.marked).length ?? 0}
              </p>
              <p className="text-sm text-gray-500">Pending Attendance</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <FileText size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.upcomingExams?.length ?? 0}</p>
              <p className="text-sm text-gray-500">Upcoming Exams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Timetable */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule ({today})</h3>
        {data?.todayTimetable && data.todayTimetable.length > 0 ? (
          <div className="space-y-3">
            {data.todayTimetable
              .filter(t => t.dayOfWeek === today)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((entry) => (
                <div key={entry._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm font-semibold text-indigo-600">{entry.startTime}</p>
                    <p className="text-xs text-gray-500">{entry.endTime}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{entry.subjectId?.name}</p>
                    <p className="text-sm text-gray-500">{entry.classId?.name} {entry.roomNo ? `• Room ${entry.roomNo}` : ''}</p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No classes scheduled for today.</p>
        )}
      </div>

      {/* Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Tasks</h3>
          {data?.attendanceTasks && data.attendanceTasks.length > 0 ? (
            <div className="space-y-2">
              {data.attendanceTasks.map((task, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{task.classId?.name} - {task.date}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${task.marked ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {task.marked ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No attendance tasks.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Exams</h3>
          {data?.upcomingExams && data.upcomingExams.length > 0 ? (
            <div className="space-y-2">
              {data.upcomingExams.map((exam) => (
                <div key={exam._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                    <p className="text-xs text-gray-500">{new Date(exam.startDate).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{exam.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No upcoming exams.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
