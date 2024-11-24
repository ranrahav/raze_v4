import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Globe } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase-browser';

interface Community {
  id: string;
  name: string;
  platform: string;
  url: string;
  members_count: number;
  country_code: string;
}

export default function CommunitiesList() {
  const supabase = createBrowserClient();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [countries, setCountries] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchCommunities(), fetchCountries()]);
  }, []);

  async function fetchCommunities() {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (error: any) {
      console.error('Error fetching communities:', error);
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

  async function deleteCommunity(id: string) {
    if (!window.confirm('Are you sure you want to delete this community?')) return;

    try {
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCommunities(communities.filter(community => community.id !== id));
    } catch (error: any) {
      console.error('Error deleting community:', error);
      setError(error.message);
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Communities</h2>
        <Link
          to="/admin/communities/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Community
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        {communities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No communities found. Add your first community to get started.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Country</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Platform</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Members</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {communities.map((community) => (
                <tr key={community.id} className="border-b border-gray-200 last:border-0">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-800">{community.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {countries[community.country_code]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a
                        href={community.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {community.platform}
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {community.members_count.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/communities/${community.id}`}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => deleteCommunity(community.id)}
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