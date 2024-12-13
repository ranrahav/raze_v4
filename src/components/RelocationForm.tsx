'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, PlusCircle, MinusCircle } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';
import ProfessionSelect from '@/components/ProfessionSelect';
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress } from '@/hooks/useUserProgress';
import RelocationPlan from '@/components/RelocationPlan';
import { FormData, defaultFormData, familySizeOptions, kidsAgeGroups } from '@/types/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

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
    title: 'Profession',
    description: 'Tell us about your work',
  },
  {
    title: 'Summary',
    description: 'Anything else we need to know about your relocation?',
  },
];

export default function RelocationForm() {
  const { user, signIn } = useAuth();
  const { currentStep: savedStep, formData: savedFormData, saveProgress } = useUserProgress();
  const [currentStep, setCurrentStep] = useState(savedStep || 0);
  const [formData, setFormData] = useState<FormData>({
    destinationCountries: savedFormData?.destinationCountries || defaultFormData.destinationCountries,
    passportCountries: savedFormData?.passportCountries || defaultFormData.passportCountries,
    familySize: savedFormData?.familySize || defaultFormData.familySize,
    numberOfKids: savedFormData?.numberOfKids || defaultFormData.numberOfKids,
    kids: savedFormData?.kids || defaultFormData.kids,
    professions: savedFormData?.professions || defaultFormData.professions,
    partnerProfessions: savedFormData?.partnerProfessions || defaultFormData.partnerProfessions,
    additionalInfo: savedFormData?.additionalInfo || defaultFormData.additionalInfo,
  });
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

  // Update form state when saved progress changes
  useEffect(() => {
    if (savedStep !== undefined && savedFormData) {
      setCurrentStep(savedStep);
      setFormData(savedFormData);
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

  const updateFormData = (updates: Partial<FormData>) => {
    const newFormData = { ...formData, ...updates };
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
                    <Card>
                      <CardContent className="pt-6">
                        <CountrySelect
                          label="Which countries would you like to relocate to?"
                          placeholder="Select countries"
                          selected={formData.destinationCountries}
                          onChange={(countries) => updateFormData({ destinationCountries: countries })}
                          className="bg-gray-100 text-gray-900 border-gray-200"
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 2: Passport */}
                  {currentStep === 2 && (
                    <Card>
                      <CardContent className="pt-6">
                        <CountrySelect
                          label="What passports do you hold?"
                          placeholder="Select countries"
                          selected={formData.passportCountries}
                          onChange={(countries) => updateFormData({ passportCountries: countries })}
                          className="bg-gray-100 text-gray-900 border-gray-200"
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 3: Personal */}
                  {currentStep === 3 && (
                    <Card>
                      <CardContent className="pt-6 space-y-6">
                        <div>
                          <Label className="text-lg mb-4 block">What's your family size?</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {familySizeOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => updateFormData({
                                  familySize: option.value,
                                  ...(option.value !== '3+' && {
                                    numberOfKids: 0,
                                    kids: []
                                  })
                                })}
                                className={`p-4 rounded-xl text-left transition-all duration-200 ${
                                  formData.familySize === option.value
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                }`}
                              >
                                <div className="font-medium">{option.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {formData.familySize === '3+' && (
                          <div className="space-y-4">
                            <Label className="text-lg block">How many kids do you have?</Label>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => {
                                  const newCount = Math.max(0, formData.numberOfKids - 1);
                                  updateFormData({
                                    numberOfKids: newCount,
                                    kids: formData.kids.slice(0, newCount)
                                  });
                                }}
                                className="p-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200"
                              >
                                <MinusCircle className="w-5 h-5" />
                              </button>
                              <span className="text-xl font-medium text-gray-900">{formData.numberOfKids}</span>
                              <button
                                onClick={() => {
                                  const newCount = formData.numberOfKids + 1;
                                  updateFormData({
                                    numberOfKids: newCount,
                                    kids: [
                                      ...formData.kids,
                                      { age: '0' }
                                    ]
                                  });
                                }}
                                className="p-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200"
                              >
                                <PlusCircle className="w-5 h-5" />
                              </button>
                            </div>

                            {formData.numberOfKids > 0 && (
                              <div className="space-y-4">
                                <Label className="text-lg block">What are their ages?</Label>
                                <div className="grid gap-4">
                                  {Array.from({ length: formData.numberOfKids }).map((_, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <span className="text-gray-500">Kid {index + 1}:</span>
                                      <Select
                                        value={formData.kids[index]?.age || '0'}
                                        onValueChange={(value) => {
                                          const newKids = [...formData.kids];
                                          newKids[index] = { age: value };
                                          updateFormData({ kids: newKids });
                                        }}
                                      >
                                        <SelectTrigger className="flex-1 bg-gray-100 text-gray-900 border-gray-200">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {kidsAgeGroups.map((age) => (
                                            <SelectItem key={age.value} value={age.value}>
                                              {age.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 4: Profession */}
                  {currentStep === 4 && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-6">
                          <ProfessionSelect
                            label="What is your profession?"
                            placeholder="Select or type your profession"
                            selected={formData.professions || []}
                            onChange={(professions) =>
                              updateFormData({ professions })
                            }
                          />

                          {formData.familySize !== 'just-me' && (
                            <ProfessionSelect
                              label="What is your partner's profession?"
                              placeholder="Select or type your partner's profession"
                              selected={formData.partnerProfessions || []}
                              onChange={(professions) =>
                                updateFormData({ partnerProfessions: professions })
                              }
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 5: Summary */}
                  {currentStep === 5 && (
                    <Card>
                      <CardContent className="pt-6">
                        <Label className="text-lg block mb-4">Anything else we need to know about your relocation?</Label>
                        <textarea
                          value={formData.additionalInfo}
                          onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
                          placeholder="Tell us about any specific requirements, concerns, or preferences..."
                          className="w-full h-40 p-4 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                      </CardContent>
                    </Card>
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