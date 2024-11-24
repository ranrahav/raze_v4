import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createBrowserClient } from '@/lib/supabase-browser';

interface MentorFormData {
  name: string;
  phone: string;
  email: string;
  country_code: string;
  relocated_at: string;
}

export default function MentorForm() {
  const supabase = createBrowserClient();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ code: string; name: string; }[]>([]);
  const [formData, setFormData] = useState<MentorFormData>({
    name: '',
    phone: '',
    email: '',
    country_code: '',
    relocated_at: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchCountries();
    if (id) {
      fetchMentor();
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

  async function fetchMentor() {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          ...data,
          relocated_at: new Date(data.relocated_at).toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error fetching mentor:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        relocated_at: new Date(formData.relocated_at).toISOString()
      };

      if (id) {
        const { error } = await supabase
          .from('mentors')
          .update(submissionData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mentors')
          .insert([submissionData]);
        if (error) throw error;
      }

      navigate('/admin/mentors');
    } catch (error) {
      console.error('Error saving mentor:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Edit Person' : 'New Person'}
      </h2>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
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
              Relocation Date
            </label>
            <input
              type="date"
              name="relocated_at"
              value={formData.relocated_at}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/mentors')}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Person'}
          </button>
        </div>
      </form>
    </div>
  );
}