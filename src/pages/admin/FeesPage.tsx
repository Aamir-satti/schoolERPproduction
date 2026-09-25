import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { AlertCircle, DollarSign } from 'lucide-react';

const FeesPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    financeService.getFeeDashboard().then(res => setDashboard(res.data)).catch(() => setError('Unable to load fee data.')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div></div>;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Fee Management</h1><p className="text-gray-500">Manage student fees and payments</p></div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><DollarSign size={20} className="text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">${dashboard?.totalDue?.toLocaleString() || 0}</p><p className="text-sm text-gray-500">Total Due</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><DollarSign size={20} className="text-green-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">${dashboard?.totalCollected?.toLocaleString() || 0}</p><p className="text-sm text-gray-500">Collected</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><DollarSign size={20} className="text-red-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">${dashboard?.outstanding?.toLocaleString() || 0}</p><p className="text-sm text-gray-500">Outstanding</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><DollarSign size={20} className="text-purple-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">${dashboard?.currentMonthCollection?.toLocaleString() || 0}</p><p className="text-sm text-gray-500">This Month</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Structures</h3>
        <p className="text-gray-500 text-sm">Manage fee structures for different classes and academic years.</p>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Create Fee Structure</button>
      </div>
    </div>
  );
};

export default FeesPage;
