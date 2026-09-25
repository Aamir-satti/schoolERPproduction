import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';

const GuestLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">School Management System</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Home</Link>
              <Link to="/#about" className="text-gray-600 hover:text-gray-900 text-sm font-medium">About</Link>
              <Link to="/#notifications" className="text-gray-600 hover:text-gray-900 text-sm font-medium">News</Link>
              <Link to="/#contact" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Contact</Link>
              {isAuthenticated ? (
                <Link
                  to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'TEACHER' ? '/teacher' : '/student'}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Login
                </Link>
              )}
            </nav>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-3">
                <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/#about" className="text-gray-600 hover:text-gray-900 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>About</Link>
                <Link to="/#notifications" className="text-gray-600 hover:text-gray-900 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>News</Link>
                <Link to="/#contact" className="text-gray-600 hover:text-gray-900 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                {isAuthenticated ? (
                  <Link
                    to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'TEACHER' ? '/teacher' : '/student'}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-3">School Management System</h3>
              <p className="text-sm">A comprehensive solution for managing academic, administrative, and financial operations.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-sm hover:text-white">Home</Link>
                <Link to="/login" className="text-sm hover:text-white">Login</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Contact</h3>
              <p className="text-sm">Email: info@school.edu</p>
              <p className="text-sm">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm">
            © {new Date().getFullYear()} School Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;
