import React from 'react';
import { FormData } from '@/types/form';
import { Globe, Mail, Phone } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CarouselSection } from './CarouselSection'
import { serviceProviders, relocatedPeople, communities } from '@/data/relocation-data'

interface RelocationPlanProps {
  formData: FormData;
}

export default function RelocationPlan({ formData }: RelocationPlanProps) {
  return (
    <div className="min-h-screen bg-gray-80">
      <div className="container mx-auto">
        <CarouselSection
          title="Service Providers"
          items={serviceProviders}
          renderItem={(provider: any, isHovered: boolean) => (
            <Card className={`overflow-hidden border-0 shadow-lg h-[320px] group transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
              <CardContent className={`p-6 h-full bg-gradient-to-br ${provider.gradient} text-white opacity-90`}>
                <div className="flex flex-col items-center mb-4">
                  <img src={provider.image} alt={provider.name} className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-white shadow-lg" />
                  <h3 className="font-semibold text-2xl text-center">{provider.name}</h3>
                  <p className="text-lg opacity-90 text-center">{provider.type}</p>
                </div>
                <div className="space-y-2 mt-4">
                  <a href={`https://${provider.website}`} 
                     className="flex items-center justify-center text-lg text-white hover:underline transition-all duration-300 hover:translate-x-1">
                    <Globe className="w-5 h-5 mr-2" />
                    {provider.website}
                  </a>
                  <a href={`tel:${provider.phone}`} 
                     className="flex items-center justify-center text-lg text-white hover:underline transition-all duration-300 hover:translate-x-1">
                    <Phone className="w-5 h-5 mr-2" />
                    {provider.phone}
                  </a>
                  <a href={`mailto:${provider.email}`} 
                     className="flex items-center justify-center text-lg text-white hover:underline transition-all duration-300 hover:translate-x-1">
                    <Mail className="w-5 h-5 mr-2" />
                    {provider.email}
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        />

        <CarouselSection
          title="People Who Relocated Here"
          items={relocatedPeople}
          renderItem={(person: any, isHovered: boolean) => (
            <Card className={`overflow-hidden border-0 shadow-lg h-[320px] group transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
              <CardContent className={`p-6 h-full bg-gradient-to-br ${person.gradient} text-white opacity-90`}>
                <div className="flex flex-col items-center mb-4">
                  <img src={person.image} alt={person.name} className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-white shadow-lg" />
                  <h3 className="font-semibold text-2xl text-center">{person.name}</h3>
                  <p className="text-lg opacity-90 text-center">Relocated: {person.relocatedDate}</p>
                </div>
                <div className="space-y-2 mt-4">
                  <a href={`tel:${person.phone}`} 
                     className="flex items-center justify-center text-lg text-white hover:underline transition-all duration-300 hover:translate-x-1">
                    <Phone className="w-5 h-5 mr-2" />
                    {person.phone}
                  </a>
                  <a href={`mailto:${person.email}`} 
                     className="flex items-center justify-center text-lg text-white hover:underline transition-all duration-300 hover:translate-x-1">
                    <Mail className="w-5 h-5 mr-2" />
                    {person.email}
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        />

        <CarouselSection
          title="Communities"
          items={communities}
          renderItem={(community: any, isHovered: boolean) => (
            <Card className={`overflow-hidden border-0 shadow-lg h-[320px] group transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
              <CardContent className={`p-6 h-full bg-gradient-to-br ${community.gradient} text-white opacity-90`}>
                <div className="flex flex-col items-center mb-4">
                  <img src={community.image} alt={community.name} className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-white shadow-lg" />
                  <h3 className="font-semibold text-2xl text-center">{community.name}</h3>
                  <p className="text-lg opacity-90 text-center">
                    {community.memberCount.toLocaleString()} members
                  </p>
                </div>
                <Button 
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-0 mt-6 text-lg py-4 transition-all duration-300 hover:translate-y-1" 
                  variant="outline"
                >
                  Join on {community.platform}
                </Button>
              </CardContent>
            </Card>
          )}
        />

        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">Your Relocation Plan</h1>
          
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-lg">
            <div className="grid gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Destination Countries</h2>
                <div className="flex gap-4">
                  {formData.destinationCountries.map((country) => (
                    <div key={country.code} className="bg-white/20 px-4 py-2 rounded-lg">
                      {country.name}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
                <div className="grid gap-4">
                  <div>
                    <span className="font-medium">Status:</span> {formData.status}
                  </div>
                  <div>
                    <span className="font-medium">Family Size:</span> {formData.familySize}
                  </div>
                  <div>
                    <span className="font-medium">Budget:</span> {formData.budget}
                  </div>
                  <div>
                    <span className="font-medium">Timeline:</span> {formData.timeline}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Professions</h2>
                <div className="flex gap-4">
                  {formData.professions.map((profession) => (
                    <div key={profession.id} className="bg-white/20 px-4 py-2 rounded-lg">
                      {profession.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}