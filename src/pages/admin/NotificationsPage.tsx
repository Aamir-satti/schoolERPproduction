import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../types';
import { Plus, Bell, AlertCircle } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'GENERAL', isPublic: false, publicationDate: new Date().toISOString().split('T')[0] });

  const fetchData = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data);
    } catch { setError('Unable to load notifications.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await notificationService.create(formData as any);
      setShowModal(false);
      setFormData({ title: '', message: '', type: 'GENERAL', isPublic: false, publicationDate: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create notification'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Notifications</h1><p className="text-gray-500">Manage announcements and notifications</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"><Plus size={18} /> Create Notification</button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">{error}</div>}

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center"><Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No notifications yet.</p></div>
        ) : notifications.map((notif) => (
          <div key={notif._id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${notif.type === 'ACADEMIC' ? 'bg-blue-100 text-blue-700' : notif.type === 'FINANCIAL' ? 'bg-green-100 text-green-700' : notif.type === 'EVENT' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{notif.type}</span>
                  {notif.isPublic && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Public</span>}
                </div>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(notif.publicationDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="border-b px-6 py-4"><h2 className="text-lg font-semibold">Create Notification</h2></div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="GENERAL">General</option><option value="ACADEMIC">Academic</option><option value="FINANCIAL">Financial</option><option value="EVENT">Event</option>
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Publication Date *</label>
                  <input type="date" required value={formData.publicationDate} onChange={(e) => setFormData({...formData, publicationDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              </div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isPublic} onChange={(e) => setFormData({...formData, isPublic: e.target.checked})} className="rounded" /><span className="text-sm text-gray-700">Make public (visible on homepage)</span></label>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
