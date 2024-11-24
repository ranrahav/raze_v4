import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase-browser';

interface Provider {
  id: string;
  name: string;
  type: string;
  website: string;
  phone: string;
  email: string;
  image_url: string;
  countries: string[];
  created_at: string;
}

interface Country {
  code: string;
  name: string;
}

export default function ProvidersList() {
  const supabase = createBrowserClient();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [countries, setCountries] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchProviders(), fetchCountries()]);
  }, []);

  async function fetchProviders() {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to fetch providers. Please try again later.');
      }
      
      setProviders(data || []);
    } catch (error: any) {
      console.error('Error fetching providers:', error);
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
      
      const countryMap = (data || []).reduce((acc: { [key: string]: string }, country: Country) => {
        acc[country.code] = country.name;
        return acc;
      }, {});
      
      setCountries(countryMap);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  }

  async function deleteProvider(id: string) {
    if (!window.confirm('Are you sure you want to delete this provider?')) return;

    try {
      setError(null);
      const { error } = await supabase
        .from('providers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to delete provider. Please try again later.');
      }

      setProviders(providers.filter(provider => provider.id !== id));
    } catch (error: any) {
      console.error('Error deleting provider:', error);
      setError(error.message);
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Service Providers</h2>
        <Link
          to="/admin/providers/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Provider
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        {providers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No providers found. Add your first provider to get started.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Countries</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id} className="border-b border-gray-200 last:border-0">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={provider.image_url}
                        alt={provider.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-800">{provider.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{provider.type}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {provider.countries.map(code => (
                        <span key={code} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {countries[code]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">{provider.email}</div>
                      <div className="text-sm text-gray-600">{provider.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/providers/${provider.id}`}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => deleteProvider(provider.id)}
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