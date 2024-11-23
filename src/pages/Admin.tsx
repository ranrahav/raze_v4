import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { LayoutDashboard, Users, Map, Settings, Users2, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Auth from '../components/admin/Auth';
import ProvidersList from '../components/admin/ProvidersList';
import ProviderForm from '../components/admin/ProviderForm';
import CountrySteps from '../components/admin/CountrySteps';
import MentorsList from '../components/admin/MentorsList';
import MentorForm from '../components/admin/MentorForm';
import CommunitiesList from '../components/admin/CommunitiesList';
import CommunityForm from '../components/admin/CommunityForm';

function Admin() {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/providers', icon: Users, label: 'Service Providers' },
    { path: '/admin/mentors', icon: Users2, label: 'People' },
    { path: '/admin/communities', icon: Globe, label: 'Communities' },
    { path: '/admin/countries', icon: Map, label: 'Country Steps' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white min-h-screen border-r border-gray-200 fixed">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-800">Raze Admin</h1>
          </div>
          <nav className="mt-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 w-full p-4">
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/providers" element={<ProvidersList />} />
              <Route path="/providers/new" element={<ProviderForm />} />
              <Route path="/providers/:id" element={<ProviderForm />} />
              <Route path="/mentors" element={<MentorsList />} />
              <Route path="/mentors/new" element={<MentorForm />} />
              <Route path="/mentors/:id" element={<MentorForm />} />
              <Route path="/communities" element={<CommunitiesList />} />
              <Route path="/communities/new" element={<CommunityForm />} />
              <Route path="/communities/:id" element={<CommunityForm />} />
              <Route path="/countries" element={<CountrySteps />} />
              <Route path="/settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add dashboard widgets here */}
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
      {/* Add settings form here */}
    </div>
  );
}

export default Admin;