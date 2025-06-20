import React from 'react';
import { Helmet } from 'react-helmet';
import { useBlogPosts } from '@/hooks/use-blog-posts';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/formatDate';

const BlogIndexPage = () => {
  const { data: posts, isLoading, error } = useBlogPosts();
  const [tabValue, setTabValue] = React.useState("all");
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  const categories = [
    { value: "all", label: "Всички" },
    { value: "Market Analysis", label: "Пазарни анализи" },
    { value: "Tips & News", label: "Съвети и новини" },
    { value: "Client Stories", label: "Истории на клиенти" },
  ];

  const filteredPosts = tabValue === 'all' ? 
    posts : 
    posts?.filter(post => post.category === tabValue);

  // Get the latest post for featured section (most recent by published_at)
  const latestPost = posts && posts.length > 0 ? posts[0] : null;

  // Scroll to top functionality
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <Helmet>
        <title>Новини | Automation Aid</title>
        <meta name="description" content="Статии, новини и съвети за недвижими имоти от експертите на Automation Aid." />
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto py-12 px-4 relative z-10">
        {/* Modern Hero Section with Featured Post */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <TextShimmer 
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text"
              duration={3}
            >
              Нашите новини
            </TextShimmer>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Споделяме експертни съвети, пазарни анализи и статии от света на недвижимите имоти.
            </motion.p>
          </div>

          {/* Featured Post Section */}
          {latestPost && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-red-50/30"></div>

                <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-12 min-h-[500px]">
                  {/* Content Side */}
                  <div className="flex flex-col justify-center space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                        Най-нова статия
                      </span>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight"
                    >
                      {latestPost.title}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="text-lg text-gray-600 leading-relaxed"
                    >
                      {latestPost.excerpt}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="flex items-center space-x-4 text-gray-500"
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(latestPost.published_at)}</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                        {latestPost.category}
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                    >
                      <Link
                        to={`/news/${latestPost.slug}`}
                        className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                      >
                        <span>Прочети повече</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Image Side */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="relative flex items-center justify-center"
                  >
                    <div className="relative w-full">
                      <img 
                        src={latestPost.image_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80"}
                        alt={latestPost.title}
                        className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                      />
                      
                      {/* Subtle overlay for better text readability if needed */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-2xl"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <Tabs defaultValue="all" onValueChange={setTabValue} className="w-full">
            <div className="flex justify-center mb-8">
              <div className="glass-card p-2 rounded-2xl backdrop-blur-sm">
                <TabsList className="bg-transparent border-0 gap-2">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.value}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <TabsTrigger
                        value={category.value}
                        className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg 
                                 bg-white/70 hover:bg-white/90 transition-all duration-300 rounded-xl px-6 py-3
                                 hover:scale-105 hover:shadow-md"
                      >
                        {category.label}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </div>
            </div>
            
            {categories.map((category) => (
              <TabsContent 
                key={category.value} 
                value={category.value}
                className="mt-0"
              />
            ))}
          </Tabs>
        </motion.div>
        
        {/* Content Area */}
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-16"
          >
            <div className="glass-card rounded-3xl backdrop-blur-sm p-12">
              <div className="animate-spin w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">Зареждане на статии...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-16"
          >
            <div className="glass-card rounded-3xl backdrop-blur-sm p-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-destructive text-lg mb-6">Възникна грешка при зареждането на статиите.</p>
              <Button 
                variant="outline" 
                className="hover:scale-105 transition-transform duration-200" 
                onClick={() => window.location.reload()}
              >
                Опитайте отново
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Section Title for Other Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Всички статии</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Разгледайте нашата колекция от експертни статии и анализи
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts?.slice(1).map((post, index) => (
                <motion.div 
                  key={post.id} 
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <BlogPostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
        
        {filteredPosts && filteredPosts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-16"
          >
            <div className="glass-card rounded-3xl backdrop-blur-sm p-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-muted-foreground text-lg">Няма намерени статии в тази категория.</p>
            </div>
          </motion.div>
        )}
        
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default BlogIndexPage;
