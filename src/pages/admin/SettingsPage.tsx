import React from 'react';
import { School, MapPin, Phone, Mail } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-gray-500">School configuration and system settings</p></div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><School size={20} /> School Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
              <input type="text" defaultValue="School Management System" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" defaultValue="info@school.edu" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <input type="text" defaultValue="2025-2026" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea defaultValue="123 Education Street, City, State 12345" rows={2} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          </div>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save Changes</button>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Version</span><span className="font-medium">1.0.0</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Environment</span><span className="font-medium">{import.meta.env.MODE}</span></div>
            <div className="flex justify-between py-2"><span className="text-gray-600">API URL</span><span className="font-medium">{import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
