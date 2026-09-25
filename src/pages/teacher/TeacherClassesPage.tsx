import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { academicService } from '../../services/academicService';
import type { ClassInfo, TimetableEntry } from '../../types';
import { BookOpen, Calendar } from 'lucide-react';

const TeacherClassesPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await apiClient.get('/teachers/me/classes');
        setClasses(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch teacher classes:', err);
      } finally { setLoading(false); }
    };
    fetchClasses();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full"></div></div>;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">My Classes</h1><p className="text-gray-500">Classes assigned to you</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">No classes assigned yet.</div>
        ) : classes.map((cls) => (
          <div key={cls._id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><BookOpen size={20} className="text-emerald-600" /></div>
              <div><h3 className="font-semibold text-gray-900">{cls.name}</h3><p className="text-xs text-gray-500">{cls.code}</p></div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {cls.sections?.map((s, i) => <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{s.name}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherClassesPage;
