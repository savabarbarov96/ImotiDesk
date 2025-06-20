"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  useAnimationControls,
} from "framer-motion";
import { TextShimmer } from "@/components/ui/text-shimmer";
import logo from "@/assets/logo.png"
import { TextRotate } from "@/components/ui/text-rotate";
import MobileSearchBar from "@/components/MobileSearchBar";
import { Facebook, Instagram } from "lucide-react";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
    is_featured?: boolean;
    is_exclusive?: boolean;
  }[];
}) => {
  // Ensure we have enough products by combining with fallback for background animation
  const allProducts = products.length >= 10 ? products : [...products, ...fallbackProducts].slice(0, 10);
  
  const firstRow = allProducts.slice(0, 5);
  const secondRow = allProducts.slice(5, 10);
  
  // Use only the first 3 products for the main display (these should be featured)
  const featuredProducts = products.slice(0, 3);
  
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { 
    stiffness: 150,
    damping: 50,
    mass: 1.5,
    bounce: 0.2,
    duration: 0.8
  };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 300]),
    springConfig
  );

  const headerScale = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [1, 0.85]),
    springConfig
  );

  const firstRowControls = useAnimationControls();
  const secondRowControls = useAnimationControls();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      // First row - scroll left to right infinitely (seamless)
      firstRowControls.start({
        x: ["-50%", "0%"],
        transition: {
          duration: 60,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      });

      // Second row - scroll right to left infinitely (seamless)
      secondRowControls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: 65,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [firstRowControls, secondRowControls]);

  return (
    <div
      ref={ref}
      className="h-full py-2 sm:py-4 md:py-6 overflow-hidden antialiased relative flex flex-col bg-white"
    >
      {/* Background scrolling images */}
      <div className="absolute inset-0 z-0">
        {/* First row - scrolling left to right */}
        <motion.div 
          className="absolute top-[10%] md:top-[15%] flex space-x-4 md:space-x-8 opacity-10 md:opacity-15"
          animate={firstRowControls}
          style={{ width: 'max-content' }}
        >
          {[...firstRow, ...firstRow, ...firstRow, ...firstRow].map((product, index) => (
            <BackgroundProductCard
              product={product}
              key={`bg-first-${index}`}
            />
          ))}
        </motion.div>

        {/* Second row - scrolling right to left */}
        <motion.div 
          className="absolute top-[75%] md:top-[65%] flex space-x-4 md:space-x-8 opacity-8 md:opacity-12"
          animate={secondRowControls}
          style={{ width: 'max-content' }}
        >
          {[...secondRow, ...secondRow, ...secondRow, ...secondRow].map((product, index) => (
            <BackgroundProductCard
              product={product}
              key={`bg-second-${index}`}
            />
          ))}
        </motion.div>
      </div>

      {/* Main content - hide header on mobile */}
      <motion.div className="relative z-10 hidden md:block" style={{ transform: 'none' }}>
        <Header />
      </motion.div>
      
      {/* Property cards section - responsive layout - moved higher */}
      <motion.div className="relative z-20 flex flex-col justify-start items-center gap-3 w-full pt-2 md:pt-4 pb-16 sm:pb-20 md:pb-24 lg:pb-28">
        {/* Desktop layout - horizontal cards - spread across full width */}
        <motion.div 
          className="hidden lg:flex w-full max-w-6xl justify-between items-center px-6 xl:px-8 mb-8 lg:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {featuredProducts.map((product, index) => (
            <StaticProductCard
              key={product.title}
              product={product}
              size="medium"
            />
          ))}
        </motion.div>

        {/* Tablet layout - smaller horizontal cards */}
        <motion.div 
          className="hidden md:flex lg:hidden w-full max-w-4xl justify-between items-center px-6 mb-10 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {featuredProducts.slice(0, 2).map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="flex-1 flex justify-center"
            >
              <StaticProductCard
                product={product}
                size="medium"
              />
            </motion.div>
          ))}
        </motion.div>


      </motion.div>

      {/* Mobile layout - centered search bar and bottom social icons */}
      <motion.div 
        className="relative z-10 flex flex-col justify-between items-center min-h-[60vh] px-3 sm:px-4 py-8 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        {/* Search bar in the center */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-xs sm:max-w-sm">
            <MobileSearchBar />
          </div>
        </div>
        
        {/* Social Media Icons and Logo at the bottom */}
        <motion.div 
          className="flex flex-col items-center gap-4 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          {/* Automation Aid Logo */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <img 
              src={logo} 
              alt="Automation Aid Logo" 
              className="h-8 w-auto opacity-70"
            />
          </motion.div>
          
          {/* Social Icons */}
          <div className="flex justify-center gap-4">
            <motion.a 
              href="https://www.facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.1, 
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-full p-3 shadow-md flex items-center justify-center border border-white/30 hover:shadow-lg transition-all duration-300"
            >
              <Facebook size={18} className="text-[#1877F2] group-hover:text-[#166FE5] transition-colors duration-200" />
            </motion.a>
            
            <motion.a 
              href="https://www.instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.1, 
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-full p-3 shadow-md flex items-center justify-center border border-white/30 hover:shadow-lg transition-all duration-300"
            >
              <Instagram size={18} className="text-[#E4405F] group-hover:text-[#D73A56] transition-colors duration-200" />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <motion.div 
      className="max-w-7xl relative mx-auto pt-20 md:pt-16 lg:pt-20 pb-2 md:pb-4 lg:pb-6 px-4 md:px-6 lg:px-8 w-full right-0 top-0 hero-element text-right"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ transform: 'none' }}
    >
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: "auto" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h1 
          className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold dark:text-white hero-element leading-tight"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3
          }}
          style={{ transform: 'translateY(0)' }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex-col items-end justify-end"
          > 
            <div>
              Твоят нов{" "}
            </div>
            <div className="inline-block">
              <TextRotate
                texts={["дом", "имот", "хотел", "офис", "парцел"]}
                mainClassName="text-[#E42B57] text-end"
                staggerFrom="first"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={3000}
              />
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              те очаква
            </motion.span>
            </div>
          </motion.span>
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};

export const BackgroundProductCard = ({
  product,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
}) => {
  return (
    <motion.div 
      className="h-48 w-64 md:h-60 md:w-80 relative flex-shrink-0 pointer-events-auto cursor-pointer"
      whileHover={{
        scale: 1.08,
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      initial={{ opacity: 0.8 }}
      whileInView={{ opacity: 1 }}
    >
      <img
        src={product.thumbnail}
        className="object-cover object-center absolute h-full w-full inset-0 rounded-xl shadow-lg transition-all duration-300"
        alt={product.title}
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
};

export const StaticProductCard = ({
  product,
  size = "large"
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
    is_featured?: boolean;
    is_exclusive?: boolean;
  };
  size?: "small" | "medium" | "large";
}) => {
  const sizeClasses = {
    small: "h-[16rem] w-[20rem]",
    medium: "h-[18rem] w-[22rem]", 
    large: "h-[20rem] w-[24rem] lg:h-[22rem] lg:w-[26rem] xl:h-[24rem] xl:w-[28rem]"
  };

  const titleSizeClasses = {
    small: "text-lg bottom-4 left-4",
    medium: "text-xl bottom-5 left-5",
    large: "text-lg lg:text-xl bottom-4 left-4 lg:bottom-6 lg:left-6"
  };

  return (
    <motion.div
      whileHover={{
        y: size === "small" ? -15 : size === "medium" ? -20 : -35,
        scale: size === "small" ? 1.03 : 1.05,
        rotateY: size === "small" ? 2 : 3,
        zIndex: 50,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      key={product.title}
      className={`group/product ${sizeClasses[size]} relative flex-shrink-0 hero-element z-30 hover:z-50`}
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = product.link;
        }}
      >
        <img
          src={product.thumbnail}
          className="object-cover object-center absolute h-full w-full inset-0 rounded-xl transition-all duration-500 group-hover/product:brightness-90 group-hover/product:scale-105 shadow-lg"
          alt={product.title}
        />
      </a>
      
      {/* Tags container */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
        {product.is_featured && (
          <div className="bg-white/20 backdrop-blur-sm text-white/90 px-2.5 py-1 rounded-full text-xs font-normal shadow-sm flex items-center border border-white/20">
            Препоръчан
          </div>
        )}
        {product.is_exclusive && (
          <div className="bg-white/20 backdrop-blur-sm text-white/90 px-2.5 py-1 rounded-full text-xs font-normal shadow-sm flex items-center border border-white/20">
            Ексклузивен
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 rounded-xl h-full w-full opacity-0 group-hover/product:opacity-70 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-all duration-500"></div>
      <h2 className={`absolute ${titleSizeClasses[size]} opacity-0 group-hover/product:opacity-100 text-white font-bold transition-all duration-500 transform translate-y-6 group-hover/product:translate-y-0 z-10`}>
        {product.title}
      </h2>
    </motion.div>
  );
};

export const MiniProductCard = ({
  product,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
    is_featured?: boolean;
    is_exclusive?: boolean;
  };
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="group/product h-24 w-24 relative flex-shrink-0 rounded-lg overflow-hidden shadow-md"
    >
      <a
        href={product.link}
        className="block h-full w-full"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = product.link;
        }}
      >
        <img
          src={product.thumbnail}
          className="object-cover object-center h-full w-full transition-all duration-300 group-hover/product:brightness-90 group-hover/product:scale-110"
          alt={product.title}
        />
      </a>
      
      {/* Tags container for mini cards */}
      <div className="absolute top-1 left-1 flex flex-col gap-1 z-20">
        {product.is_featured && (
          <div className="bg-white/25 backdrop-blur-sm text-white/90 px-1 py-0.5 rounded-full text-[9px] font-normal shadow-sm border border-white/20">
            П
          </div>
        )}
        {product.is_exclusive && (
          <div className="bg-white/25 backdrop-blur-sm text-white/90 px-1 py-0.5 rounded-full text-[9px] font-normal shadow-sm border border-white/20">
            Е
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/product:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0 hero-element"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl cursor-none"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = product.link;
        }}
      >
        <img
          src={product.thumbnail}
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-xl transition-all duration-300 group-hover/product:brightness-90"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 rounded-xl h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none transition-opacity duration-300"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white transition-opacity duration-300 transform translate-y-4 group-hover/product:translate-y-0">
        {product.title}
      </h2>
    </motion.div>
  );
};

// Fallback products if database fetch fails or returns fewer than needed
export const fallbackProducts = [
  {
    title: "Сграда Лунна светлина",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
    is_featured: true,
    is_exclusive: false,
  },
  {
    title: "Модерни офиси",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2601&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: true,
  },
  {
    title: "Бизнес център",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2670&auto=format&fit=crop",
    is_featured: true,
    is_exclusive: false,
  },
  {
    title: "Градски апартаменти",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2670&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
  {
    title: "Луксозни имоти",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop",
    is_featured: true,
    is_exclusive: true,
  },
  {
    title: "Крайбрежни вили",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
  {
    title: "Планински къщи",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
  {
    title: "Семейни домове",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
  {
    title: "Модерни апартаменти",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
  {
    title: "Бизнес центрове",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=2574&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
  {
    title: "Жилищни комплекси",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
  {
    title: "Градски къщи",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2670&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
  {
    title: "Малки апартаменти",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2680&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
  {
    title: "Студентски жилища",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2835&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
  {
    title: "Офисни пространства",
    link: "/properties",
    thumbnail: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=2670&auto=format&fit=crop",
    is_featured: false,
    is_exclusive: false,
  },
]; 