"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from '@/lib/supabase';
import ViberIcon from './icons/ViberIcon';

function Grid({
  cellSize = 12,
  strokeWidth = 1,
  patternOffset = [0, 0],
  className,
}: {
  cellSize?: number;
  strokeWidth?: number;
  patternOffset?: [number, number];
  className?: string;
}) {
  const id = React.useId();

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 text-black/10",
        className,
      )}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={`grid-${id}`}
          x={patternOffset[0] - 1}
          y={patternOffset[1] - 1}
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect fill={`url(#grid-${id})`} width="100%" height="100%" />
    </svg>
  );
}

const ViberBanner = () => {
  const [show, setShow] = React.useState(true);
  const [groupLink, setGroupLink] = React.useState('https://invite.viber.com/');
  const [bannerText, setBannerText] = React.useState('Стани част от нашата Viber общност и получи достъп до най-новите предложения.');
  const [buttonText, setButtonText] = React.useState('Присъедини се');
  const [isEnabled, setIsEnabled] = React.useState(true);
  
  React.useEffect(() => {
    fetchViberSettings();
    
    // Set up a real-time subscription to viber_settings changes
    const subscription = supabase
      .channel('viber_settings_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'viber_settings' 
      }, (payload) => {
        console.log('Viber settings changed:', payload);
        fetchViberSettings();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchViberSettings = async () => {
    try {
      console.log('ViberBanner: Fetching Viber settings...');
      const { data, error } = await supabase
        .from('viber_settings')
        .select('group_link, description, button_text, enabled')
        .single();

      if (error) {
        console.error('ViberBanner: Error fetching Viber settings:', error);
        return;
      }
      
      console.log('ViberBanner: Viber settings loaded:', data);
      if (data) {
        setGroupLink(data.group_link || 'https://invite.viber.com/');
        if (data.description) {
          setBannerText(data.description);
        }
        if (data.button_text) {
          setButtonText(data.button_text);
        }
        setIsEnabled(data.enabled);
      }
    } catch (error) {
      console.error('ViberBanner: Error fetching Viber settings:', error);
    }
  };
  
  if (!show || !isEnabled) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative isolate bg-gray-500 text-white py-4 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #6B7280, #9CA3AF)",
            boxShadow: "0 8px 32px rgba(107, 114, 128, 0.2)",
          }}
        >
          <Grid
            cellSize={13}
            patternOffset={[0, -1]}
            className="text-white/10 mix-blend-overlay [mask-image:linear-gradient(to_right,white,transparent)] md:[mask-image:linear-gradient(to_right,white_60%,transparent)]"
          />

          <motion.div
            className="absolute inset-0 -z-10"
            style={{ opacity: 0.15 }}
            animate={{
              background: [
                "radial-gradient(circle at top left, rgba(255, 255, 255, 0.5), transparent 70%)",
                "radial-gradient(circle at top right, rgba(255, 255, 255, 0.5), transparent 70%)",
                "radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.5), transparent 70%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="bg-white/20 rounded-full p-2 mr-4 backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Official Viber logo */}
                    <ViberIcon className="h-9 w-9 text-[#7360f2]" />
                  </motion.div>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-lg font-medium"
                >
                  {bannerText}
                </motion.p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-white text-gray-700 hover:bg-gray-100 font-medium shadow-lg"
                  onClick={() => window.open(groupLink, '_blank')}
                >
                  {buttonText}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default ViberBanner;
