import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createBrowserClient } from '@/lib/supabase-browser';

interface ProviderFormData {
  name: string;
  type: string;
  website: string;
  phone: string;
  email: string;
  image_url: string;
  countries: string[];
}

export default function ProviderForm() {
  const supabase = createBrowserClient();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ code: string; name: string; }[]>([]);
  const [formData, setFormData] = useState<ProviderFormData>({
    name: '',
    type: '',
    website: '',
    phone: '',
    email: '',
    image_url: '',
    countries: []
  });

  useEffect(() => {
    fetchCountries();
    if (id) {
      fetchProvider();
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

  async function fetchProvider() {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setFormData(data);
    } catch (error) {
      console.error('Error fetching provider:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        const { error } = await supabase
          .from('providers')
          .update(formData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('providers')
          .insert([formData]);
        if (error) throw error;
      }

      navigate('/admin/providers');
    } catch (error) {
      console.error('Error saving provider:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({ ...prev, countries: selectedOptions }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Edit Provider' : 'New Provider'}
      </h2>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider Name
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
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            >
              <option value="">Select type</option>
              <option value="visa">Visa Services</option>
              <option value="housing">Housing</option>
              <option value="banking">Banking</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Countries
            </label>
            <select
              name="countries"
              multiple
              value={formData.countries}
              onChange={handleCountryChange}
              className="w-full p-3 border border-gray-200 rounded-lg min-h-[120px]"
              required
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple countries</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/providers')}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Provider'}
          </button>
        </div>
      </form>
    </div>
  );
}