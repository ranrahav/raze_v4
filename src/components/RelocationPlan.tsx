import React from 'react'
import { Globe, Mail, Phone } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CarouselSection } from './CarouselSection'
import { serviceProviders, relocatedPeople, communities } from '@/data/relocation-data'

export default function RelocationPlan() {
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
      </div>
    </div>
  )
}