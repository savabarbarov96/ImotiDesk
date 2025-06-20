import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useBlogPosts, BlogPost } from '@/hooks/use-blog-posts';
import { formatDate } from '@/utils/formatDate';
import { Skeleton } from '@/components/ui/skeleton';

// Updated BlogCard component to handle the BlogPost type
const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
      <Link to={`/news/${post.slug}`}>
        <img 
          src={post.image_url || '/placeholder-blog.jpg'} 
          alt={post.title} 
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center text-sm text-neutral mb-2">
          <span>{formatDate(post.published_at)}</span>
          {post.category && (
            <>
              <span className="mx-2">•</span>
              <span className="text-primary">{
                post.category === 'Market Analysis' ? 'Пазарен анализ' :
                post.category === 'Tips & News' ? 'Съвети и новини' :
                post.category === 'Client Stories' ? 'Истории на клиенти' :
                post.category
              }</span>
            </>
          )}
        </div>
        <Link to={`/news/${post.slug}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-neutral-dark mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
        <Link 
          to={`/news/${post.slug}`} 
          className="text-primary font-medium hover:underline mt-auto inline-block"
        >
          Прочети повече
        </Link>
      </div>
    </div>
  );
};

// Loading skeleton for blog cards
const BlogCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
    <Skeleton className="w-full h-48" />
    <div className="p-5 flex-grow flex flex-col">
      <Skeleton className="h-4 w-1/3 mb-2" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-1/4 mt-auto" />
    </div>
  </div>
);

const BlogPreview = () => {
  const { data: posts, isLoading, error } = useBlogPosts();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#E42B57]">Последни статии</h2>
            <p className="text-lg text-neutral">Полезни съвети и новини от света на недвижимите имоти</p>
          </div>
          <Link to="/news">
            <Button variant="outline" className="mt-4 md:mt-0">
              Към новините
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </>
          ) : error ? (
            <div className="col-span-3 text-center p-8">
              <p className="text-destructive">Грешка при зареждане на статиите.</p>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-3 text-center p-8">
              <p className="text-muted-foreground">Няма налични статии.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
