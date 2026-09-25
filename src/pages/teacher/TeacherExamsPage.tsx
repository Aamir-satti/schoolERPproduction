import React, { useState, useEffect } from 'react';
import { examService } from '../../services/examService';
import type { Exam } from '../../types';
import { AlertCircle } from 'lucide-react';

const TeacherExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examService.getAll().then(res => setExams(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full"></div></div>;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Exams & Marks</h1><p className="text-gray-500">View exams and enter marks</p></div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Exam</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Term</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {exams.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No exams found.</td></tr>
            ) : exams.map((exam) => (
              <tr key={exam._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{exam.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{exam.term}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{new Date(exam.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${exam.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{exam.status}</span></td>
                <td className="px-4 py-3"><button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Enter Marks</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherExamsPage;
