import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../types';
import { Bell } from 'lucide-react';

const StudentNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationService.getAll().then(res => setNotifications(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div></div>;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Notifications</h1><p className="text-gray-500">View your notifications</p></div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center"><Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No notifications.</p></div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif._id} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${notif.type === 'ACADEMIC' ? 'bg-blue-100 text-blue-700' : notif.type === 'FINANCIAL' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{notif.type}</span>
              </div>
              <p className="text-sm text-gray-600">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(notif.publicationDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotificationsPage;
