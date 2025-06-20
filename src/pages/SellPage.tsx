import React, { useState } from "react";
import SalesProcessInfo from "@/components/sell/SalesProcessInfo";
import { motion } from "framer-motion";
import { FadeUp, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import PropertySellForm from "@/components/PropertySellForm";
import { TextShimmer } from '@/components/ui/text-shimmer';
import { Card } from "@/components/ui/card";
import { CheckCircle2, Phone, Mail, Star, TrendingUp, Users, Award, ChevronLeft, ChevronRight, Bed, Bath, Square, MapPin } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Glass effect component for background elements
interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ className, width = "w-full", height = "h-full", children, ...props }, ref) => {
    return (
      <div 
        className={`relative overflow-hidden rounded-xl ${width} ${height} ${className || ""}`} 
        ref={ref} 
        {...props}
      >
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden border border-[#f5f5f51a] rounded-xl">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
        </div>
        <div className="relative z-20">{children}</div>
      </div>
    )
  }
);

Glass.displayName = "Glass";

// Sample sold properties data
const soldProperties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    address: "ул. Витоша 15, София",
    price: "€450,000",
    originalPrice: "€420,000",
    beds: 3,
    baths: 2,
    sqft: 120,
    soldDate: "Продаден за 15 дни",
    agent: "Мария Петрова"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    address: "бул. Цариградско шосе 125, София",
    price: "€320,000",
    originalPrice: "€295,000",
    beds: 2,
    baths: 1,
    sqft: 85,
    soldDate: "Продаден за 8 дни",
    agent: "Георги Иванов"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    address: "ул. Гео Милев 45, Пловдив",
    price: "€180,000",
    originalPrice: "€165,000",
    beds: 2,
    baths: 1,
    sqft: 75,
    soldDate: "Продаден за 12 дни",
    agent: "Анна Димитрова"
  }
];

const SellPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % soldProperties.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + soldProperties.length) % soldProperties.length);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero section with property showcase */}
      <div className="relative w-full py-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            
            {/* Left side - Property showcase */}
            <FadeUp delay={0.2}>
              <div className="relative">
                <TextShimmer 
                  as="h1"
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-dark to-secondary bg-clip-text text-transparent"
                  duration={3}
                >
                  Продай своя имот с Automation Aid
                </TextShimmer>
                <p className="text-lg md:text-xl text-neutral-dark mb-8 leading-relaxed">
                  Вижте как нашите клиенти постигат отлични резултати
                </p>

                {/* Property slider */}
                <div className="relative bg-white rounded-2xl shadow-floating overflow-hidden">
                  <div className="relative h-80 overflow-hidden">
                    <motion.div
                      className="flex transition-transform duration-500 ease-in-out h-full"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {soldProperties.map((property, index) => (
                        <div key={property.id} className="w-full flex-shrink-0 relative">
                          <img 
                            src={property.image} 
                            alt={property.address}
                            className="w-full h-full object-cover"
                          />
                          {/* SOLD stamp */}
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transform -rotate-12">
                            ПРОДАДЕН
                          </div>
                          {/* Property overlay info */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                            <div className="flex items-center mb-2">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span className="text-sm">{property.address}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                  <Bed className="w-4 h-4 mr-1" />
                                  {property.beds}
                                </div>
                                <div className="flex items-center">
                                  <Bath className="w-4 h-4 mr-1" />
                                  {property.baths}
                                </div>
                                <div className="flex items-center">
                                  <Square className="w-4 h-4 mr-1" />
                                  {property.sqft}м²
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold">{property.price}</div>
                                <div className="text-xs text-green-300">{property.soldDate}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Property details card */}
                  <div className="p-6 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-primary mb-1">
                          {soldProperties[currentSlide].price}
                        </div>
                        <div className="text-sm text-neutral">
                          Първоначална цена: <span className="line-through">{soldProperties[currentSlide].originalPrice}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-neutral">Агент</div>
                        <div className="font-medium">{soldProperties[currentSlide].agent}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-600 font-medium">
                        ✓ {soldProperties[currentSlide].soldDate}
                      </div>
                      <div className="text-sm text-primary font-medium">
                        +{Math.round(((parseFloat(soldProperties[currentSlide].price.replace(/[€,]/g, '')) - parseFloat(soldProperties[currentSlide].originalPrice.replace(/[€,]/g, ''))) / parseFloat(soldProperties[currentSlide].originalPrice.replace(/[€,]/g, '')) * 100))}% над първоначалната цена
                      </div>
                    </div>
                  </div>

                  {/* Navigation buttons */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Slide indicators */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {soldProperties.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentSlide ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>

                                    {/* Right side - Form */}            <FadeUp delay={0.4}>              <div className="relative">                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-floating border border-white/30 overflow-hidden sticky top-8">                  <GlowingEffect                    spread={50}                    glow={true}                    disabled={false}                    proximity={80}                    inactiveZone={0.01}                    borderWidth={3}                  />                                    {/* Form header with enhanced design */}                  <div className="relative p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-white/20">                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>                    <TextShimmer                       as="h2"                      className="text-2xl md:text-3xl font-bold text-primary mb-2"                      duration={2.5}                    >                      Вашите данни                    </TextShimmer>                    <p className="text-neutral-dark text-lg">Попълнете формата, за да започнем процеса</p>                                        {/* Trust indicators */}                    <div className="flex items-center mt-4 space-x-4">                      <div className="flex items-center text-sm text-neutral">                        <CheckCircle2 className="w-4 h-4 text-primary mr-1" />                        Безплатна оценка                      </div>                      <div className="flex items-center text-sm text-neutral">                        <Star className="w-4 h-4 text-secondary mr-1" />                        Експертни съвети                      </div>                    </div>                  </div>                                    <div className="p-6 max-h-[80vh] overflow-y-auto">                    <PropertySellForm />                  </div>                </div>              </div>            </FadeUp>
          </div>

          {/* Stats section */}
          <FadeUp delay={0.8} className="mt-20">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <StaggerItem delay={0.9}>
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-elegant hover:shadow-floating transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-2">98%</h3>
                  <p className="text-neutral-dark">Успешни продажби</p>
                </div>
              </StaggerItem>
              <StaggerItem delay={1.0}>
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-elegant hover:shadow-floating transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-2">500+</h3>
                  <p className="text-neutral-dark">Доволни клиенти</p>
                </div>
              </StaggerItem>
              <StaggerItem delay={1.1}>
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-elegant hover:shadow-floating transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-2">90</h3>
                  <p className="text-neutral-dark">Дни средно време</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </FadeUp>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left column - Process Info */}
          <motion.div 
            className="lg:col-span-7" 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="sticky top-8">
              <Glass className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-floating">
                <div className="p-8 border-b border-white/20">
                  <TextShimmer 
                    as="h2"
                    className="text-3xl md:text-4xl font-bold text-primary mb-3"
                    duration={2.5}
                  >
                    Процес на продажба
                  </TextShimmer>
                  <p className="text-neutral-dark text-lg">Как работим с продавачите</p>
                </div>
                <SalesProcessInfo />
                
                {/* Enhanced "Имате въпроси?" section */}
                <div className="p-8">
                  <motion.div 
                    className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-elegant"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <GlowingEffect
                      spread={30}
                      glow={true}
                      disabled={false}
                      proximity={48}
                      inactiveZone={0.01}
                      borderWidth={2}
                    />
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Phone className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-primary">Имате въпроси?</h3>
                      <p className="text-neutral-dark mb-6 text-lg">
                        Нашите експерти са на разположение да отговорят на всички ваши въпроси относно продажбата на вашия имот.
                      </p>
                      <div className="flex flex-col space-y-4 items-center">
                        <div className="flex items-center bg-white/60 rounded-full px-6 py-3 shadow-sm">
                          <Phone className="w-5 h-5 text-primary mr-3" />
                          <span className="font-medium">+359 888 123 456</span>
                        </div>
                        <div className="flex items-center bg-white/60 rounded-full px-6 py-3 shadow-sm">
                          <Mail className="w-5 h-5 text-primary mr-3" />
                          <span className="font-medium">contact@example.bg</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </Glass>
            </div>
          </motion.div>
          
                              {/* Right column - Additional Information or CTA */}          <motion.div             className="lg:col-span-5"            initial={{ opacity: 0, x: 30 }}            animate={{ opacity: 1, x: 0 }}            transition={{ duration: 0.8, delay: 0.5 }}          >            <div className="sticky top-8">              <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-floating border border-white/30 overflow-hidden">                <GlowingEffect                  spread={50}                  glow={true}                  disabled={false}                  proximity={80}                  inactiveZone={0.01}                  borderWidth={3}                />                                {/* Additional info header */}                <div className="relative p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-white/20">                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>                  <TextShimmer                     as="h2"                    className="text-2xl md:text-3xl font-bold text-primary mb-2"                    duration={2.5}                  >                    Защо да изберете нас?                  </TextShimmer>                  <p className="text-neutral-dark text-lg">Предимствата на работата с Automation Aid</p>                </div>                                <div className="p-8">                  <div className="space-y-6">                    <div className="flex items-start space-x-4">                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">                        <TrendingUp className="w-6 h-6 text-white" />                      </div>                      <div>                        <h3 className="font-bold text-neutral-dark mb-2">Максимална цена</h3>                        <p className="text-neutral text-sm">Постигаме средно 15% по-висока цена от пазарната благодарение на нашата експертиза и маркетингова стратегия.</p>                      </div>                    </div>                                        <div className="flex items-start space-x-4">                      <div className="w-12 h-12 bg-gradient-to-r from-secondary to-primary rounded-xl flex items-center justify-center flex-shrink-0">                        <Users className="w-6 h-6 text-white" />                      </div>                      <div>                        <h3 className="font-bold text-neutral-dark mb-2">Персонален подход</h3>                        <p className="text-neutral text-sm">Всеки клиент получава индивидуален план за продажба и персонален агент, който го придружава през целия процес.</p>                      </div>                    </div>                                        <div className="flex items-start space-x-4">                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">                        <Award className="w-6 h-6 text-white" />                      </div>                      <div>                        <h3 className="font-bold text-neutral-dark mb-2">Бърза продажба</h3>                        <p className="text-neutral text-sm">98% от имотите се продават в рамките на 90 дни благодарение на нашата ефективна маркетингова стратегия.</p>                      </div>                    </div>                                        <div className="flex items-start space-x-4">                      <div className="w-12 h-12 bg-gradient-to-r from-secondary to-primary rounded-xl flex items-center justify-center flex-shrink-0">                        <CheckCircle2 className="w-6 h-6 text-white" />                      </div>                      <div>                        <h3 className="font-bold text-neutral-dark mb-2">Пълна подкрепа</h3>                        <p className="text-neutral text-sm">От оценката до финализирането на сделката - ние се грижим за всички детайли и документация.</p>                      </div>                    </div>                  </div>                                    <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">                    <div className="text-center">                      <h4 className="font-bold text-primary mb-2">Готови да започнете?</h4>                      <p className="text-sm text-neutral mb-4">Формата вече е попълнена в горната част на страницата</p>                      <button                         onClick={() => {                          window.scrollTo({ top: 0, behavior: 'smooth' });                        }}                        className="text-primary hover:text-primary-dark font-medium hover:underline transition-colors duration-200"                      >                        ↑ Върнете се към формата                      </button>                    </div>                  </div>                </div>              </div>            </div>          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
