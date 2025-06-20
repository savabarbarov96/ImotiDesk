import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Quote, Star } from "lucide-react";
import { FadeIn, SlideIn } from "@/components/ui/motion";

const testimonials = [
  {
    name: "Мария Георгиева",
    position: "Имотен консултант",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
          quote: "Работата в AutomationAid е изключително удовлетворяваща. Компанията предлага страхотна среда за развитие и възможности за израстване в кариерата.",
    rating: 5,
    years: "2 години в компанията"
  },
  {
    name: "Иван Петров",
    position: "Маркетинг специалист",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          quote: "Най-ценното нещо в AutomationAid е колективът - работя с колеги, които са истински професионалисти и винаги готови да помогнат.",
    rating: 5,
    years: "3 години в компанията"
  },
  {
    name: "Елена Димитрова",
    position: "Административен асистент",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          quote: "Вече 3 години съм част от AutomationAid и всеки ден ми носи нови предизвикателства и възможности за учене.",
    rating: 5,
    years: "3 години в компанията"
  },
  {
    name: "Николай Иванов",
    position: "Имотен консултант",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          quote: "Компанията наистина инвестира в обучението на своите служители. Благодарение на AutomationAid успях да развия умения, които ми помагат всеки ден.",
    rating: 5,
    years: "4 години в компанията"
  },
  {
    name: "Симона Тодорова",
    position: "Юрисконсулт",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
          quote: "Динамичната работна среда и възможността да работя с различни клиенти прави всеки ден в AutomationAid уникален и интересен.",
    rating: 5,
    years: "1 година в компанията"
  }
];

const EmployeeTestimonials = () => {
  return (
    <div className="relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-rose-50/50 rounded-3xl -z-10" />
      <div className="absolute top-4 right-4 w-32 h-32 bg-red-100/30 rounded-full blur-2xl -z-10" />
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-rose-100/30 rounded-full blur-xl -z-10" />
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full px-4 py-8"
      >
        <CarouselContent className="-ml-6">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3">
              <SlideIn delay={index * 0.1}>
                <Card className="relative h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden group hover:scale-105">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-rose-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="p-8 flex flex-col h-full relative z-10">
                    {/* Quote icon with background */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-red-100 rounded-full w-16 h-16 opacity-20" />
                      <Quote className="h-8 w-8 text-red-600 relative z-10 mt-4 ml-4" />
                    </div>
                    
                    {/* Rating stars */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    
                    {/* Quote text */}
                    <blockquote className="text-gray-700 mb-6 flex-grow leading-relaxed italic">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Employee info */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="relative">
                        <Avatar className="h-14 w-14 rounded-full overflow-hidden bg-gradient-to-br from-red-100 to-rose-100 ring-2 ring-red-200/50 ring-offset-2">
                          <AvatarImage 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                            className="h-full w-full object-cover" 
                          />
                          <AvatarFallback className="bg-gradient-to-br from-red-500 to-rose-500 text-white font-semibold">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-red-600 font-medium">{testimonial.position}</p>
                        <p className="text-xs text-gray-500 mt-1">{testimonial.years}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-3xl" />
                </Card>
              </SlideIn>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Custom navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <CarouselPrevious className="relative translate-y-0 left-0 bg-white/90 hover:bg-white border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 shadow-lg hover:shadow-xl transition-all duration-300" />
          <CarouselNext className="relative translate-y-0 right-0 bg-white/90 hover:bg-white border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 shadow-lg hover:shadow-xl transition-all duration-300" />
        </div>
      </Carousel>
    </div>
  );
};

export default EmployeeTestimonials;
