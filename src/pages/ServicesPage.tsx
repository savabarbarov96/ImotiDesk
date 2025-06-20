import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, Variants, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import ServiceCard from '@/components/services/ServiceCard';
import ServicesContactCTA from '@/components/services/ServicesContactCTA';
import { useServices } from '@/hooks/use-services';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { 
  Sparkles, 
  KeyRound, 
  Home, 
  Building, 
  ArrowDown, 
  BarChart4, 
  ShieldCheck, 
  Users, 
  Gauge,
  ChevronRight,
  Star,
  StarHalf
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/about/ContactForm';

// Advanced Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1],
      delay: i * 0.1,
    },
  }),
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1],
      delay: i * 0.1,
    },
  }),
};

const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.215, 0.61, 0.355, 1] 
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  }
};

// Add a pulsing animation variant
const pulsingAnimation = {
  scale: [1, 1.05, 1],
  boxShadow: [
    "0px 0px 0px rgba(255, 255, 255, 0.5)",
    "0px 0px 20px rgba(255, 255, 255, 0.8)",
    "0px 0px 0px rgba(255, 255, 255, 0.5)"
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  }
};

// Hero section background images
const bgImages = [
  '/assets/timeline/services.jpg',
  '/assets/timeline/property-1.jpg',
  '/assets/timeline/property-2.jpg',
];

const ServicesPage = () => {
  const { data: services, isLoading, error } = useServices();
  const controls = useAnimation();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  
  const highlightedService = services?.find(service => service.is_highlighted);
  const regularServices = services?.filter(service => !service.is_highlighted);

  // Refs for sections
  const processRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Start animations when component mounts
  useEffect(() => {
    controls.start("visible");
    
    // Cycle through background images
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [controls]);

  const processSteps = [
    {
      step: "01",
      title: "Консултация",
      description: "Започваме с разбиране на вашите нужди и цели в сферата на недвижимите имоти.",
      icon: <Users className="h-8 w-8" />
    },
    {
      step: "02",
      title: "Оценка",
      description: "Извършваме детайлна оценка на имота и пазарна анализа.",
      icon: <Gauge className="h-8 w-8" />
    },
    {
      step: "03",
      title: "Стратегия",
      description: "Разработваме персонализирана стратегия за постигане на вашите цели.",
      icon: <BarChart4 className="h-8 w-8" />
    },
    {
      step: "04",
      title: "Реализация",
      description: "Изпълняваме стратегията и ви водим през целия процес.",
      icon: <ShieldCheck className="h-8 w-8" />
    }
  ];

  const serviceCategories = [
    {
      id: "buy-sell",
      name: "Купуване и Продажба",
      icon: <Home className="h-6 w-6 text-emerald-500" />,
      backgroundColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      id: "rent",
      name: "Отдаване под наем",
      icon: <KeyRound className="h-6 w-6 text-blue-500" />,
      backgroundColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "management",
      name: "Управление на имоти",
      icon: <Building className="h-6 w-6 text-purple-500" />,
      backgroundColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Helmet>
        <title>Услуги | Automation Aid</title>
        <meta 
          name="description" 
          content="Професионални услуги в областта на недвижимите имоти от Automation Aid. Продажба, отдаване под наем, консултации и още." 
        />
      </Helmet>

      <Navbar />

      {/* Redesigned Hero Section - Minimalist Approach */}
      <section className="relative bg-white pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden flex items-center justify-center min-h-[90vh] px-4 sm:px-6 lg:px-8">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1.2 }}
            className="absolute right-0 top-[20%] h-[300px] w-[300px] rounded-full bg-purple-300/30 blur-[80px]"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute left-0 bottom-[20%] h-[250px] w-[250px] rounded-full bg-blue-300/30 blur-[80px]"
          />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              {/* Main content - Left (3 columns wide) */}
              <div className="lg:col-span-3 space-y-6 lg:space-y-8 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="space-y-6"
                >
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
                  >
                    <span className="block">Професионални</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                      Услуги?
                    </span>
                    <span className="block mt-2">Лесно!</span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0"
                  >
                    Недвижими имоти с грижа за детайла. Пълен набор от професионални услуги от експерти с богат опит.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="flex flex-wrap gap-4 items-center justify-center lg:justify-start pt-2"
                  >
                    <div className="relative">
                      <Button 
                        onClick={() => scrollToSection(servicesRef)}
                        size="lg"
                        className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white text-lg relative z-10"
                      >
                        Разгледайте услугите
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                      <div className="absolute -right-3 -top-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full z-20 uppercase tracking-wide">
                        Ново
                      </div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="flex items-center gap-2 ml-2 border border-gray-200 px-4 py-2 rounded-lg"
                    >
                      <div className="font-semibold text-gray-700">Google</div>
                      <div className="text-sm font-medium">оценка</div>
                      <div className="font-bold">5</div>
                      <div className="flex text-yellow-500">
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500" />
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Right side image and percentage - Right (2 columns wide) */}
              <div className="lg:col-span-2 relative">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative"
                >
                  <div className="relative bg-white rounded-xl overflow-hidden shadow-xl">
                    <img 
                      src="/assets/timeline/services.jpg" 
                      alt="Професионални услуги" 
                      className="w-full h-auto rounded-xl" 
                    />
                  </div>
                  
                  {/* Stats card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="absolute -right-5 top-1/4 bg-white rounded-lg shadow-lg p-4 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-full">
                        <Home className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Активни имоти</div>
                        <div className="font-bold">280+</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlighted service with special design */}
      {highlightedService && (
        <section className="py-16 relative overflow-hidden bg-gradient-to-br from-primary/5 to-blue-100/20">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]"
            />
          </div>
          
          <div className="container relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.div variants={fadeInScale}>
                <Badge className="mb-3 px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                  Препоръчана услуга
                </Badge>
              </motion.div>
              <motion.h2 
                variants={fadeInUp} 
                className="text-3xl md:text-4xl font-bold"
              >
                {highlightedService.name}
              </motion.h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-primary/10"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                    {(() => {
                      let IconComponent: React.ElementType = Sparkles;
                      if (highlightedService.icon && Object.prototype.hasOwnProperty.call(LucideIcons, highlightedService.icon)) {
                        IconComponent = (LucideIcons as any)[highlightedService.icon];
                      }
                      return <IconComponent className="h-8 w-8 text-primary" />;
                    })()}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{highlightedService.name}</h3>
                  <p className="text-muted-foreground mb-6">{highlightedService.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {["Персонализиран подход", "Приоритетно обслужване", "Детайлна консултация", "Пълно съдействие"].map((feature, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2"
                      >
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <ShieldCheck className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => scrollToSection(processRef)}
                    className="mt-4"
                  >
                    Научете повече
                  </Button>
                </div>
                <div className="flex-1 relative">
                  <motion.div
                    animate={{
                      boxShadow: ["0px 0px 0px rgba(79, 70, 229, 0.2)", "0px 0px 20px rgba(79, 70, 229, 0.3)", "0px 0px 0px rgba(79, 70, 229, 0.2)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="relative z-10 rounded-2xl overflow-hidden border border-primary/20"
                  >
                    <img 
                      src="/assets/timeline/services.jpg" 
                      alt="Специална услуга" 
                      className="w-full h-auto rounded-2xl" 
                    />
                  </motion.div>
                  <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/20 to-blue-400/20 blur-[50px] rounded-full transform translate-x-8 translate-y-8" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Regular services with new card design */}
      <section ref={servicesRef} className="py-16 md:py-24 bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInScale}>
              <Badge className="mb-3 px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                Услуги
              </Badge>
            </motion.div>
            <motion.h2 
              variants={fadeInUp} 
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Всички услуги
            </motion.h2>
            <motion.p 
              variants={fadeInUp} 
              custom={1}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Независимо от вашите нужди, ние имаме подходящо решение за вас
            </motion.p>
          </motion.div>
          
          {isLoading && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-muted-foreground">Зареждане на услуги...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8 bg-white rounded-xl shadow-lg border border-red-200 p-6">
              <p className="text-red-500">
                Възникна грешка при зареждане на услугите. Моля, опитайте отново по-късно.
              </p>
            </div>
          )}
          
          {!isLoading && !error && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {regularServices?.map((service, index) => (
                <motion.div
                  key={service.id}
                  variants={fadeInScale}
                  custom={index}
                >
                  <ServiceCard
                    name={service.name}
                    description={service.description}
                    icon={service.icon}
                    features={[
                      "Професионална консултация",
                      "Индивидуален подход",
                      "Пазарна оценка",
                      "Правно съдействие"
                    ]}
                    onLearnMore={() => scrollToSection(processRef)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Process Section with Timeline */}
      <section ref={processRef} className="py-16 md:py-32 relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]"
          />
        </div>
        
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInScale}>
              <Badge className="mb-3 px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                Методология
              </Badge>
            </motion.div>
            <motion.h2 
              variants={fadeInUp} 
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Нашият процес
            </motion.h2>
            <motion.p 
              variants={fadeInUp} 
              custom={1}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Следваме утвърдена методология, за да гарантираме най-добри резултати за вас
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 transform -translate-y-1/2 origin-left hidden md:block"
            />
            
            <div className="grid gap-10 md:grid-cols-4">
              {processSteps.map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="relative mb-8 z-10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-400/20 rounded-full blur-[15px]" />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white border-2 border-primary/30 shadow-lg">
                        {process.icon}
                      </div>
                      <div className="absolute -right-2 -top-2 h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                        {process.step}
                      </div>
                    </motion.div>
                    <h3 className="mb-3 text-xl font-bold">{process.title}</h3>
                    <p className="text-muted-foreground">{process.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA section with redesigned look */}
      <section ref={contactRef}>
        <ServicesContactCTA />
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
