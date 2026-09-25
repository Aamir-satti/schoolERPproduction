import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import type { Result } from '../../types';
import { FileText } from 'lucide-react';

const StudentResultsPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await apiClient.get('/students/me/results');
        setResults(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">My Results</h1><p className="text-gray-500">View your exam results</p></div>

      {results.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No results available yet.</p>
          <p className="text-sm text-gray-400 mt-1">Results will appear here once published by the administration.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result, idx) => (
            <div key={idx} className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{result.examId?.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${result.resultStatus === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{result.resultStatus}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-lg font-bold">{result.totalObtained}/{result.totalMax}</p><p className="text-xs text-gray-500">Marks</p></div>
                <div><p className="text-lg font-bold">{result.percentage}%</p><p className="text-xs text-gray-500">Percentage</p></div>
                <div><p className="text-lg font-bold">{result.grade}</p><p className="text-xs text-gray-500">Grade</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentResultsPage;
