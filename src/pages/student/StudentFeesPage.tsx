import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { DollarSign } from 'lucide-react';

const StudentFeesPage: React.FC = () => {
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setLoading(false); }, []);

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Fee Details</h1><p className="text-gray-500">View your fee status and payment history</p></div>

      <div className="bg-white rounded-xl border p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><DollarSign size={20} className="text-red-600" /></div>
          <div><p className="text-2xl font-bold text-gray-900">$0</p><p className="text-sm text-gray-500">Outstanding Balance</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50"><h3 className="font-semibold text-gray-900">Payment History</h3></div>
        <div className="p-6 text-center text-gray-500 text-sm">
          No payment records found. Fee data will be loaded from the server.
        </div>
      </div>
    </div>
  );
};

export default StudentFeesPage;
