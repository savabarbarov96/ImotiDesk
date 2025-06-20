import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Analytics data with time ranges for date filtering
export type AnalyticsTimeRange = 'all' | 'today' | 'week' | 'month' | 'year';

export interface PropertyViewCount {
  property_id: string;
  property_title: string;
  view_count: number;
  last_viewed_at: string | null;
}

export interface BlogViewCount {
  blog_post_id: string;
  blog_title: string;
  view_count: number;
  last_viewed_at: string | null;
}

// Analytics data for properties
export const usePropertyAnalytics = (timeRange: AnalyticsTimeRange = 'all') => {
  return useQuery({
    queryKey: ['propertyAnalytics', timeRange],
    queryFn: async () => {
      // If we want to see all-time data
      if (timeRange === 'all') {
        const { data, error } = await supabase
          .from('imotidesk_property_views_count')
          .select('*')
          .order('view_count', { ascending: false });

        if (error) throw error;
        return data as PropertyViewCount[];
      } 
      
      // For filtered data, we'll fetch all views and filter them in JavaScript
      // This approach avoids complex SQL that's causing type errors
      const { data: properties, error: propError } = await supabase
        .from('imotidesk_properties')
        .select('id, title');
      
      if (propError) throw propError;
      
      // Get all property views
      const { data: views, error: viewsError } = await supabase
        .from('imotidesk_property_views')
        .select('property_id, viewed_at');
        
      if (viewsError) throw viewsError;
      
      // Filter views based on time range
      const filteredViews = views.filter(view => {
        const viewDate = new Date(view.viewed_at);
        const now = new Date();
        
        switch (timeRange) {
          case 'today':
            return viewDate.toDateString() === now.toDateString();
          case 'week': {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return viewDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            return viewDate >= monthAgo;
          }
          case 'year': {
            const yearAgo = new Date();
            yearAgo.setFullYear(now.getFullYear() - 1);
            return viewDate >= yearAgo;
          }
          default:
            return true;
        }
      });
      
      // Create a map of property_id -> view_count
      const viewCounts = filteredViews.reduce((acc, view) => {
        acc[view.property_id] = (acc[view.property_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Create a map of property_id -> last_viewed_at
      const lastViewedMap = filteredViews.reduce((acc, view) => {
        const currentLastViewed = acc[view.property_id];
        if (!currentLastViewed || new Date(view.viewed_at) > new Date(currentLastViewed)) {
          acc[view.property_id] = view.viewed_at;
        }
        return acc;
      }, {} as Record<string, string>);
      
      // Transform the data to match PropertyViewCount structure
      const result = properties.map(property => ({
        property_id: property.id,
        property_title: property.title,
        view_count: viewCounts[property.id] || 0,
        last_viewed_at: lastViewedMap[property.id] || null
      }));
      
      // Sort by view count descending
      return result.sort((a, b) => b.view_count - a.view_count) as PropertyViewCount[];
    },
  });
};

// Analytics data for blog posts
export const useBlogAnalytics = (timeRange: AnalyticsTimeRange = 'all') => {
  return useQuery({
    queryKey: ['blogAnalytics', timeRange],
    queryFn: async () => {
      // If we want to see all-time data
      if (timeRange === 'all') {
        const { data, error } = await supabase
          .from('imotidesk_blog_views_count')
          .select('*')
          .order('view_count', { ascending: false });

        if (error) throw error;
        return data as BlogViewCount[];
      }
      
      // For filtered data, we'll fetch all views and filter them in JavaScript
      // This approach avoids complex SQL that's causing type errors
      const { data: posts, error: postsError } = await supabase
        .from('imotidesk_blog_posts')
        .select('id, title');
      
      if (postsError) throw postsError;
      
      // Get all blog views
      const { data: views, error: viewsError } = await supabase
        .from('imotidesk_blog_views')
        .select('blog_post_id, viewed_at');
        
      if (viewsError) throw viewsError;
      
      // Filter views based on time range
      const filteredViews = views.filter(view => {
        const viewDate = new Date(view.viewed_at);
        const now = new Date();
        
        switch (timeRange) {
          case 'today':
            return viewDate.toDateString() === now.toDateString();
          case 'week': {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return viewDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            return viewDate >= monthAgo;
          }
          case 'year': {
            const yearAgo = new Date();
            yearAgo.setFullYear(now.getFullYear() - 1);
            return viewDate >= yearAgo;
          }
          default:
            return true;
        }
      });
      
      // Create a map of blog_post_id -> view_count
      const viewCounts = filteredViews.reduce((acc, view) => {
        acc[view.blog_post_id] = (acc[view.blog_post_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Create a map of blog_post_id -> last_viewed_at
      const lastViewedMap = filteredViews.reduce((acc, view) => {
        const currentLastViewed = acc[view.blog_post_id];
        if (!currentLastViewed || new Date(view.viewed_at) > new Date(currentLastViewed)) {
          acc[view.blog_post_id] = view.viewed_at;
        }
        return acc;
      }, {} as Record<string, string>);
      
      // Transform the data to match BlogViewCount structure
      const result = posts.map(post => ({
        blog_post_id: post.id,
        blog_title: post.title,
        view_count: viewCounts[post.id] || 0,
        last_viewed_at: lastViewedMap[post.id] || null
      }));
      
      // Sort by view count descending
      return result.sort((a, b) => b.view_count - a.view_count) as BlogViewCount[];
    },
  });
};

// Function to track a property view
export const trackPropertyView = async (propertyId: string) => {
  try {
    const { error } = await supabase
      .from('imotidesk_property_views')
      .insert({
        property_id: propertyId,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error tracking property view:', error);
    return false;
  }
};

// Function to track a blog post view
export const trackBlogView = async (blogPostId: string) => {
  try {
    const { error } = await supabase
      .from('imotidesk_blog_views')
      .insert({
        blog_post_id: blogPostId,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error tracking blog view:', error);
    return false;
  }
}; 