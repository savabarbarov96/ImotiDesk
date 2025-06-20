"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.2", "end 0.8"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div
      className="w-full bg-gradient-to-b from-background to-background/80 font-sans"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[500px]">
          {/* Left Content */}
          <motion.div 
            className="space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-sm font-medium text-gray-500 tracking-wide uppercase">
                За нас
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <TextShimmer
                as="h1"
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
                duration={2.5}
              >
                Нашата история
              </TextShimmer>
              <div className="mt-2">
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E42B57]">
                  & Мисия.
                </span>
              </div>
            </motion.div>

            <motion.p 
              className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Вижте как се развива нашата компания през годините и какво постигнахме заедно. 
              Доверени от хиляди клиенти, ние предоставяме експертни услуги в областта на недвижимите имоти.
            </motion.p>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-[#E42B57] rounded-full"></div>
                <span className="text-gray-700">Основана 2020 година</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-[#E42B57] rounded-full"></div>
                <span className="text-gray-700">Над 500 успешни сделки</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-[#E42B57] rounded-full"></div>
                <span className="text-gray-700">Доверие и професионализъм</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 p-8">
              <motion.img
                src="/assets/timeline/mission-vision.jpg"
                alt="Нашата история - Automation Aid екип"
                className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
              />
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#E42B57]/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-200/30 rounded-full blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex justify-center md:justify-start pt-16 md:pt-32 md:gap-16 lg:gap-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start w-16 sm:w-20 md:w-[200px] lg:w-[300px]">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background dark:bg-black flex items-center justify-center">
                <motion.div 
                  className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                />
              </div>
              <TextShimmer 
                as="h1"
                className={cn(
                  "hidden md:block text-xl md:pl-20 md:text-3xl lg:text-4xl font-bold",
                  "text-neutral-500 dark:text-neutral-500",
                  "[--base-color:theme(colors.red.800)] [--base-gradient-color:theme(colors.red.400)]"
                )}
                duration={2.5}
              >
                {item.title}
              </TextShimmer>
            </div>

            <div className="relative pl-6 pr-4 sm:pl-8 md:pl-4 flex-1 max-w-[800px]">
              <TextShimmer 
                as="h1"
                className={cn(
                  "md:hidden block text-xl sm:text-2xl mb-6 text-center font-bold",
                  "text-neutral-500 dark:text-neutral-500",
                  "[--base-color:theme(colors.red.800)] [--base-gradient-color:theme(colors.red.400)]"
                )}
                duration={2.5}
              >
                {item.title}
              </TextShimmer>
              <div className="text-center md:text-left">
                {item.content}
              </div>
            </div>
          </motion.div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-red-500 via-red-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}; 