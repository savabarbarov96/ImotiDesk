"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundGradients = [
    "bg-gradient-to-br from-red-900 via-red-800 to-rose-800",
    "bg-gradient-to-br from-rose-900 via-red-800 to-rose-700",
    "bg-gradient-to-br from-red-800 via-rose-800 to-red-700",
    "bg-gradient-to-br from-rose-800 via-red-700 to-rose-600",
  ];

  const cardGradients = [
    "linear-gradient(to bottom right, rgb(185 28 28), rgb(194 65 12))", // red-700 to orange-700
    "linear-gradient(to bottom right, rgb(190 18 60), rgb(136 19 55))", // rose-600 to rose-800
    "linear-gradient(to bottom right, rgb(159 18 57), rgb(127 29 29))", // rose-800 to red-900
    "linear-gradient(to bottom right, rgb(220 38 38), rgb(190 18 60))", // red-600 to rose-600
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    cardGradients[0]
  );

  useEffect(() => {
    setBackgroundGradient(cardGradients[activeCard % cardGradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      className={cn(
        "h-[30rem] overflow-y-auto flex justify-center relative space-x-10 rounded-md p-10 transition-all duration-500",
        backgroundGradients[activeCard % backgroundGradients.length]
      )}
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-bold text-white"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-kg text-slate-200 max-w-sm mt-10"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "hidden lg:block h-60 w-80 rounded-md bg-white sticky top-10 overflow-hidden shadow-lg",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
}; 