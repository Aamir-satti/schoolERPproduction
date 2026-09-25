import React, { useState, useEffect } from 'react';
import { academicService } from '../../services/academicService';
import type { SubjectInfo, ClassInfo } from '../../types';
import { Plus, AlertCircle } from 'lucide-react';

const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', classIds: [] as string[] });

  const fetchData = async () => {
    try {
      const [subRes, clsRes] = await Promise.all([academicService.getSubjects(), academicService.getClasses()]);
      setSubjects(subRes.data);
      setClasses(clsRes.data);
    } catch { setError('Unable to load subjects.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await academicService.createSubject({ ...formData, teacherIds: [], isActive: true });
      setShowModal(false);
      setFormData({ name: '', code: '', classIds: [] });
      fetchData();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create subject'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Subjects</h1><p className="text-gray-500">Manage subjects</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"><Plus size={18} /> Add Subject</button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">{error}</div>}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Classes</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {subjects.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No subjects found.</td></tr>
            ) : subjects.map((sub) => (
              <tr key={sub._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{sub.code}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{sub.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{sub.classIds?.length || 0} classes</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{sub.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="border-b px-6 py-4"><h2 className="text-lg font-semibold">Add Subject</h2></div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject Code *</label>
                <input type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Assign to Classes</label>
                <select multiple value={formData.classIds} onChange={(e) => setFormData({...formData, classIds: Array.from(e.target.selectedOptions, o => o.value)})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select></div>
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

export default SubjectsPage;
