
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  category: 'Market Analysis' | 'Tips & News' | 'Client Stories';
  author_id: string | null;
  published_at: string;
  created_at: string;
  updated_at: string | null;
}

export const useBlogPosts = (category?: string) => {
  return useQuery({
    queryKey: ['blog-posts', category],
    queryFn: async (): Promise<BlogPost[]> => {
      let query = supabase
        .from('imotidesk_blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blog posts:', error);
        throw new Error('Failed to fetch blog posts');
      }

      // Cast the data to BlogPost[] to ensure type compatibility
      return (data as unknown as BlogPost[]) || [];
    },
  });
};

export const useBlogPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async (): Promise<BlogPost> => {
      const { data, error } = await supabase
        .from('imotidesk_blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching blog post:', error);
        throw new Error('Failed to fetch blog post');
      }

      // Cast the data to BlogPost to ensure type compatibility
      return data as unknown as BlogPost;
    },
    enabled: !!slug,
  });
};
