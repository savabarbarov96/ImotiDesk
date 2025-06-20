import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils/formatDate';
import { BlogPost } from '@/hooks/use-blog-posts';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { motion } from 'framer-motion';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative h-full"
    >
      <Card className="relative h-full flex flex-col glass-card backdrop-blur-sm border-0 shadow-floating hover:shadow-xl transition-all duration-500 overflow-hidden group">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        
        {/* Image Section */}
        <Link to={`/news/${post.slug}`} className="block relative overflow-hidden">
          <div className="relative w-full h-52 overflow-hidden">
            <motion.img 
              src={post.image_url || '/placeholder.svg'} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Category Badge */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
            >
              {post.category}
            </motion.div>
          </div>
        </Link>
        
        {/* Content Section */}
        <CardContent className="flex-grow flex flex-col p-6 relative">
          {/* Date */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center text-sm text-muted-foreground mb-3"
          >
            <Calendar className="h-4 w-4 mr-2 text-primary/70" />
            <span>{formatDate(post.published_at)}</span>
          </motion.div>
          
          {/* Title */}
          <Link to={`/news/${post.slug}`}>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold mb-3 hover:text-primary transition-colors duration-300 line-clamp-2 group-hover:text-primary"
            >
              {post.title}
            </motion.h3>
          </Link>
          
          {/* Excerpt */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mb-6 line-clamp-3 flex-grow leading-relaxed"
          >
            {post.excerpt}
          </motion.p>
          
          {/* Read More Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-auto"
          >
            <Link 
              to={`/news/${post.slug}`} 
              className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-all duration-300 group-hover:translate-x-1"
            >
              Прочети повече
              <motion.svg 
                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </Link>
          </motion.div>
        </CardContent>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"></div>
      </Card>
    </motion.div>
  );
};

export default BlogPostCard;
