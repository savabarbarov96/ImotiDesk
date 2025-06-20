import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Home, MessageSquare, BarChart2, FileCheck, ArrowRight } from "lucide-react";

const processSteps = [
  {
    icon: <Clock className="h-6 w-6 text-white" />,
    title: "Безплатна оценка",
    description: "Ще направим професионална оценка на вашия имот, базирана на локацията, състоянието и пазарните условия.",
    duration: "24 часа"
  },
  {
    icon: <Home className="h-6 w-6 text-white" />,
    title: "Подготовка на имота",
    description: "Нашите експерти ще ви посъветват как да подготвите имота за продажба и ще организират професионална фотосесия.",
    duration: "3-5 дни"
  },
  {
    icon: <BarChart2 className="h-6 w-6 text-white" />,
    title: "Маркетингова стратегия",
    description: "Създаваме персонализирана маркетингова стратегия, включваща качествени снимки, видео обиколки и реклама в нашите канали.",
    duration: "1 седмица"
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-white" />,
    title: "Огледи и преговори",
    description: "Организираме огледи с потенциални купувачи и водим преговорите от ваше име, за да получите най-добрата цена.",
    duration: "2-8 седмици"
  },
  {
    icon: <FileCheck className="h-6 w-6 text-white" />,
    title: "Финализиране на сделката",
    description: "Осигуряваме правна помощ за цялата документация и ви придружаваме до успешното финализиране на сделката.",
    duration: "1-2 седмици"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const SalesProcessInfo: React.FC = () => {
  return (
    <div className="p-8">
      <motion.div 
        className="space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {processSteps.map((step, index) => (
          <motion.div
            key={index}
            className="group relative"
            variants={item}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Connection line */}
            {index !== processSteps.length - 1 && (
              <div className="absolute left-8 top-16 w-0.5 h-12 bg-gradient-to-b from-primary/30 to-secondary/30 z-0" />
            )}
            
            <div className="relative flex items-start space-x-6 p-6 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-elegant hover:shadow-floating transition-all duration-300 group-hover:border-primary/20">
              {/* Step number and icon */}
              <div className="flex-shrink-0 relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  index === processSteps.length - 1 
                    ? "bg-gradient-to-br from-secondary to-secondary-dark group-hover:scale-110" 
                    : "bg-gradient-to-br from-primary to-primary-dark group-hover:scale-110"
                }`}>
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-primary shadow-md">
                  {index + 1}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-neutral-dark group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {step.duration}
                  </span>
                </div>
                <p className="text-neutral leading-relaxed mb-4">{step.description}</p>
                
                {/* Progress indicator */}
                <div className="flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Следваща стъпка</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Success rate card */}
      <motion.div 
        className="mt-12 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, type: "spring", stiffness: 100 }}
      >
        <div className="relative p-8 bg-gradient-to-br from-primary/10 via-white/80 to-secondary/10 backdrop-blur-sm rounded-2xl border border-white/30 shadow-floating">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
          
          <div className="relative flex items-center">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mr-6 shadow-lg">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-4xl font-bold text-primary">98%</span>
                <span className="text-lg text-neutral-dark">успешни продажби</span>
              </div>
              <p className="text-neutral-dark font-medium">
                от имотите в нашия портфейл се продават успешно в рамките на 90 дни.
              </p>
            </div>
          </div>
          
          {/* Additional stats */}
          <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-1">45</div>
              <div className="text-sm text-neutral">дни средно време</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">15%</div>
              <div className="text-sm text-neutral">над пазарната цена</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalesProcessInfo;
