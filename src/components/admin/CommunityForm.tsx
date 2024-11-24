import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createBrowserClient } from '@/lib/supabase-browser';

interface CommunityFormData {
  name: string;
  platform: string;
  url: string;
  members_count: number;
  country_code: string;
}

export default function CommunityForm() {
  const supabase = createBrowserClient();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ code: string; name: string; }[]>([]);
  const [formData, setFormData] = useState<CommunityFormData>({
    name: '',
    platform: '',
    url: '',
    members_count: 0,
    country_code: ''
  });

  useEffect(() => {
    fetchCountries();
    if (id) {
      fetchCommunity();
    }
  }, [id]);

  async function fetchCountries() {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  }

  async function fetchCommunity() {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setFormData(data);
    } catch (error) {
      console.error('Error fetching community:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        const { error } = await supabase
          .from('communities')
          .update(formData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('communities')
          .insert([formData]);
        if (error) throw error;
      }

      navigate('/admin/communities');
    } catch (error) {
      console.error('Error saving community:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'members_count' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Edit Community' : 'New Community'}
      </h2>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Community Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            >
              <option value="">Select platform</option>
              <option value="Facebook">Facebook</option>
              <option value="Reddit">Reddit</option>
              <option value="Discord">Discord</option>
              <option value="Telegram">Telegram</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Members
            </label>
            <input
              type="number"
              name="members_count"
              value={formData.members_count}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/communities')}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Community'}
          </button>
        </div>
      </form>
    </div>
  );
}