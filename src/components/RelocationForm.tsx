import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CountrySelect from './CountrySelect';
import ProfessionSelect from './ProfessionSelect';
import RelocationPlan from './RelocationPlan';

interface FormData {
  destinationCountries: { code: string; name: string; }[];
  passportCountries: { code: string; name: string; }[];
  status: string;
  numberOfKids: string;
  kidsAges: number[];
  profession: { id: string; name: string; } | null;
  additionalInfo: string;
}

const defaultFormData: FormData = {
  destinationCountries: [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' }
  ],
  passportCountries: [
    { code: 'IL', name: 'Israel' }
  ],
  status: 'married',
  numberOfKids: '2',
  kidsAges: [3, 6],
  profession: { id: '1', name: 'Software Engineer' },
  additionalInfo: 'Looking to relocate in the next 6 months'
};

const getStepGradient = (step: number) => {
  const gradients = [
    'from-emerald-400/90 to-green-500/90',
    'from-blue-400/90 to-indigo-500/90',
    'from-purple-400/90 to-pink-500/90',
    'from-orange-400/90 to-red-500/90',
    'from-teal-400/90 to-cyan-500/90'
  ];
  return gradients[step - 1];
};

const RelocationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [showPlan, setShowPlan] = useState(false);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowPlan(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setFormData(defaultFormData);
    setShowPlan(false);
  };

  if (showPlan) {
    return <RelocationPlan />;
  }

  const renderStep = () => {
    const gradient = getStepGradient(currentStep);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg lg:col-start-2">
          <CardContent className={`p-6 bg-gradient-to-br ${gradient} text-white`}>
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Destination Countries</h2>
                <CountrySelect
                  label="Where do you want to relocate?"
                  placeholder="Select destination countries"
                  maxSelections={3}
                  selected={formData.destinationCountries}
                  onChange={(countries) => setFormData(prev => ({ ...prev, destinationCountries: countries }))}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Your Passports</h2>
                <CountrySelect
                  label="Select your passport countries"
                  placeholder="Select passport countries"
                  maxSelections={3}
                  selected={formData.passportCountries}
                  onChange={(countries) => setFormData(prev => ({ ...prev, passportCountries: countries }))}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Your Status</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Marital Status
                    </label>
                    <select
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="">Select status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Number of Kids
                    </label>
                    <select
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white"
                      value={formData.numberOfKids}
                      onChange={(e) => {
                        const value = e.target.value;
                        const defaultAges = value === '1' ? [3] : value === '2' ? [3, 6] : value === '3+' ? [3, 6, 9] : [];
                        setFormData(prev => ({
                          ...prev,
                          numberOfKids: value,
                          kidsAges: defaultAges
                        }));
                      }}
                    >
                      <option value="0">No kids</option>
                      <option value="1">1 kid</option>
                      <option value="2">2 kids</option>
                      <option value="3+">3 kids or more</option>
                    </select>
                  </div>

                  {formData.numberOfKids !== '0' && (
                    <div className="space-y-4">
                      {Array.from({ length: formData.kidsAges.length }).map((_, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-white mb-2">
                            Age of Kid {index + 1}
                          </label>
                          <select
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white"
                            value={formData.kidsAges[index]}
                            onChange={(e) => {
                              const newAges = [...formData.kidsAges];
                              newAges[index] = parseInt(e.target.value);
                              setFormData(prev => ({ ...prev, kidsAges: newAges }));
                            }}
                          >
                            {Array.from({ length: 19 }, (_, i) => (
                              <option key={i} value={i}>
                                {i} {i === 1 ? 'year' : 'years'} old
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Your Profession</h2>
                <ProfessionSelect
                  label="What is your profession?"
                  placeholder="Select or type your profession"
                  selected={formData.profession}
                  onChange={(profession) => setFormData(prev => ({ ...prev, profession }))}
                />
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Summary</h2>
                <div className="bg-white/10 p-4 rounded-xl mb-6">
                  <p className="text-white">
                    I want to relocate to {formData.destinationCountries.map(c => c.name).join(', ')}.
                    I have passports from {formData.passportCountries.map(c => c.name).join(', ')}.
                    I am {formData.status}{formData.numberOfKids !== '0' ? ` with ${formData.numberOfKids === '3+' ? formData.kidsAges.length : formData.numberOfKids} ${formData.kidsAges.length === 1 ? 'kid' : 'kids'}${formData.kidsAges.length > 0 ? ` (ages: ${formData.kidsAges.join(', ')})` : ''}` : ''}{formData.profession ? ` and my profession is ${formData.profession.name}` : ''}.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Anything you want to add before we create your plan?
                  </label>
                  <textarea
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl min-h-[100px] text-white placeholder-white/50"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    placeholder="Add any additional information..."
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="sticky top-24">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Your Relocation Journey</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${currentStep === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <h3 className="font-medium">1. Choose Your Destination</h3>
              </div>
              <div className={`p-4 rounded-lg border ${currentStep === 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <h3 className="font-medium">2. Your Passports</h3>
              </div>
              <div className={`p-4 rounded-lg border ${currentStep === 3 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <h3 className="font-medium">3. Family Status</h3>
              </div>
              <div className={`p-4 rounded-lg border ${currentStep === 4 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <h3 className="font-medium">4. Professional Background</h3>
              </div>
              <div className={`p-4 rounded-lg border ${currentStep === 5 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <h3 className="font-medium">5. Review & Submit</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4">
      {renderStep()}
      <div className="mt-6 flex justify-between">
        <div className="space-x-4">
          {currentStep > 1 && (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
            >
              Back
            </Button>
          )}
          {currentStep > 1 && (
            <Button
              variant="ghost"
              onClick={handleStartOver}
              className="text-gray-600 hover:text-gray-800"
            >
              Start Over
            </Button>
          )}
        </div>
        <Button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          disabled={
            (currentStep === 1 && formData.destinationCountries.length === 0) ||
            (currentStep === 2 && formData.passportCountries.length === 0) ||
            (currentStep === 3 && !formData.status) ||
            (currentStep === 4 && !formData.profession)
          }
        >
          {currentStep === 5 ? 'Create my plan' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default RelocationForm;