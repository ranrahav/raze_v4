import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CountrySelect from './CountrySelect';
import ProfessionSelect from './ProfessionSelect';
import RelocationPlan from './RelocationPlan';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

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
  destinationCountries: [],
  passportCountries: [],
  status: '',
  numberOfKids: '0',
  kidsAges: [],
  profession: null,
  additionalInfo: ''
};

const steps = [
  {
    title: "Destination",
    description: "Where would you like to relocate?",
    gradient: "from-blue-500/90 to-indigo-600/90"
  },
  {
    title: "Passport",
    description: "What passports do you hold?",
    gradient: "from-emerald-500/90 to-green-600/90"
  },
  {
    title: "Family",
    description: "Tell us about your family status",
    gradient: "from-purple-500/90 to-pink-600/90"
  },
  {
    title: "Profession",
    description: "What's your profession?",
    gradient: "from-amber-500/90 to-orange-600/90"
  },
  {
    title: "Review",
    description: "Review your information",
    gradient: "from-rose-500/90 to-red-600/90"
  }
];

const RelocationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [showPlan, setShowPlan] = useState(false);

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 3) {
      if (!formData.status || formData.status === "") {
        alert("Please select your marital status");
        return;
      }
      if (!formData.numberOfKids || formData.numberOfKids === "") {
        alert("Please select number of children");
        return;
      }
    }
    
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

  if (showPlan) {
    return <RelocationPlan />;
  }

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2
                    ${index + 1 < currentStep ? 'bg-green-500 text-white' : 
                      index + 1 === currentStep ? 'bg-blue-600 text-white' : 
                      'bg-gray-200 text-gray-500'}`}
                >
                  {index + 1 < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <div className="text-sm font-medium text-gray-600">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-1 mx-4 rounded ${
                    index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Description */}
          <div className="lg:py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentStepData.title}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {currentStepData.description}
            </p>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Why we need this</h3>
              <p className="text-gray-600">
                This information helps us personalize your relocation journey and provide the most relevant resources and connections.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <Card className="border-0 shadow-xl overflow-visible">
            <CardContent className={`p-8 bg-gradient-to-br ${currentStepData.gradient} overflow-visible`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-h-[400px] relative overflow-visible">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white mb-6">Choose Destinations</h3>
                    <CountrySelect
                      label="Where do you want to relocate?"
                      placeholder="Select up to 3 countries"
                      maxSelections={3}
                      selected={formData.destinationCountries}
                      onChange={(countries) => setFormData(prev => ({ ...prev, destinationCountries: countries }))}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white mb-6">Your Passports</h3>
                    <CountrySelect
                      label="Select your passport countries"
                      placeholder="Select your passports"
                      maxSelections={3}
                      selected={formData.passportCountries}
                      onChange={(countries) => setFormData(prev => ({ ...prev, passportCountries: countries }))}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6 overflow-visible">
                    <h3 className="text-2xl font-semibold text-white mb-6">Family Status</h3>
                    <div className="space-y-4 overflow-visible">
                      <div className="relative h-24">
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Marital Status<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none hover:bg-white/20 transition-colors duration-200"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            required
                            style={{
                              height: '48px'
                            }}
                          >
                            <option value="" disabled className="bg-gray-800">Select status</option>
                            <option value="single" className="bg-gray-800 p-4">Single</option>
                            <option value="married" className="bg-gray-800 p-4">Married</option>
                            <option value="divorced" className="bg-gray-800 p-4">Divorced</option>
                            <option value="widowed" className="bg-gray-800 p-4">Widowed</option>
                          </select>
                        </div>
                      </div>

                      <div className="relative h-24">
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Children<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none hover:bg-white/20 transition-colors duration-200"
                            value={formData.numberOfKids}
                            onChange={(e) => {
                              const value = e.target.value;
                              const defaultAges = value === '1' ? [0] : value === '2' ? [0, 0] : value === '3+' ? [0, 0, 0] : [];
                              setFormData(prev => ({
                                ...prev,
                                numberOfKids: value,
                                kidsAges: defaultAges
                              }));
                            }}
                            required
                            style={{
                              height: '48px'
                            }}
                          >
                            <option value="" disabled className="bg-gray-800">Select number of children</option>
                            <option value="0" className="bg-gray-800 p-4">No children</option>
                            <option value="1" className="bg-gray-800 p-4">1 child</option>
                            <option value="2" className="bg-gray-800 p-4">2 children</option>
                            <option value="3+" className="bg-gray-800 p-4">3 or more children</option>
                          </select>
                        </div>
                      </div>

                      {formData.numberOfKids !== '0' && (
                        <div className="space-y-4">
                          {formData.kidsAges.map((age, index) => (
                            <div key={index}>
                              <label className="block text-sm font-medium text-white/90 mb-2">
                                Age of Child {index + 1}
                              </label>
                              <select
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white"
                                value={age}
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
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white mb-6">Professional Details</h3>
                    <ProfessionSelect
                      label="What is your profession?"
                      placeholder="Select or type your profession"
                      selected={formData.profession}
                      onChange={(profession) => setFormData(prev => ({ ...prev, profession }))}
                    />
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white mb-6">Review Your Information</h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 p-4 rounded-xl">
                        <h4 className="font-medium text-white/90 mb-2">Destination Countries</h4>
                        <p className="text-white">
                          {formData.destinationCountries.length > 0 
                            ? formData.destinationCountries.map(c => c.name).join(', ')
                            : 'Not specified'}
                        </p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-xl">
                        <h4 className="font-medium text-white/90 mb-2">Passport Countries</h4>
                        <p className="text-white">
                          {formData.passportCountries.length > 0
                            ? formData.passportCountries.map(c => c.name).join(', ')
                            : 'Not specified'}
                        </p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-xl">
                        <h4 className="font-medium text-white/90 mb-2">Family Status</h4>
                        <p className="text-white">
                          {formData.status ? `${formData.status.charAt(0).toUpperCase()}${formData.status.slice(1)}` : 'Not specified'}
                          {formData.numberOfKids !== '0' && `, ${formData.numberOfKids === '3+' ? '3+' : formData.numberOfKids} ${formData.numberOfKids === '1' ? 'child' : 'children'}`}
                          {formData.kidsAges.length > 0 && ` (ages: ${formData.kidsAges.join(', ')})`}
                        </p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-xl">
                        <h4 className="font-medium text-white/90 mb-2">Profession</h4>
                        <p className="text-white">
                          {formData.profession ? formData.profession.name : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <Button
                    onClick={handleBack}
                    className="flex items-center text-black hover:text-black/80"
                    variant="ghost"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="px-6 py-2 bg-white text-gray-900 hover:bg-white/90"
                >
                  {currentStep === 5 ? 'Show My Plan' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RelocationForm;