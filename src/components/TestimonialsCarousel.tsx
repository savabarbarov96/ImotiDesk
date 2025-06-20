import React, { useRef, useEffect } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import TestimonialCard from './TestimonialCard';
import { useIntersectionObserver } from '@/lib/animations/intersection-observer';
import { FadeIn } from '@/components/ui/motion';

const testimonials = [
  {
    quote: "AutomationAid ми помогна да намеря перфектния дом за моето семейство. Техният екип беше изключително отзивчив и професионален през целия процес.",
    author: "Георги Иванов",
    position: "Купувач"
  },
  {
    quote: "Продадох апартамента си за по-малко от месец с помощта на AutomationAid. Получих отлична цена и сделката премина безпроблемно.",
    author: "Мария Петрова",
    position: "Продавач" 
  },
  {
    quote: "Като инвеститор в недвижими имоти, високо ценя експертизата на AutomationAid. Те винаги намират най-добрите възможности за инвестиция.",
    author: "Стоян Димитров",
    position: "Инвеститор"
  },
  {
          quote: "Сътрудничеството с Automation Aid беше страхотно решение за нашия бизнес. Намериха ни идеалния офис на отлична локация.",
    author: "Петър Николов",
    position: "Бизнес клиент"
  },
  {
          quote: "Агентите на Automation Aid са истински професионалисти. Отзивчиви, информирани и винаги готови да помогнат. Горещо ги препоръчвам!",
    author: "Елена Тодорова",
    position: "Клиент"
  }
];

const TestimonialsCarousel = () => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  return (
    <section 
      className="py-16 bg-gray-50" 
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12" animate={isIntersecting}>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#E42B57]">Какво казват нашите клиенти</h2>
          <p className="text-lg text-neutral">Мнения от реални клиенти на Automation Aid</p>
        </FadeIn>

        <div className="px-8 md:px-16 relative">
          <Carousel 
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <div className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div 
                      className="animate-fade-in" 
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TestimonialCard {...testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
            <div className="flex justify-center mt-8 gap-4">
              <div
                className="transition-transform duration-200 hover:scale-110 active:scale-90"
              >
                <CarouselPrevious className="relative inset-auto" />
              </div>
              <div
                className="transition-transform duration-200 hover:scale-110 active:scale-90"
              >
                <CarouselNext className="relative inset-auto" />
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
