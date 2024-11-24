import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus, X } from 'lucide-react';

interface Step {
  id: string;
  country_code: string;
  title: string;
  description: string;
  sort_order: number;
  provider_id: string | null;
}

interface Country {
  code: string;
  name: string;
}

export default function CountrySteps() {
  const supabase = createBrowserClient();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
    fetchProviders();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchSteps();
    }
  }, [selectedCountry]);

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

  async function fetchProviders() {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .order('name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSteps() {
    try {
      const { data, error } = await supabase
        .from('country_steps')
        .select('*')
        .eq('country_code', selectedCountry)
        .order('sort_order');

      if (error) throw error;
      setSteps(data || []);
    } catch (error) {
      console.error('Error fetching steps:', error);
    }
  }

  async function addStep() {
    const newStep: Partial<Step> = {
      country_code: selectedCountry,
      title: 'New Step',
      description: '',
      sort_order: steps.length,
      provider_id: null
    };

    try {
      const { data, error } = await supabase
        .from('country_steps')
        .insert([newStep])
        .select();

      if (error) throw error;
      if (data) setSteps([...steps, data[0]]);
    } catch (error) {
      console.error('Error adding step:', error);
    }
  }

  async function updateStep(stepId: string, updates: Partial<Step>) {
    try {
      const { error } = await supabase
        .from('country_steps')
        .update(updates)
        .eq('id', stepId);

      if (error) throw error;
      setSteps(steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      ));
    } catch (error) {
      console.error('Error updating step:', error);
    }
  }

  async function deleteStep(stepId: string) {
    try {
      const { error } = await supabase
        .from('country_steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;
      setSteps(steps.filter(step => step.id !== stepId));
    } catch (error) {
      console.error('Error deleting step:', error);
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedSteps = items.map((step, index) => ({
      ...step,
      sort_order: index
    }));

    setSteps(updatedSteps);

    try {
      const { error } = await supabase
        .from('country_steps')
        .upsert(updatedSteps.map(({ id, sort_order }) => ({ id, sort_order })));

      if (error) throw error;
    } catch (error) {
      console.error('Error updating step orders:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Country Steps</h2>

      <div className="max-w-4xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg"
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCountry && (
          <div className="space-y-4">
            <button
              onClick={addStep}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Step
            </button>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="steps">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {steps.map((step, index) => (
                      <Draggable
                        key={step.id}
                        draggableId={step.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-white rounded-lg shadow-sm p-4"
                          >
                            <div className="flex items-start gap-4">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-3 text-gray-400"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div className="flex-grow space-y-4">
                                <input
                                  type="text"
                                  value={step.title}
                                  onChange={(e) =>
                                    updateStep(step.id, { title: e.target.value })
                                  }
                                  className="w-full p-2 border border-gray-200 rounded"
                                  placeholder="Step title"
                                />
                                <textarea
                                  value={step.description}
                                  onChange={(e) =>
                                    updateStep(step.id, {
                                      description: e.target.value,
                                    })
                                  }
                                  className="w-full p-2 border border-gray-200 rounded"
                                  placeholder="Step description"
                                  rows={2}
                                />
                                <select
                                  value={step.provider_id || ''}
                                  onChange={(e) =>
                                    updateStep(step.id, {
                                      provider_id: e.target.value || null,
                                    })
                                  }
                                  className="w-full p-2 border border-gray-200 rounded"
                                >
                                  <option value="">Select provider</option>
                                  {providers.map((provider) => (
                                    <option key={provider.id} value={provider.id}>
                                      {provider.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <button
                                onClick={() => deleteStep(step.id)}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>
    </div>
  );
}