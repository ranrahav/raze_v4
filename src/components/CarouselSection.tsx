import React, { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselSectionProps {
  title: string
  items: any[]
  renderItem: (item: any, isHovered: boolean) => React.ReactNode
  className?: string
}

export function CarouselSection({ title, items, renderItem, className }: CarouselSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className={cn("py-8", className)}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
      <div className="relative px-16">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {items.map((item, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {renderItem(item, hoveredIndex === index)}
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            className="hidden md:flex h-12 w-12 rounded-full border-2 border-gray-200 bg-white opacity-70 hover:opacity-100 transition-opacity duration-200 shadow-lg absolute -left-6 top-1/2 -translate-y-1/2"
          >
            <ChevronLeft className="h-8 w-8 text-gray-600" />
          </CarouselPrevious>
          <CarouselNext 
            className="hidden md:flex h-12 w-12 rounded-full border-2 border-gray-200 bg-white opacity-70 hover:opacity-100 transition-opacity duration-200 shadow-lg absolute -right-6 top-1/2 -translate-y-1/2"
          >
            <ChevronRight className="h-8 w-8 text-gray-600" />
          </CarouselNext>
        </Carousel>
      </div>
    </section>
  )
}
