"use client";

import React, { useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Heart, Coffee, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnimationSettings } from '@/lib/animations/motion';
import { FadeIn, FadeUp, SlideIn, ScaleIn } from '@/components/ui/motion';

interface CultureValueProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const cultureValues: CultureValueProps[] = [
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Екипна работа",
    description: "Вярваме в силата на сътрудничеството и взаимната подкрепа за постигане на общи цели.",
  },
  {
    icon: <Heart className="h-10 w-10 text-primary" />,
    title: "Страст",
    description: "Влагаме страст във всичко, което правим, и се стремим към съвършенство във всеки проект.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Иновации",
    description: "Насърчаваме креативното мислене и търсим иновативни решения на предизвикателствата.",
  },
  {
    icon: <Coffee className="h-10 w-10 text-primary" />,
    title: "Баланс",
    description: "Ценим баланса между работа и личен живот, създавайки здравословна работна среда.",
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Растеж",
    description: "Подкрепяме личностното и професионалното развитие на всеки член от нашия екип.",
  },
  {
    icon: <ArrowRight className="h-10 w-10 text-primary" />,
    title: "Отговорност",
    description: "Поемаме отговорност за нашите действия и се стремим към положително въздействие.",
  },
];

const CultureValue: React.FC<CultureValueProps> = ({ icon, title, description }) => {
  const { shouldAnimate } = useAnimationSettings() ?? { shouldAnimate: true };
  
  return (
    <FadeUp
      className="group relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:shadow-md bg-background/80"
    >
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"></div>
      <div className="relative space-y-3">
        <div className="mb-4 opacity-90 transition-opacity duration-300 group-hover:opacity-100">{icon}</div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </FadeUp>
  );
};

const CultureSection: React.FC = () => {
  const scrollToOpenPositions = () => {
    const openPositionsSection = document.getElementById('open-positions');
    if (openPositionsSection) {
      openPositionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="culture" className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <FadeIn
            className="space-y-2"
          >
            <Badge variant="outline" className="px-3 py-1 text-sm">
              Нашата култура
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ценностите, които ни обединяват
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Нашата корпоративна култура е изградена върху ценности, които ни помагат да създаваме
              изключителни продукти и да поддържаме вдъхновяваща работна среда.
            </p>
          </FadeIn>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cultureValues.map((value, index) => (
            <CultureValue 
              key={index} 
              {...value} 
            />
          ))}
        </div>

        <SlideIn
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8"
          delay={0.3}
        >
          <div className="relative w-full md:w-1/2 h-[400px] rounded-xl overflow-hidden border border-gray-200 shadow-lg">
            <img
                                    alt="AutomationAid bosses"
              className="object-cover w-full h-full"
                                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          <div className="w-full md:w-1/2 space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <h3 className="text-2xl font-bold">Присъедини се към нашия екип</h3>
            <p className="text-muted-foreground">
              Ние винаги търсим талантливи и мотивирани хора, които споделят нашите ценности и имат
              страст към това, което правят. Разгледайте нашите отворени позиции и станете част от
              нашето пътуване.
            </p>
            <Button className="group mt-4" onClick={scrollToOpenPositions}>
              Виж отворените позиции
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </SlideIn>
      </div>
    </section>
  );
};

export default CultureSection; 