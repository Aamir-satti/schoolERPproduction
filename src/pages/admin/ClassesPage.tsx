import React, { useState, useEffect } from 'react';
import { academicService } from '../../services/academicService';
import type { ClassInfo } from '../../types';
import { Plus, AlertCircle, Edit, Trash2 } from 'lucide-react';

const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '' });

  const fetchData = async () => {
    try {
      const res = await academicService.getClasses();
      setClasses(res.data);
    } catch { setError('Unable to load classes.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await academicService.createClass(formData);
      setShowModal(false);
      setFormData({ name: '', code: '' });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create class');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Classes</h1><p className="text-gray-500">Manage classes and sections</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"><Plus size={18} /> Add Class</button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div key={cls._id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
              <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{cls.code}</span>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-1">Sections:</p>
              <div className="flex gap-1 flex-wrap">
                {cls.sections?.length > 0 ? cls.sections.map((s, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{s.name}</span>
                )) : <span className="text-xs text-gray-400">No sections</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-center py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100">Edit</button>
              <button className="flex-1 text-center py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">Students</button>
            </div>
          </div>
        ))}
        {classes.length === 0 && <div className="col-span-3 text-center py-8 text-gray-500">No classes found. Create your first class.</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="border-b px-6 py-4"><h2 className="text-lg font-semibold">Add New Class</h2></div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Class 10" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Class Code *</label>
                <input type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., CLS10" /></div>
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

export default ClassesPage;
