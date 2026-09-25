import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../types';
import { Bell, Calendar, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';

const GuestHomePage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getPublic();
        setNotifications(response.data);
      } catch {
        setError('Unable to load announcements. The server may be unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Excellence in Education
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            A comprehensive school management system for students, teachers, and administrators.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-indigo-200">Students</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-2xl font-bold">50+</p>
              <p className="text-sm text-indigo-200">Teachers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-2xl font-bold">20+</p>
              <p className="text-sm text-indigo-200">Courses</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">About Our School</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              We are committed to providing quality education and a nurturing environment for every student.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-indigo-50">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Excellence</h3>
              <p className="text-gray-600 text-sm">Rigorous curriculum designed to challenge and inspire students at every level.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-emerald-50">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Faculty</h3>
              <p className="text-gray-600 text-sm">Experienced and dedicated teachers committed to student success.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏫</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Facilities</h3>
              <p className="text-gray-600 text-sm">State-of-the-art infrastructure supporting holistic development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications/Announcements Section */}
      <section id="notifications" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Announcements</h2>
            <p className="mt-3 text-gray-500">Latest news and updates from the school</p>
          </div>

          {error && (
            <div className="max-w-lg mx-auto p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto"></div>
              <p className="mt-3 text-gray-500">Loading announcements...</p>
            </div>
          ) : notifications.length === 0 && !error ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No announcements at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notifications.map((notification) => (
                <div key={notification._id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'ACADEMIC' ? 'bg-blue-100' :
                      notification.type === 'FINANCIAL' ? 'bg-green-100' :
                      notification.type === 'EVENT' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <Bell size={18} className={
                        notification.type === 'ACADEMIC' ? 'text-blue-600' :
                        notification.type === 'FINANCIAL' ? 'text-green-600' :
                        notification.type === 'EVENT' ? 'text-purple-600' : 'text-gray-600'
                      } />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.publicationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
            <p className="mt-3 text-gray-500">Get in touch with us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6">
              <MapPin className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Address</h3>
              <p className="text-sm text-gray-600 mt-1">123 Education Street<br />City, State 12345</p>
            </div>
            <div className="text-center p-6">
              <Phone className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Phone</h3>
              <p className="text-sm text-gray-600 mt-1">+1 (555) 123-4567</p>
            </div>
            <div className="text-center p-6">
              <Mail className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-sm text-gray-600 mt-1">info@school.edu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Info */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Admissions Open</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            We are now accepting applications for the upcoming academic year. 
            Contact our admissions office for more information about enrollment procedures.
          </p>
          <div className="flex items-center justify-center gap-2 text-indigo-600">
            <Calendar size={18} />
            <span className="font-medium">Application Deadline: March 31, 2026</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestHomePage;
