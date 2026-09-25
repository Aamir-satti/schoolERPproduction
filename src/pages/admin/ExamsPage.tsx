import React, { useState, useEffect } from 'react';
import { examService } from '../../services/examService';
import type { Exam } from '../../types';
import { Plus, AlertCircle, Eye } from 'lucide-react';

const ExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    examService.getAll().then(res => setExams(res.data)).catch(() => setError('Unable to load exams.')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Examinations</h1><p className="text-gray-500">Manage exams and assessments</p></div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"><Plus size={18} /> Create Exam</button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">{error}</div>}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Exam Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Term</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Academic Year</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {exams.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No exams found.</td></tr>
            ) : exams.map((exam) => (
              <tr key={exam._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{exam.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{exam.term}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{exam.academicYear}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${exam.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : exam.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{exam.status}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${exam.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{exam.isPublished ? 'Yes' : 'No'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamsPage;
