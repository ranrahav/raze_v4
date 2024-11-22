import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Mentor {
  id: string;
  name: string;
  phone: string;
  email: string;
  country_code: string;
  relocated_at: string;
}

function MentorsList() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [countries, setCountries] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchMentors(), fetchCountries()]);
  }, []);

  async function fetchMentors() {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMentors(data || []);
    } catch (error: any) {
      console.error('Error fetching mentors:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCountries() {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*');

      if (error) throw error;
      
      const countryMap = (data || []).reduce((acc: { [key: string]: string }, country: any) => {
        acc[country.code] = country.name;
        return acc;
      }, {});
      
      setCountries(countryMap);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  }

  async function deleteMentor(id: string) {
    if (!window.confirm('Are you sure you want to delete this mentor?')) return;

    try {
      const { error } = await supabase
        .from('mentors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMentors(mentors.filter(mentor => mentor.id !== id));
    } catch (error: any) {
      console.error('Error deleting mentor:', error);
      setError(error.message);
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">People Who Relocated</h2>
        <Link
          to="/admin/mentors/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Person
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        {mentors.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No mentors found. Add your first mentor to get started.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Country</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Relocated At</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((mentor) => (
                <tr key={mentor.id} className="border-b border-gray-200 last:border-0">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-800">{mentor.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {countries[mentor.country_code]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">{mentor.email}</div>
                      <div className="text-sm text-gray-600">{mentor.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(mentor.relocated_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/mentors/${mentor.id}`}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => deleteMentor(mentor.id)}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MentorsList;