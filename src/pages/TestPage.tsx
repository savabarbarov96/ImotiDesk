import React, { useState, useEffect, useRef } from 'react';
import { HeroParallaxDemo } from '../components/blocks/hero-parallax-demo.tsx';
import { motion, useAnimation } from 'framer-motion';
import { Volume2, VolumeX, Facebook, Instagram, RefreshCw, Wrench } from 'lucide-react';
import { TransparentNavbar } from '../components/ui/transparent-navbar';
import { mainNavItems } from '../data/navigation-items';
import DesktopSearchBar from '../components/DesktopSearchBar';
import { Button } from '@/components/ui/button';
import { fixPropertyImagesInTempFolders } from '@/utils/storageHelpers';
import { toast } from '@/hooks/use-toast';

// Import the CSS for Automation Aid text opacity
import '../styles/custom-styles.css';

const TestPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeControlsRef = useRef<HTMLDivElement>(null);
  const volumeButtonControls = useAnimation();
  const [isFixingImages, setIsFixingImages] = useState(false);

  // Handle audio toggle
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFixImages = async () => {
    setIsFixingImages(true);
    try {
      console.log('Starting image fix process...');
      await fixPropertyImagesInTempFolders();
      toast({
        title: 'Изображенията са поправени',
        description: 'Всички изображения в временни папки са преместени в правилните места.',
      });
    } catch (error) {
      console.error('Error fixing images:', error);
      toast({
        title: 'Грешка при поправянето',
        description: 'Възникна грешка при преместването на изображенията.',
        variant: 'destructive'
      });
    } finally {
      setIsFixingImages(false);
    }
  };

  // Initialize audio and pulsate animation
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
    }

    // Initial pulsate animation
    volumeButtonControls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 1.5, repeat: 0 }
    });

    // Set up recurring pulsate animation every 10 seconds
    const intervalId = setInterval(() => {
      volumeButtonControls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 1.5, repeat: 0 }
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, [volumeButtonControls]);

  // Add CSS for custom scrollbar and styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Make Automation Aid text have full opacity */
      .text-shimmer-container:has(.automation-aid-text) {
        opacity: 1 !important;
      }
      
      .automation-aid-text {
        opacity: 1 !important;
      }

      /* Custom Scrollbar Styles - Premium Minimal Design */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      ::-webkit-scrollbar-track {
        background: #eaeef5;
        border-radius: 3px;
        margin: 1px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(82, 82, 82, 0.4);
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.03);
        transition: all 0.2s ease;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(128, 128, 128, 0.6);
      }
      
      ::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (    <div       className="relative h-screen bg-white text-gray-800 overflow-hidden"      ref={containerRef}      style={{ backgroundColor: 'white' }}    >
      {/* Audio element */}
      <audio 
        ref={audioRef} 
        src="/assets/audio/ambient.mp3" 
        loop
      />
      
      {/* Navigation */}
      <TransparentNavbar 
        items={mainNavItems} 
        isDark={false} 
        className="bg-transparent border-none"
      />
      
      {/* Social Media Sticky Icons - Hidden on mobile */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 flex-col gap-5 hidden md:flex">
        <motion.a 
          href="https://www.facebook.com" 
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, y: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-full p-3 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-300"
        >
          <Facebook size={24} className="text-black" />
        </motion.a>
        <motion.a 
          href="https://www.instagram.com" 
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, y: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-full p-3 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-300"
        >
          <Instagram size={24} className="text-black" />
        </motion.a>
      </div>
      
      {/* Hero Section */}      <section className="relative h-full bg-white overflow-hidden">        {/* Hero Content */}        <HeroParallaxDemo />      </section>
      
      <DesktopSearchBar />

      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8">Test Page</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Image Fix Utility</h2>
            <p className="text-gray-600 mb-4">
              This will move any property images from temporary folders to their proper property folders.
            </p>
            <Button
              onClick={handleFixImages}
              disabled={isFixingImages}
              className="flex items-center gap-2"
            >
              {isFixingImages ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wrench className="w-4 h-4" />
              )}
              {isFixingImages ? 'Поправя изображения...' : 'Поправи изображения'}
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TestPage; 