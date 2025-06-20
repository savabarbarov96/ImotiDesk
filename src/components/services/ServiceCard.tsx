import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as LucideIcons from "lucide-react";

interface ServiceCardProps {
  name: string;
  description: string;
  icon: string;
  isHighlighted?: boolean;
  features?: string[];
  onLearnMore?: () => void;
}

const ServiceCard = ({ 
  name, 
  description, 
  icon, 
  isHighlighted = false,
  features = [],
  onLearnMore
}: ServiceCardProps) => {
  // Safely get the icon component from Lucide
  let IconComponent: React.ElementType = LucideIcons.HelpCircle;
  
  try {
    if (icon && typeof icon === 'string' && Object.prototype.hasOwnProperty.call(LucideIcons, icon)) {
      IconComponent = (LucideIcons as any)[icon];
    } else if (icon === 'home') {
      IconComponent = LucideIcons.Home;
    } else if (icon === 'key') {
      IconComponent = LucideIcons.Key;
    } else if (icon === 'lightbulb') {
      IconComponent = LucideIcons.Lightbulb;
    } else if (icon === 'scale') {
      IconComponent = LucideIcons.Scale;
    } else if (icon === 'file-text') {
      IconComponent = LucideIcons.FileText;
    } else if (icon === 'calculator') {
      IconComponent = LucideIcons.Calculator;
    } else {
      // Provide fallback icons based on service name if available
      if (name.toLowerCase().includes('прода')) {
        IconComponent = LucideIcons.Home;
      } else if (name.toLowerCase().includes('наем')) {
        IconComponent = LucideIcons.Key;
      } else if (name.toLowerCase().includes('консулт')) {
        IconComponent = LucideIcons.Lightbulb;
      } else if (name.toLowerCase().includes('юрид')) {
        IconComponent = LucideIcons.Scale;
      } else if (name.toLowerCase().includes('финанс')) {
        IconComponent = LucideIcons.Calculator;
      } else if (name.toLowerCase().includes('doc')) {
        IconComponent = LucideIcons.FileText;
      }
    }
  } catch (error) {
    IconComponent = LucideIcons.HelpCircle;
  }
  
  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1]
      }
    },
    hover: { 
      y: -15,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    }
  };
  
  // Feature item animations
  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + (i * 0.1),
        duration: 0.4
      }
    })
  };
  
  // Icon animation
  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.1
      }
    },
    hover: { 
      scale: 1.15,
      rotate: 5,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 10
      }
    }
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      className="h-full"
    >
      <div className="h-full p-[3px] rounded-xl bg-gradient-to-b from-transparent via-transparent to-transparent group-hover:from-primary/30 group-hover:via-primary/5 group-hover:to-transparent transition-all duration-500">
        <Card className="h-full border-gray-200/80 bg-white shadow-sm backdrop-blur-sm transition-all duration-300 group overflow-hidden relative rounded-xl">
          {/* Animated gradient overlay on hover */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-100/20" />
            <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/10" />
            <div className="absolute -left-24 -bottom-24 h-40 w-40 rounded-full bg-blue-300/10" />
          </motion.div>
          
          <CardHeader className="relative pb-0 z-10">
            <div className="relative z-10 flex flex-col">
              <motion.div 
                variants={iconVariants}
                className={`mb-6 p-3 rounded-xl w-14 h-14 flex items-center justify-center relative ${isHighlighted ? 'bg-primary/20' : 'bg-gray-100 group-hover:bg-primary/10'}`}
              >
                <motion.div
                  animate={{ 
                    boxShadow: isHighlighted 
                      ? ["0px 0px 0px rgba(79, 70, 229, 0.2)", "0px 0px 15px rgba(79, 70, 229, 0.3)", "0px 0px 0px rgba(79, 70, 229, 0.2)"] 
                      : "none" 
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute inset-0 rounded-xl"
                />
                <IconComponent className={`h-6 w-6 ${isHighlighted ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}`} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  {name}
                </CardTitle>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <CardDescription className="text-muted-foreground">
                  {description}
                </CardDescription>
              </motion.div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 z-10 relative">
            {features.length > 0 && (
              <>
                <Separator className="mb-4 bg-gray-200/70" />
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      custom={index}
                      variants={featureVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 + (index * 0.1) }}
                        viewport={{ once: true }}
                        className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center"
                      >
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      </motion.div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
