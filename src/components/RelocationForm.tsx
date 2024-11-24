'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';
import ProfessionSelect from '@/components/ProfessionSelect';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress } from '@/hooks/useUserProgress';
import RelocationPlan from '@/components/RelocationPlan';
import { FormData, defaultFormData, familySizeOptions, budgetOptions, timelineOptions, professionOptions } from '@/types/form';

const steps = [
  {
    title: 'Destination',
    description: 'Choose your desired destination countries',
  },
  {
    title: 'Passport',
    description: 'Tell us about your citizenship',
  },
  {
    title: 'Personal',
    description: 'Share your personal situation',
  },
  {
    title: 'Budget',
    description: 'Plan your relocation budget',
  },
  {
    title: 'Profession',
    description: 'Tell us about your work',
  },
];

export default function RelocationForm() {
  const { user, signIn } = useAuth();
  const { currentStep: savedStep, formData: savedFormData, saveProgress } = useUserProgress();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [showPlan, setShowPlan] = useState(false);

  // Load saved progress when component mounts
  useEffect(() => {
    if (savedStep && savedStep > 0 && savedFormData) {
      setCurrentStep(savedStep);
      setFormData(savedFormData as FormData);
    } else {
      setCurrentStep(1); // Set to first step if no saved data
    }
  }, [savedStep, savedFormData]);

  const handleNext = async () => {
    if (!user) {
      await signIn();
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    await saveProgress(nextStep, formData);
  };

  const handleBack = async () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    
    if (user) {
      await saveProgress(prevStep, formData);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      await signIn();
      return;
    }

    await saveProgress(currentStep, formData);
    setShowPlan(true);
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (user) {
      saveProgress(currentStep, newFormData);
    }
  };

  // Ensure currentStep is within bounds
  const safeCurrentStep = Math.max(1, Math.min(currentStep, steps.length));
  const currentStepData = steps[safeCurrentStep - 1];

  if (showPlan) {
    return <RelocationPlan formData={formData} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {currentStepData?.title || "Relocation Form"}
          </h1>
          <p className="text-xl text-gray-400">
            {currentStepData?.description || "Let's plan your relocation journey"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            {/* Progress Line Background */}
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 -translate-y-1/2" />
            
            {/* Active Progress Line */}
            <div 
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 transition-all duration-500 ease-out"
              style={{ 
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                background: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
              }}
            />

            {steps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col items-center group z-10">
                {/* Step Circle */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold border-2 transition-all duration-300 
                    ${index + 1 === currentStep
                      ? "bg-blue-500 border-blue-400 text-white scale-110 shadow-lg shadow-blue-500/30"
                      : index + 1 < currentStep
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400"
                    }
                    ${index + 1 === currentStep ? "ring-4 ring-blue-400/30" : ""}
                    hover:scale-105 transform transition-transform duration-200
                  `}
                >
                  {index + 1}
                </div>

                {/* Step Title */}
                <span 
                  className={`mt-3 text-sm font-medium transition-all duration-200 absolute -bottom-8
                    ${index + 1 === currentStep
                      ? "text-blue-400 font-semibold scale-110"
                      : index + 1 < currentStep
                      ? "text-gray-300"
                      : "text-gray-500"
                    }
                  `}
                >
                  {step.title}
                </span>

                {/* Hover Effect */}
                <div className={`absolute -inset-4 bg-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10
                  ${index + 1 === currentStep ? "opacity-100" : ""}
                `} />
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Step 1: Destination */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <CountrySelect
                        label="Where do you want to relocate?"
                        placeholder="Select up to 3 countries"
                        maxSelections={3}
                        selected={formData.destinationCountries}
                        onChange={(countries) => updateFormData('destinationCountries', countries)}
                      />
                    </div>
                  )}

                  {/* Step 2: Passport */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <CountrySelect
                        label="Select your passport countries"
                        placeholder="Select your passports"
                        maxSelections={3}
                        selected={formData.passportCountries}
                        onChange={(countries) => updateFormData('passportCountries', countries)}
                      />
                    </div>
                  )}

                  {/* Step 3: Personal */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div>
                        <label className="block text-lg font-medium mb-4 text-white">
                          What is your marital status?
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {['Single', 'Married'].map((status) => (
                            <button
                              key={status}
                              onClick={() => updateFormData('status', status)}
                              className={`p-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                                formData.status === status
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-lg font-medium mb-4 text-white">
                          What is your family size?
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {familySizeOptions.map((size) => (
                            <button
                              key={size.value}
                              onClick={() => updateFormData('familySize', size.value)}
                              className={`p-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                                formData.familySize === size.value
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                              }`}
                            >
                              {size.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Budget & Timeline */}
                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <div>
                        <label className="block text-lg font-medium mb-4 text-white">
                          What is your relocation budget?
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {budgetOptions.map((budget) => (
                            <button
                              key={budget.value}
                              onClick={() => updateFormData('budget', budget.value)}
                              className={`p-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                                formData.budget === budget.value
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                              }`}
                            >
                              {budget.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-lg font-medium mb-4 text-white">
                          When do you want to relocate?
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {timelineOptions.map((timeline) => (
                            <button
                              key={timeline.value}
                              onClick={() => updateFormData('timeline', timeline.value)}
                              className={`p-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                                formData.timeline === timeline.value
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                              }`}
                            >
                              {timeline.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Profession */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <ProfessionSelect
                        label="Select your profession"
                        placeholder="Select your profession"
                        selected={formData.professions}
                        onChange={(professions) => updateFormData('professions', professions)}
                      />
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6">
                    {currentStep > 1 && (
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="px-8 py-3 bg-gray-700 text-white hover:bg-gray-600"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                    )}
                    <div className={currentStep === 1 ? 'ml-auto' : ''}>
                      <Button
                        onClick={currentStep === 5 ? handleSubmit : handleNext}
                        className="px-8 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-xl text-lg font-medium flex items-center"
                      >
                        {!user ? (
                          <>
                            <GoogleIcon />
                            <span className="ml-2">Sign in to Continue</span>
                          </>
                        ) : currentStep === 5 ? (
                          <>
                            Show My Plan
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        ) : (
                          <>
                            Continue
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}