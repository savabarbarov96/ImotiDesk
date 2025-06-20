import React, { useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface PropertyCarouselProps {
  images: string[];
}

export const PropertyCarousel: React.FC<PropertyCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>();
  const [fullscreenCarouselApi, setFullscreenCarouselApi] = useState<CarouselApi>();

  // If there are no images, use a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden border">
        <AspectRatio ratio={16 / 9}>
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Няма налични снимки</p>
          </div>
        </AspectRatio>
      </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    mainCarouselApi?.scrollTo(index);
    fullscreenCarouselApi?.scrollTo(index);
  };

  // Track Carousel index
  React.useEffect(() => {
    if (!mainCarouselApi) return;

    const handleSelect = () => {
      setActiveIndex(mainCarouselApi.selectedScrollSnap());
    };

    mainCarouselApi.on("select", handleSelect);
    
    return () => {
      mainCarouselApi.off("select", handleSelect);
    };
  }, [mainCarouselApi]);

  return (
    <>
      <div className="space-y-2">
        {/* Main Carousel */}
        <div className="relative rounded-lg overflow-hidden">
          <Carousel className="w-full" setApi={setMainCarouselApi}>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={image} 
                        alt={`Снимка на имота ${index + 1}`} 
                        className="object-cover w-full h-full cursor-pointer rounded-lg"
                        onClick={() => setFullscreenMode(true)}
                      />
                    </AspectRatio>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-[#F0426A]/30 hover:border-[#F0426A]/50 text-[#E42B57]" />
            <CarouselNext className="right-2 bg-white/80 hover:bg-white border-[#F0426A]/30 hover:border-[#F0426A]/50 text-[#E42B57]" />
          </Carousel>

          {/* Carousel controls */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white border border-neutral-200 backdrop-blur-sm"
            onClick={() => setFullscreenMode(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          {/* Image counter */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails - Always visible */}
        <div className="grid grid-cols-6 md:grid-cols-8 gap-2 px-3 py-2">
          {images.map((thumb, index) => (
            <div 
              key={index} 
              className={`cursor-pointer rounded-md overflow-hidden transition-all ${
                activeIndex === index 
                  ? 'ring-2 ring-red-600 opacity-100 scale-[1.02]' 
                  : 'opacity-70 hover:opacity-100 hover:scale-[1.02]'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <AspectRatio ratio={16 / 9}>
                <img 
                  src={thumb} 
                  alt={`Миниатюра ${index + 1}`} 
                  className="object-cover w-full h-full rounded-md"
                />
              </AspectRatio>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={fullscreenMode} onOpenChange={setFullscreenMode}>
        <DialogContent className="max-w-7xl bg-black border-none text-white p-0 gap-0">
          <div className="relative pt-8">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-white hover:bg-white/20 z-10"
              onClick={() => setFullscreenMode(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <Carousel className="w-full" setApi={setFullscreenCarouselApi}>
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center h-[80vh]">
                      <img 
                        src={image} 
                        alt={`Снимка на имота ${index + 1}`} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-black/40 hover:bg-black/60 text-white border-neutral-600 h-12 w-12">
                <ChevronLeft className="h-8 w-8" />
              </CarouselPrevious>
              <CarouselNext className="right-4 bg-black/40 hover:bg-black/60 text-white border-neutral-600 h-12 w-12">
                <ChevronRight className="h-8 w-8" />
              </CarouselNext>
            </Carousel>
            
            {/* Fullscreen thumbnails */}
            <div className="p-4 pb-6 bg-black/90">
              <div className="grid grid-cols-8 md:grid-cols-12 gap-2 max-w-5xl mx-auto">
                {images.map((thumb, index) => (
                  <div 
                    key={index} 
                    className={`cursor-pointer rounded-md overflow-hidden transition-all ${
                      activeIndex === index 
                        ? 'ring-2 ring-red-500 opacity-100' 
                        : 'opacity-50 hover:opacity-100'
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={thumb} 
                        alt={`Миниатюра ${index + 1}`} 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-4 text-white/70 text-sm">
                {activeIndex + 1} / {images.length} • Натиснете ESC за изход
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
