import React, { useState } from 'react';
import { Rocket, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RelocationForm from '../components/RelocationForm';
import { motion } from 'framer-motion';

function Home() {
  const [showForm, setShowForm] = useState(false);

  const cards = [
    {
      title: "Service Providers",
      description: "Connect with trusted relocation experts, visa specialists, and housing agents.",
      gradient: "from-indigo-500/20 to-indigo-600/20",
      hoverGradient: "from-indigo-500 to-indigo-600",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=300&h=300",
      imageAlt: "Professional relocation experts meeting with clients"
    },
    {
      title: "Relocated People",
      description: "Learn from those who've successfully made the move and get insider tips.",
      gradient: "from-teal-500/20 to-teal-600/20",
      hoverGradient: "from-teal-500 to-teal-600",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=300&h=300",
      imageAlt: "Happy family in their new home"
    },
    {
      title: "Communities",
      description: "Join vibrant local communities and build your network in your new home.",
      gradient: "from-amber-500/20 to-amber-600/20",
      hoverGradient: "from-amber-500 to-amber-600",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=300&h=300",
      imageAlt: "Diverse group of people in a community gathering"
    },
    {
      title: "Relocation Guide",
      description: "Step-by-step guidance through your entire relocation journey.",
      gradient: "from-rose-500/20 to-rose-600/20",
      hoverGradient: "from-rose-500 to-rose-600",
      image: "https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?auto=format&fit=crop&q=80&w=300&h=300",
      imageAlt: "Travel planning with maps and documents"
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
      <main className="pt-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Your Way to Relocate
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Streamline your relocation journey to make your move successful
          </p>
          {!showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                size="lg" 
                className="rounded-full px-12 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => setShowForm(true)}
              >
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="mt-6 flex items-center justify-center space-x-6 text-base">
                <div className="flex items-center text-gray-700 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No credit card needed</span>
                </div>
                <div className="flex items-center text-gray-700 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free consultation available</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <RelocationForm />
          </motion.div>
        ) : (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {cards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  className="relative"
                >
                  <Card className="group relative h-[320px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} transition-all duration-300 group-hover:opacity-0`} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.hoverGradient} opacity-0 transition-all duration-300 group-hover:opacity-100`} />
                    
                    <CardContent className="relative h-full p-6 flex flex-col justify-between">
                      <div>
                        <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden">
                          <img 
                            src={card.image} 
                            alt={card.imageAlt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                          {card.title}
                        </h3>
                        <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                          {card.description}
                        </p>
                      </div>
                      
                      <motion.div 
                        className="flex items-center text-gray-900 group-hover:text-white font-medium"
                        whileHover={{ x: 5 }}
                      >
                        Learn more
                        <svg 
                          className="w-5 h-5 ml-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;