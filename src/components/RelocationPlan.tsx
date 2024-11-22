import React from 'react';
import { Globe, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Sample data for the carousels
const serviceProviders = [
  {
    name: "Kate Anderson",
    type: "Visa Specialist",
    website: "kateanderson.com",
    phone: "+44123456789",
    email: "kate@visas.co.uk",
    image_url: "https://i.pravatar.cc/150?img=1",
    gradient: "from-emerald-400 to-green-500",
  },
  {
    name: "John Smith",
    type: "Housing Expert",
    website: "johnsmith.com",
    phone: "+44987654321",
    email: "john@housing.co.uk",
    image_url: "https://i.pravatar.cc/150?img=2",
    gradient: "from-purple-400 to-purple-600",
  },
  {
    name: "Sarah Wilson",
    type: "Job Consultant",
    website: "sarahwilson.com",
    phone: "+44555666777",
    email: "sarah@jobs.co.uk",
    image_url: "https://i.pravatar.cc/150?img=3",
    gradient: "from-blue-400 to-violet-500",
  },
  {
    name: "Mike Brown",
    type: "Legal Advisor",
    website: "mikebrown.com",
    phone: "+44111222333",
    email: "mike@legal.co.uk",
    image_url: "https://i.pravatar.cc/150?img=4",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    name: "Lisa Chen",
    type: "Education Consultant",
    website: "lisachen.com",
    phone: "+44777888999",
    email: "lisa@education.co.uk",
    image_url: "https://i.pravatar.cc/150?img=5",
    gradient: "from-indigo-400 to-purple-500",
  }
];

const mentors = [
  {
    name: "Emma Wilson",
    phone: "+44-7700-900123",
    email: "emma.wilson@example.com",
    relocatedDate: "8/22/2023",
    image_url: "https://i.pravatar.cc/150?img=6",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    name: "David Lee",
    phone: "+44-7700-900456",
    email: "david.lee@example.com",
    relocatedDate: "7/15/2023",
    image_url: "https://i.pravatar.cc/150?img=7",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    name: "Sophie Brown",
    phone: "+44-7700-900789",
    email: "sophie.brown@example.com",
    relocatedDate: "9/1/2023",
    image_url: "https://i.pravatar.cc/150?img=8",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    name: "Alex Johnson",
    phone: "+44-7700-900321",
    email: "alex.johnson@example.com",
    relocatedDate: "6/30/2023",
    image_url: "https://i.pravatar.cc/150?img=9",
    gradient: "from-teal-400 to-emerald-500",
  },
  {
    name: "Maria Garcia",
    phone: "+44-7700-900654",
    email: "maria.garcia@example.com",
    relocatedDate: "5/15/2023",
    image_url: "https://i.pravatar.cc/150?img=10",
    gradient: "from-rose-400 to-red-500",
  }
];

const communities = [
  {
    name: "Life in London",
    memberCount: 15000,
    url: "https://reddit.com/r/london",
    platform: "Reddit",
    gradient: "from-orange-400 to-pink-500",
  },
  {
    name: "UK Visa Forum",
    memberCount: 5000,
    url: "https://discord.gg/ukvisa",
    platform: "Discord",
    gradient: "from-purple-400 to-indigo-500",
  },
  {
    name: "British Culture",
    memberCount: 8000,
    url: "https://reddit.com/r/british",
    platform: "Reddit",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    name: "UK Job Network",
    memberCount: 12000,
    url: "https://discord.gg/ukjobs",
    platform: "Discord",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    name: "London Tech Hub",
    memberCount: 20000,
    url: "https://discord.gg/londontech",
    platform: "Discord",
    gradient: "from-cyan-400 to-blue-500",
  }
];

const RelocationPlan: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Your Way to Relocate
          </h1>
          <p className="text-lg text-gray-600">
            Streamline your relocation journey to make your move successful
          </p>
        </div>

        <div className="space-y-12">
          {/* Service Providers Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Service Providers</h2>
            <Carousel
              opts={{
                align: "start",
                loop: true
              }}
              className="w-full"
            >
              <CarouselContent>
                {serviceProviders.map((provider, index) => (
                  <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/5">
                    <Card className="border-0 shadow-lg h-[280px] overflow-hidden">
                      <CardContent className={`p-6 bg-gradient-to-br ${provider.gradient} text-white h-full`}>
                        <div className="flex items-center mb-6">
                          <img 
                            src={provider.image_url} 
                            alt={provider.name} 
                            className="w-16 h-16 rounded-full mr-4"
                          />
                          <div>
                            <h3 className="font-semibold text-xl">{provider.name}</h3>
                            <p className="text-lg opacity-90">{provider.type}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <a href={`https://${provider.website}`} className="flex items-center text-white hover:underline">
                            <Globe className="w-5 h-5 mr-2" />
                            {provider.website}
                          </a>
                          <a href={`tel:${provider.phone}`} className="flex items-center text-white hover:underline">
                            <Phone className="w-5 h-5 mr-2" />
                            {provider.phone}
                          </a>
                          <a href={`mailto:${provider.email}`} className="flex items-center text-white hover:underline">
                            <Mail className="w-5 h-5 mr-2" />
                            {provider.email}
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 sm:-left-12" />
              <CarouselNext className="absolute -right-4 sm:-right-12" />
            </Carousel>
          </section>

          {/* Mentors Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">People Who Relocated Here</h2>
            <Carousel
              opts={{
                align: "start",
                loop: true
              }}
              className="w-full"
            >
              <CarouselContent>
                {mentors.map((mentor, index) => (
                  <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/5">
                    <Card className="border-0 shadow-lg h-[280px] overflow-hidden">
                      <CardContent className={`p-6 bg-gradient-to-br ${mentor.gradient} text-white h-full`}>
                        <div className="flex items-center mb-6">
                          <img 
                            src={mentor.image_url} 
                            alt={mentor.name} 
                            className="w-16 h-16 rounded-full mr-4"
                          />
                          <div>
                            <h3 className="font-semibold text-xl">{mentor.name}</h3>
                            <p className="text-lg opacity-90">Relocated: {mentor.relocatedDate}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <a href={`tel:${mentor.phone}`} className="flex items-center text-white hover:underline">
                            <Phone className="w-5 h-5 mr-2" />
                            {mentor.phone}
                          </a>
                          <a href={`mailto:${mentor.email}`} className="flex items-center text-white hover:underline">
                            <Mail className="w-5 h-5 mr-2" />
                            {mentor.email}
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 sm:-left-12" />
              <CarouselNext className="absolute -right-4 sm:-right-12" />
            </Carousel>
          </section>

          {/* Communities Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Communities</h2>
            <Carousel
              opts={{
                align: "start",
                loop: true
              }}
              className="w-full"
            >
              <CarouselContent>
                {communities.map((community, index) => (
                  <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/5">
                    <Card className="border-0 shadow-lg h-[280px] overflow-hidden">
                      <CardContent className={`p-6 bg-gradient-to-br ${community.gradient} text-white h-full flex flex-col`}>
                        <div className="flex-1">
                          <h3 className="font-semibold text-2xl mb-2">{community.name}</h3>
                          <p className="text-lg opacity-90">
                            {community.memberCount.toLocaleString()} members
                          </p>
                        </div>
                        <Button 
                          className="w-full bg-white/20 hover:bg-white/30 text-white border-0 mt-4 text-lg py-6"
                          asChild
                        >
                          <a href={community.url} target="_blank" rel="noopener noreferrer">
                            Join on {community.platform}
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 sm:-left-12" />
              <CarouselNext className="absolute -right-4 sm:-right-12" />
            </Carousel>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RelocationPlan;