import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useBlogPostBySlug } from '@/hooks/use-blog-posts';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { formatDate } from '@/utils/formatDate';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ReactMarkdown from 'react-markdown';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { trackBlogView } from '@/hooks/use-analytics';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPostBySlug(slug || '');
  const [viewTracked, setViewTracked] = useState(false);
  
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Automation Aid Новини`;
    }
    window.scrollTo(0, 0);
  }, [post]);

  // Track blog post view
  useEffect(() => {
    const recordView = async () => {
      if (post?.id && !viewTracked && !isLoading) {
        try {
          await trackBlogView(post.id);
          setViewTracked(true);
        } catch (error) {
          console.error('Error tracking blog view:', error);
        }
      }
    };

    recordView();
  }, [post, viewTracked, isLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8">
          <Link to="/news">
            <Button variant="ghost" className="pl-0 flex items-center text-neutral-dark hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад към всички статии
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-16">Зареждане...</div>
        ) : error || !post ? (
          <div className="text-center py-16">
            <TextShimmer 
              as="h1"
              className="text-2xl font-bold mb-4"
              duration={3}
            >
              Статията не беше намерена
            </TextShimmer>
            <p>Съжаляваме, но търсената от вас статия не съществува или е преместена.</p>
            <Link to="/news" className="mt-4 inline-block text-primary hover:underline">
              Разгледайте всички статии
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-block bg-primary text-white px-3 py-1 rounded-lg text-sm">
                {post.category}
              </span>
            </div>
            
            <TextShimmer 
              as="h1"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              duration={3}
            >
              {post.title}
            </TextShimmer>
            
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div className="flex items-center text-neutral">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              
              <ShareButtons url={`/news/${post.slug}`} title={post.title} />
            </div>

            {post.image_url && (
              <div className="mb-8 overflow-hidden rounded-lg">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            )}
            
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>
                {post.content}
              </ReactMarkdown>
            </div>
            
            <div className="mt-12 pt-8 border-t">
              <ShareButtons url={`/news/${post.slug}`} title={post.title} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
