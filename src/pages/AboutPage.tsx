import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Phone, Mail, MessageSquare, Building2, ArrowRight, Facebook, Instagram, User, Star, Sparkles, Users } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/SocialMediaIcons';
// Logo will be referenced directly from public folder
import { TeamMember } from '@/integrations/supabase/types';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { TimelineDemo } from "@/components/about/timeline-demo";
import { cn } from '@/lib/utils';
import { motion, useAnimation, Variants } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Animation variants
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

const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  }
};

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Using any as a workaround for TypeScript errors
        // until the Supabase schema is fully updated
        const { data, error } = await (supabase as any)
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) {
          throw error;
        }

        setTeamMembers(data as TeamMember[] || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
    controls.start("visible");
  }, [controls]);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  // Function to format phone number for proper protocol links
  const formatPhoneForLink = (phone: string) => {
    return phone.replace(/[^0-9+]/g, '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
      <Helmet>
        <title>За нас | Automation Aid</title>
      </Helmet>

      <Navbar />

      <main className="flex-grow">
        {/* Hero Section - Sava Barbarov */}
        <section className="relative min-h-screen flex items-center justify-center overflow-visible bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-32">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80')] bg-cover bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-gray-50/80 to-white/90"></div>
          
          {/* Animated Background Elements with enhanced animations */}
          <motion.div 
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 z-0"
            animate={{
              ...floatingAnimation,
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 z-0"
            animate={{
              ...floatingAnimation,
              scale: [1, 1.2, 1],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* Additional decorative elements with rotation */}
          <motion.div 
            className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full mix-blend-multiply filter blur-lg opacity-20 z-0"
            animate={{
              ...floatingAnimation,
              rotate: [0, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-green-300 to-teal-400 rounded-full mix-blend-multiply filter blur-lg opacity-20 z-0"
            animate={{
              ...floatingAnimation,
              rotate: [360, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          {/* Smooth transition to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-10"></div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            {/* Logo with entrance animation */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-8 left-8 z-20 hidden lg:block"
            >
              <img
                src="/trendimo.png"
                alt="Automation Aid Logo"
                className="h-24 w-auto drop-shadow-lg"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              animate={controls}
              variants={fadeInUp}
              custom={0}
              className="max-w-6xl mx-auto"
            >
              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                 {/* Left Side - Text Content */}
                 <div className="text-center lg:text-left space-y-6 lg:space-y-8">
                  <motion.div
                    variants={fadeInUp}
                    custom={1}
                    className="space-y-4"
                  >
                                                                <motion.div
                         whileHover={{ scale: 1.05 }}
                         transition={{ type: "spring", stiffness: 300 }}
                       >
                         <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-6 py-3 text-sm font-medium shadow-lg">
                           <Star className="w-4 h-4 mr-2" />
                           Лидер в индустрията
                         </Badge>
                       </motion.div>
                     
                     <motion.h1 
                       className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight"
                       whileHover={{ scale: 1.02 }}
                       transition={{ type: "spring", stiffness: 200 }}
                     >
                       <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                         Сава
                       </span>
                       <br />
                       <span className="text-gray-800">Барбаров</span>
                       <div className="flex items-center justify-center lg:justify-start mt-4">
                         <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-red-600 font-normal">Експерт в недвижимите имоти</span>
                       </div>
                     </motion.h1>
                     
                     <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blackF-600 font-medium leading-relaxed">
                       <TextShimmer 
                         className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-black-600 font-medium"
                         duration={3}
                       >
                         Вашият надежден партньор при търсене на идеалния дом
                       </TextShimmer>
                     </div>
                  </motion.div>

                  <motion.div
                    variants={fadeInUp}
                    custom={2}
                    className="space-y-6"
                  >
                                         <motion.p 
                       className="text-lg text-gray-600 leading-relaxed max-w-2xl"
                       whileHover={{ scale: 1.02 }}
                       transition={{ type: "spring", stiffness: 300 }}
                     >
                       Професионалист с дългогодишен опит в сферата на недвижимите имоти. 
                       Сава съчетава традиционния брокерски подход с модерните технологии, 
                       за да предостави най-доброто обслужване на своите клиенти.
                     </motion.p>

                     {/* Professional Stats */}
                     <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                       <motion.div 
                         className="flex items-center space-x-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-purple-200 shadow-lg"
                         whileHover={{ scale: 1.05, y: -5 }}
                         transition={{ type: "spring", stiffness: 300 }}
                       >
                         <Building2 className="w-8 h-8 text-pink-500" />
                         <div>
                           <div className="text-3xl font-bold text-gray-800">500+</div>
                           <div className="text-sm text-gray-500">Успешни сделки</div>
                         </div>
                       </motion.div>
                       
                       <motion.div 
                         className="flex items-center space-x-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-cyan-200 shadow-lg"
                         whileHover={{ scale: 1.05, y: -5 }}
                         transition={{ type: "spring", stiffness: 300 }}
                       >
                         <Users className="w-8 h-8 text-cyan-500" />
                         <div>
                           <div className="text-3xl font-bold text-gray-800">10+</div>
                           <div className="text-sm text-gray-500">Години опит</div>
                         </div>
                       </motion.div>
                     </div>

                                         {/* CTA Buttons */}
                     <div className="flex items-center justify-center lg:justify-start gap-6 pt-6">
                       {/* Phone Circle Button */}
                       <motion.div
                         whileHover={{ scale: 1.1, y: -3 }}
                         whileTap={{ scale: 0.95 }}
                         transition={{ type: "spring", stiffness: 300 }}
                       >
                         <a 
                           href="tel:+359888123456" 
                           className="group relative"
                         >
                           <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:from-green-600 group-hover:to-green-700">
                             <Phone className="w-8 h-8 text-white" />
                           </div>
                           <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                             Обадете се
                           </div>
                         </a>
                       </motion.div>
                       
                       {/* Email Circle Button */}
                       <motion.div
                         whileHover={{ scale: 1.1, y: -3 }}
                         whileTap={{ scale: 0.95 }}
                         transition={{ type: "spring", stiffness: 300 }}
                       >
                         <a 
                           href="mailto:contact@example.bg" 
                           className="group relative"
                         >
                           <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-700">
                             <Mail className="w-8 h-8 text-white" />
                           </div>
                           <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                             Имейл
                           </div>
                         </a>
                       </motion.div>

                       {/* Call to Action Text */}
                       <motion.div
                         className="ml-4"
                         whileHover={{ scale: 1.02 }}
                         transition={{ type: "spring", stiffness: 300 }}
                       >
                         <div className="text-lg font-semibold text-gray-800">Свържете се с нас!</div>
                         <div className="text-sm text-gray-600">За консултация и оглед</div>
                       </motion.div>
                     </div>
                  </motion.div>
                </div>

                                 {/* Right Side - Image */}
                 <motion.div
                   variants={fadeInScale}
                   custom={3}
                   className="relative max-w-md mx-auto lg:max-w-lg"
                   whileHover={{ scale: 1.02 }}
                   transition={{ type: "spring", stiffness: 200 }}
                 >
                   <div className="relative">
                     {/* Enhanced glowing border effect with border animations */}
                     <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
                     <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-purple-400 to-blue-400 rounded-3xl blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                     
                     {/* Main image container with enhanced styling and border animations */}
                     <motion.div 
                       className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl p-3 overflow-hidden shadow-2xl border border-gray-200"
                       whileHover={{ y: -5 }}
                       transition={{ type: "spring", stiffness: 300 }}
                     >
                       <div className="relative">
                         <GlowingEffect
                           spread={40}
                           glow={true}
                           disabled={false}
                           proximity={64}
                           inactiveZone={0.01}
                           borderWidth={3}
                         />
                         <img 
                           src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                           alt="Сава Барбаров - Експерт в недвижимите имоти" 
                           className="w-full h-auto rounded-2xl object-cover shadow-xl"
                         />
                         
                         {/* Subtle overlay gradient for better contrast */}
                         <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
                       </div>
                     </motion.div>

                     {/* Enhanced floating elements with higher z-index - Automation Aid Logo */}
                     <motion.div
                       className="absolute -top-8 -right-8 bg-white rounded-full p-4 shadow-2xl z-20 border-2 border-gray-200"
                       animate={floatingAnimation}
                       whileHover={{ scale: 1.1, rotate: 5 }}
                       transition={{ type: "spring", stiffness: 300 }}
                     >
                       <img
                         src="/trendimo.png"
                         alt="Automation Aid Logo"
                         className="w-12 h-12 object-contain"
                       />
                     </motion.div>
                     
                     <motion.div
                       className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-5 shadow-2xl z-20"
                       animate={{
                         ...floatingAnimation,
                         transition: { ...floatingAnimation.transition, delay: 1.5 }
                       }}
                       whileHover={{ scale: 1.1, rotate: -15 }}
                       transition={{ type: "spring", stiffness: 300 }}
                     >
                       <Star className="w-10 h-10 text-white" />
                     </motion.div>

                     {/* Additional decorative floating elements */}
                     <motion.div
                       className="absolute top-1/4 -left-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full p-3 shadow-xl z-20"
                       animate={{
                         ...floatingAnimation,
                         transition: { ...floatingAnimation.transition, delay: 0.5 }
                       }}
                       whileHover={{ scale: 1.15 }}
                     >
                       <Instagram className="w-6 h-6 text-white" />
                     </motion.div>

                     <motion.div
                       className="absolute bottom-1/4 -right-4 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full p-3 shadow-xl z-20"
                       animate={{
                         ...floatingAnimation,
                         transition: { ...floatingAnimation.transition, delay: 2.5 }
                       }}
                       whileHover={{ scale: 1.15 }}
                     >
                       <Users className="w-6 h-6 text-white" />
                     </motion.div>
                   </div>
                 </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </motion.div>
        </section>

        {/* Story Scroll Section - Now at the top */}
        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-4">
            <div className="rounded-xl overflow-hidden text-center">
              <TimelineDemo />
            </div>
          </div>
        </section>

        <Separator className="max-w-2xl mx-auto opacity-30" />

        {/* Team Section - Moved above Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <TextShimmer 
              as="h2"
              className="text-2xl md:text-3xl font-bold mb-12 text-center"
              duration={2.5}
            >
              Запознайте се с екипа
            </TextShimmer>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#E42B57]" />
              </div>
            ) : teamMembers.length === 0 ? (
              <p className="text-center text-gray-500">
                Информацията за нашия екип скоро ще бъде достъпна.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {teamMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="bg-white rounded-xl shadow-elegant overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer w-full max-w-sm"
                    onClick={() => handleMemberClick(member)}
                  >
                    <div className="aspect-square overflow-hidden">
                      {member.image_url ? (
                        <img 
                          src={member.image_url} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Avatar className="h-24 w-24">
                            <AvatarFallback className="text-2xl">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-lg text-[#C41945]">{member.name}</h3>
                      <p className="text-gray-600">{member.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Separator className="max-w-2xl mx-auto opacity-30" />

        {/* Values Section - Now below Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <TextShimmer 
              as="h2"
              className="text-2xl md:text-3xl font-bold mb-12 text-center"
              duration={2.5}
            >
              Нашите ценности
            </TextShimmer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="relative bg-white rounded-xl p-6 shadow-elegant relative before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-b before:from-black before:to-white before:-z-10">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
                <h3 className="text-xl font-bold mb-4 text-[#C41945]">Прозрачност</h3>
                <p className="text-gray-700 text-sm md:text-base">
                  Работим с пълна прозрачност и честност, защото вярваме, че това 
                  е основата на всяка успешна сделка и дългосрочни отношения.
                </p>
              </div>
              <div className="relative bg-white rounded-xl p-6 shadow-elegant relative before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-b before:from-black before:to-white before:-z-10">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
                <h3 className="text-xl font-bold mb-4 text-[#C41945]">Професионализъм</h3>
                <p className="text-gray-700 text-sm md:text-base">
                  Нашите експерти са висококвалифицирани професионалисти, които следят 
                  последните тенденции и подходи в бизнеса с недвижими имоти.
                </p>
              </div>
              <div className="relative bg-white rounded-xl p-6 shadow-elegant relative before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-b before:from-black before:to-white before:-z-10">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
                <h3 className="text-xl font-bold mb-4 text-[#C41945]">Клиентски фокус</h3>
                <p className="text-gray-700 text-sm md:text-base">
                  Ние поставяме нуждите на клиентите на първо място и се стремим да 
                  надминем очакванията им с всяка сделка.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team member detail dialog with contact information */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className={cn(
            "sm:max-w-4xl max-w-[95vw] max-h-[95vh] overflow-y-auto",
            "bg-white/20 backdrop-blur-md border border-white/10 shadow-xl",
            "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/20 before:to-transparent before:-z-10",
            "after:absolute after:inset-0 after:rounded-lg after:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_70%)] after:-z-10",
            "shadow-[0_0_25px_rgba(228,43,87,0.05)]",
            "animate-in fade-in zoom-in-95 duration-200"
          )}>
            {selectedMember && (
              <div className="relative z-10">
                <DialogHeader className="relative mb-6">
                  <div className="absolute -top-9 -left-8 h-24 w-24 bg-[#E42B57]/5 rounded-full blur-xl -z-10"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-shrink-0">
                      {selectedMember.image_url ? (
                        <div className="relative overflow-hidden rounded-xl border border-white/20 shadow-md group hover:shadow-[0_0_15px_rgba(228,43,87,0.1)] transition-all duration-300">
                          <img 
                            src={selectedMember.image_url} 
                            alt={selectedMember.name} 
                            className="h-32 w-32 sm:h-40 sm:w-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#E42B57]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ) : (
                        <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border border-white/20 shadow-md hover:shadow-[0_0_15px_rgba(228,43,87,0.1)] transition-all duration-300">
                          <AvatarFallback className="text-4xl">
                            {selectedMember.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <DialogTitle className="text-2xl sm:text-3xl font-bold text-black mb-2">{selectedMember.name}</DialogTitle>
                      <DialogDescription className="text-lg font-medium text-gray-800 mb-4">
                        <Badge variant="outline" className="bg-white/20 backdrop-blur-sm border border-white/30 text-gray-800 text-sm px-3 py-1">
                          {selectedMember.position}
                        </Badge>
                      </DialogDescription>
                      
                      {/* Social Media Links in header */}
                      {(selectedMember.facebook_url || selectedMember.instagram_url || selectedMember.tiktok_url) && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700">Социални мрежи:</span>
                          <div className="flex space-x-3">
                            {selectedMember.facebook_url && (
                              <a
                                href={selectedMember.facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-full transition-colors"
                                title="Facebook профил"
                              >
                                <Facebook className="h-5 w-5 text-blue-600" />
                              </a>
                            )}
                            {selectedMember.instagram_url && (
                              <a
                                href={selectedMember.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-pink-600/20 hover:bg-pink-600/30 rounded-full transition-colors"
                                title="Instagram профил"
                              >
                                <Instagram className="h-5 w-5 text-pink-600" />
                              </a>
                            )}
                            {selectedMember.tiktok_url && (
                              <a
                                href={selectedMember.tiktok_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-800/20 hover:bg-gray-800/30 rounded-full transition-colors"
                                title="TikTok профил"
                              >
                                <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Biography Section - Takes 2 columns on large screens */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-3 text-black flex items-center">
                      <User className="h-5 w-5 mr-2 text-[#E42B57]" />
                      За мен
                    </h3>
                    {selectedMember.bio ? (
                      <div className="bg-white/15 backdrop-blur-md p-6 rounded-lg border border-white/15 shadow-sm">
                        <div className="prose prose-gray max-w-none">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {selectedMember.bio}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/15 backdrop-blur-md p-6 rounded-lg border border-white/15 shadow-sm">
                        <p className="text-gray-600 italic text-center">
                          Няма налична информация.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Contact Information Section - Takes 1 column */}
                  <div className="lg:col-span-1">
                    <div className="relative">
                      <div className="absolute -bottom-4 right-0 h-24 w-24 bg-[#E42B57]/5 rounded-full blur-xl -z-10"></div>
                      <h3 className="text-lg font-semibold mb-3 text-black flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-[#E42B57]" />
                        Свържете се
                      </h3>
                      <div className="bg-white/15 backdrop-blur-md p-4 rounded-lg border border-white/15 shadow-sm space-y-4">
                        {(selectedMember.phone_number || selectedMember.email) ? (
                          <>
                            {selectedMember.phone_number && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Телефон:</p>
                                <div className="space-y-2">
                                  {/* Phone call button */}
                                  <a
                                    href={`tel:${formatPhoneForLink(selectedMember.phone_number)}`}
                                    className="flex items-center gap-2 w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/20 rounded-md text-sm hover:bg-white/30 transition-all shadow-sm hover:shadow-[0_0_8px_rgba(228,43,87,0.1)]"
                                    title="Обаждане"
                                  >
                                    <Phone className="h-4 w-4 text-[#E42B57]" />
                                    <span className="text-gray-800">{selectedMember.phone_number}</span>
                                  </a>
                                  
                                  {/* WhatsApp and Viber buttons */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <a
                                      href={`https://wa.me/${formatPhoneForLink(selectedMember.phone_number)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-center gap-1 px-2 py-2 bg-green-500/50 backdrop-blur-sm text-white rounded-md text-xs hover:bg-green-500/60 transition-all shadow-sm hover:shadow-[0_0_8px_rgba(74,222,128,0.2)]"
                                      title="WhatsApp"
                                    >
                                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                      </svg>
                                      <span>WhatsApp</span>
                                    </a>
                                    
                                    <a
                                      href={`viber://chat?number=${formatPhoneForLink(selectedMember.phone_number)}`}
                                      className="flex items-center justify-center gap-1 px-2 py-2 bg-purple-600/50 backdrop-blur-sm text-white rounded-md text-xs hover:bg-purple-600/60 transition-all shadow-sm hover:shadow-[0_0_8px_rgba(147,51,234,0.2)]"
                                      title="Viber"
                                    >
                                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.398.81C9.598.795 5.325 1.315 3.378 4.572c-1.176 2.048-1.125 4.672-1.143 6.448-.018 1.776-.143 5.41 3.316 6.367v1.447s-.022.586.366.703c.469.14.744-.298 1.192-.777.244-.263.58-.65.833-.943.229.02.463.035.7.048 2.392.127 4.215-.26 4.424-.329.477-.162 3.172-.5 3.612-4.072.456-3.681-.219-5.991-1.085-7.034h-.001c-.3-.276-.634-.528-1.004-.765C13.47 4.497 12.08 3.961 9.573 3.54a10.453 10.453 0 00-1.605-.153c-.93-.024-1.818-.016-2.648.07-.05-.056-.103-.114-.149-.158-.26-.247-.551-.4-.85-.468a1.36 1.36 0 00-.404-.03zm.03 1.498c.44-.01.881.007 1.332.05.452.042.93.12 1.436.226 3.108.646 4.615 1.681 5.423 2.397.808.716 1.41 1.825 1.026 4.785-.386 2.96-2.295 3.298-2.7 3.431-.172.056-1.744.365-3.684.28a13.33 13.33 0 01-.717-.043c-.707-.055-1.408-.147-1.994-.344-.384-.129-.732-.316-1.031-.605a.458.458 0 00-.327-.131.45.45 0 00-.324.146c-.025.029-.048.06-.069.086a90.974 90.974 0 00-1.267 1.625.459.459 0 01-.633.116.459.459 0 01-.18-.361v-1.76a.458.458 0 00-.463-.457c-2.88-.061-2.953-2.862-2.97-4.68-.016-1.817.063-3.962 1.087-5.746 1.683-2.629 5.325-2.857 6.055-2.866zm.146 1.631c.015 0 .027.009.03.023 0 .013-.004.025-.016.034-.089.063-.19.131-.277.199-.25.198-.51.431-.748.7a.432.432 0 01-.69-.052.418.418 0 01.05-.582c.183-.174.373-.338.56-.49.083-.067.164-.132.245-.194l.121-.088c.023-.014.04-.024.053-.032l.003-.002c0-.003.002-.003.004-.004h.002c.045-.025.154-.086.193-.086h.006a.59.59 0 01.464.574zm-3.524.5c.337.045.595.335.58.671-.017.338-.3.6-.638.587-1.186-.044-2.319.425-3.14 1.305-.82.88-1.2 2.044-1.052 3.224a.629.629 0 01-.524.701.627.627 0 01-.7-.525c-.189-1.517.305-3.05 1.356-4.19 1.047-1.14 2.539-1.753 4.105-1.769.005 0 .009-.004.013-.004zm7.201.26s.554.189.816.336c.113.062.182.137.209.243.083.31.239 1.177.07 2.422a.424.424 0 01-.834-.144c.14-1.019.012-1.726-.044-1.931-.019-.069-.037-.098-.058-.11-.212-.116-.67-.274-.758-.302a.425.425 0 01-.267-.534.427.427 0 01.53-.266c.022.003.042.01.064.019.001 0 .003 0 .004.001l.003.001.265.265zm-6.575.802c.347.015.613.31.598.655-.015.347-.308.612-.655.598-1.169-.051-2.04.846-2.088 1.992-.015.345-.309.61-.656.595a.626.626 0 01-.596-.655c.072-1.679 1.447-3.092 3.145-3.018.085.004.167.004.252.008zm-.533 1.611c.178.006.363.045.546.119.395.154.734.463.934.857.2.396.235.868.098 1.31-.104.335-.461.523-.796.42a.627.627 0 01-.422-.794c.032-.106.03-.189-.01-.289-.043-.102-.127-.19-.249-.237a.705.705 0 00-.272-.046.627.627 0 01-.634-.619.625.625 0 01.62-.631c.062-.5.123-.11.185-.09zm3.391.274a.625.625 0 01.613.639c-.15.921-.4 1.828-1.09 2.523-.682.684-1.613 1.052-2.695 1.04a.626.626 0 01-.619-.633.626.626 0 01.633-.619c.777.008 1.397-.229 1.851-.681.446-.444.716-1.078.725-1.766a.623.623 0 01.582-.503zm6.674 8.362a.19.19 0 110-.047.175.175 0 01-.11.15c-.41.149-1.337.454-1.75.448a.198.198 0 01-.14-.058.162.162 0 01-.046-.14c.002-.01.016-.088.08-.12.054-.026.13-.039.214-.059.085-.02.176-.047.259-.076a3.96 3.96 0 00.29-.115c.144-.063.27-.13.379-.19a1.303 1.303 0 00.198-.121.161.161 0 01.152-.013.179.179 0 01.1.115.147.147 0 01-.036.128c-.063.066-.158.112-.29.18a4.356 4.356 0 01-.328.164c.137-.037.293-.074.407-.089.101-.013.175-.009.21.022a.165.165 0 01.05.122.208.208 0 01-.19.138.172.172 0 01-.118.05c-.094.006-.235.017-.389.038a3.897 3.897 0 00-.45.074c.264.039.478.08.63.108.152.028.227.05.271.084.047.034.067.075.07.12a.176.176 0 01-.052.131.169.169 0 01-.13.055c-.162-.002-.396-.051-.619-.1-.223-.048-.433-.094-.56-.098-.019 0-.028.003-.047.005-.018.003-.047.008-.092.013-.09.01-.213.02-.356.023a4.167 4.167 0 01-.91-.087 2.54 2.54 0 01-.335-.91.168.168 0 01-.085-.148.194.194 0 01.075-.148.162.162 0 01.16-.016c.012.004.03.012.055.022a3.457 3.457 0 00.22.088c.1.038.218.078.348.11.26.065.563.108.87.102.038-.2.088-.2.155-.006a1.76 1.76 0 00-.255-.077 7.209 7.209 0 00-.43-.077 5.254 5.254 0 01-.22-.041.15.15 0 01-.098-.106.184.184 0 01.022-.155.172.172 0 01.141-.067c.185.012.419.055.639.098.22.043.424.088.573.095a.78.78 0 00-.024-.025 7.71 7.71 0 00-.218-.184 5.508 5.508 0 01-.355-.325.161.161 0 01-.045-.158.203.203 0 01.108-.112.161.161 0 01.157.014c.28.016.72.052.131.098.059.046.127.103.197.16.069.056.14.114.2.16.062.046.107.08.146.097a.161.161 0 01.083.131.201.201 0 01-.67.147c-.1.012-.29.023-.051.031.049 0 .102-.3.157-.007a.172.172 0 01.128.067z"/>
                                      </svg>
                                      <span>Viber</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {selectedMember.email && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Имейл:</p>
                                <a 
                                  href={`mailto:${selectedMember.email}`}
                                  className="flex items-center gap-2 w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/20 rounded-md text-sm hover:bg-white/30 transition-all shadow-sm hover:shadow-[0_0_8px_rgba(228,43,87,0.1)]"
                                >
                                  <Mail className="h-4 w-4 text-[#E42B57]" />
                                  <span className="text-gray-800 truncate">{selectedMember.email}</span>
                                </a>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-600 italic text-center py-4">
                            Няма налична контактна информация.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 pt-4 border-t border-white/10">
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    className="bg-white/20 hover:bg-white/30 border border-white/20 backdrop-blur-sm text-gray-800 transition-all hover:shadow-[0_0_8px_rgba(228,43,87,0.1)]"
                  >
                    Затвори
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
