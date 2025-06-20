import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeIn, FadeUp, SlideIn, ScaleIn } from "@/components/ui/motion";
import { Building2, Users, TrendingUp, Award, ArrowRight, Star, Briefcase, Target } from "lucide-react";

const CareersHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { value: "50+", label: "Експерти в екипа", delay: 0.5 },
  ];

  const scrollToPositions = () => {
    const element = document.getElementById('open-positions');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      {/* Enhanced Background Pattern with more blur */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.4))] -z-10 blur-sm" />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <FadeUp animate={isVisible} delay={0.2}>
              <div className="inline-flex items-center gap-2 bg-red-100/80 backdrop-blur-sm text-red-700 px-4 py-2 rounded-full text-sm font-medium border border-red-200/50 transition-all duration-500 hover:bg-red-200/80">
                <Building2 className="w-4 h-4" />
                Отворени позиции в недвижими имоти
              </div>
            </FadeUp>

            <FadeUp animate={isVisible} delay={0.4}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Присъединете се,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 transition-all duration-700">
                  Работете
                </span>
                {" "}и{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 transition-all duration-700">
                  Успейте
                </span>
              </h1>
            </FadeUp>

            <FadeUp animate={isVisible} delay={0.6}>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed transition-all duration-500">
                Станете част от водещата агенция за недвижими имоти в България. 
                Развийте кариерата си с нас и помогнете на хората да намерят своя дом.
              </p>
            </FadeUp>

            <FadeUp animate={isVisible} delay={0.8}>
              <Button 
                onClick={scrollToPositions}
                size="lg" 
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 group transform"
              >
                Започнете сега
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </FadeUp>

            {/* Career Benefits */}
            <FadeUp animate={isVisible} delay={1.0}>
              <div className="flex items-center gap-8 pt-8">
                <div className="flex items-center gap-3 transition-all duration-500 hover:scale-105">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 transition-all duration-300 hover:scale-110"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">Отлична работна среда</span>
                </div>
                
                <div className="bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-500 hover:bg-gray-800/90 hover:scale-105">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">Топ работодател 2024</span>
                </div>
              </div>
            </FadeUp>
          </div>

                    {/* Right Content */}          <div className="relative">            <SlideIn animate={isVisible} delay={0.5}>              <div className="relative">                {/* Modern Building Image Container */}                <div className="relative rounded-3xl overflow-hidden shadow-2xl">                  <div className="w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden">                    <img                       src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"                      alt="Екипът на AutomationAid - кариерни възможности"                      className="w-full h-full object-cover transition-all duration-700 hover:scale-105"                    />                    {/* Subtle overlay for better text readability */}                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />                  </div>                                    {/* Floating company badge */}                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">                    <div className="flex items-center gap-2">                      <Building2 className="w-5 h-5 text-red-600" />                      <span className="text-sm font-semibold text-gray-900">AutomationAid</span>                    </div>                  </div>                </div>                {/* Floating Stats Card */}                {stats.map((stat, index) => (                  <ScaleIn key={index} animate={isVisible} delay={stat.delay}>                    <Card className="absolute top-1/2 -left-4 bg-white/95 backdrop-blur-md p-4 shadow-2xl rounded-xl transition-all duration-500 hover:scale-110 hover:shadow-3xl hover:bg-white">                      <div className="text-center">                        <div className="text-2xl font-bold text-gray-900 transition-colors duration-300">{stat.value}</div>                        <div className="text-xs text-gray-600 whitespace-nowrap">{stat.label}</div>                      </div>                    </Card>                  </ScaleIn>                ))}              </div>            </SlideIn>          </div>
        </div>
      </div>

            {/* Floating Dashboard Card - Enhanced with better positioning and animations */}      <ScaleIn animate={isVisible} delay={1.2}>        <Card className="absolute bottom-20 right-8 bg-white/95 backdrop-blur-lg p-6 shadow-3xl rounded-2xl max-w-xs z-20 transition-all duration-700 hover:scale-105 hover:shadow-4xl hover:bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 transition-colors duration-300">Кариерно развитие</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            
            {/* Enhanced Progress Ring */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90 transition-transform duration-500 hover:scale-110" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeDasharray="85, 100"
                    className="transition-all duration-1000 animate-pulse"
                    style={{ strokeDashoffset: isVisible ? '0' : '100' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900 transition-all duration-500">85%</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 transition-all duration-300 hover:text-green-600">
                  <TrendingUp className="w-4 h-4 text-green-500 transition-transform duration-300 hover:scale-110" />
                  <span>Растеж</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 transition-all duration-300 hover:text-red-600">
                  <Briefcase className="w-4 h-4 text-red-500 transition-transform duration-300 hover:scale-110" />
                  <span>Кариера</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </ScaleIn>
      
    </section>
  );
};

export default CareersHero; 