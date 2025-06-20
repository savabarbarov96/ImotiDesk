
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useAnimationSettings } from '@/lib/animations/motion';

// Sample property images for demonstration
const propertyImages = [
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200",
  "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1200",
  "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?auto=format&fit=crop&w=1200",
  "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=1200",
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const { shouldAnimate = true } = useAnimationSettings() ?? {};
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(true);
  
  // Update current slide when API changes
  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap());
  }, [api]);

  // Subscribe to carousel changes
  useEffect(() => {
    if (!api) return;
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  // Simple intersection observer to check if carousel is in viewport
  useEffect(() => {
    if (!carouselRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    observer.observe(carouselRef.current);
    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, [carouselRef]);

  // Auto-advance the carousel only when in viewport
  useEffect(() => {
    if (!api || !isIntersecting) return;
    
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % propertyImages.length;
      api.scrollTo(nextSlide);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [api, currentSlide, isIntersecting]);
  
  // Helper function to handle indicator click
  const handleIndicatorClick = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div 
      className="absolute top-0 left-0 w-full h-full overflow-hidden"
      ref={carouselRef}
    >
      {/* Dark overlay with parallax effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-[1]"
      />
      
      <Carousel 
        className="w-full h-full"
        setApi={setApi}>
        <CarouselContent className="h-full">
          {propertyImages.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <AspectRatio ratio={16/9} className="h-full">
                <div
                  className="w-full h-full"
                >
                  <img 
                    src={image} 
                    alt={`Property showcase ${index + 1}`}
                    className={`object-cover w-full h-full transition-all duration-1000 ${
                      currentSlide === index 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-110"
                    }`}
                  />
                </div>
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Carousel indicators with animations */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 animate-fade-in"
      >
        {propertyImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all bg-white ${
              currentSlide === index 
                ? "opacity-100 scale-110" 
                : "opacity-50 scale-100"
            }`}
            onClick={() => handleIndicatorClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
