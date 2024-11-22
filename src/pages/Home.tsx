import React, { useState } from 'react';
import { Rocket, ChevronRight, Globe, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RelocationForm from '../components/RelocationForm';

function Home() {
  const [showForm, setShowForm] = useState(false);

  const previewCards = [
    {
      title: "Service Providers",
      gradient: "from-emerald-400 to-green-500",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?img=1" alt="" className="w-12 h-12 rounded-full" />
            <div>
              <h4 className="font-medium">Kate Anderson</h4>
              <p className="text-sm opacity-80">Visa Specialist</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <a href="#" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              kateanderson.com
            </a>
            <a href="#" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +44123456789
            </a>
          </div>
        </div>
      )
    },
    {
      title: "People Who Relocated",
      gradient: "from-blue-400 to-indigo-500",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?img=5" alt="" className="w-12 h-12 rounded-full" />
            <div>
              <h4 className="font-medium">Emma Wilson</h4>
              <p className="text-sm opacity-80">Relocated: Aug 2023</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <a href="#" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              emma.wilson@example.com
            </a>
          </div>
        </div>
      )
    },
    {
      title: "Communities",
      gradient: "from-purple-400 to-pink-500",
      content: (
        <div className="space-y-3">
          <h4 className="font-medium">Life in London</h4>
          <p className="text-sm opacity-80">15,000 members</p>
          <Button 
            className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
          >
            Join on Reddit
          </Button>
        </div>
      )
    },
    {
      title: "Country Steps",
      gradient: "from-orange-400 to-red-500",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">1</div>
            <p className="text-sm">Visa Application</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">2</div>
            <p className="text-sm">Housing Search</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">3</div>
            <p className="text-sm">Bank Account</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Raze
            </span>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <Button variant="ghost" className="text-sm sm:text-base text-gray-600">
              About
            </Button>
            <Button className="text-sm sm:text-base bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full hover:bg-blue-700 whitespace-nowrap">
              Become Service Provider
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Your Way to Relocate
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Streamline your relocation journey to make your move successful
          </p>
          <Button 
            size="lg" 
            className="rounded-full px-8"
            onClick={() => setShowForm(true)}
          >
            Get Started <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="mt-3 text-sm text-gray-500 space-x-2">
            <span>No credit card needed</span>
            <span>•</span>
            <span>Free consultation available</span>
          </div>
        </div>

        {showForm ? (
          <div className="max-w-3xl mx-auto">
            <RelocationForm />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {previewCards.map((card, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className={`p-6 bg-gradient-to-br ${card.gradient} text-white h-full`}>
                  <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
                  {card.content}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;