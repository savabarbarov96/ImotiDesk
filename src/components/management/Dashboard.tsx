import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Building, 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  Eye, 
  Users, 
  Calendar,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  LayoutDashboard,
  Home
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  onSectionChange?: (section: string) => void;
}

interface DashboardStats {
  totalProperties: number;
  totalValue: number;
  publishedProperties: number;
  totalInquiries: number;
  monthlyInquiries: number;
  totalBlogPosts: number;
  totalPropertyViews: number;
  totalBlogViews: number;
  recentProperties: any[];
  recentInquiries: any[];
  propertyViewsData: any[];
  inquiriesData: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ onSectionChange }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalValue: 0,
    publishedProperties: 0,
    totalInquiries: 0,
    monthlyInquiries: 0,
    totalBlogPosts: 0,
    totalPropertyViews: 0,
    totalBlogViews: 0,
    recentProperties: [],
    recentInquiries: [],
    propertyViewsData: [],
    inquiriesData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch basic property stats
      const { data: propertyStats } = await supabase
        .from('imotidesk_properties')
        .select('price, is_published, created_at, title, city, property_type')
        .order('created_at', { ascending: false });

      // Fetch inquiries
      const { data: inquiries } = await supabase
        .from('inquiries')
        .select('*, properties(title)')
        .order('created_at', { ascending: false });

      // Fetch blog posts
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch property views
      const { data: propertyViews } = await supabase
        .from('property_views')
        .select('viewed_at, property_id')
        .order('viewed_at', { ascending: false });

      // Fetch blog views
      const { data: blogViews } = await supabase
        .from('blog_views')
        .select('viewed_at')
        .order('viewed_at', { ascending: false });

      // Calculate stats
      const totalProperties = propertyStats?.length || 0;
      const publishedProperties = propertyStats?.filter(p => p.is_published).length || 0;
      const totalValue = propertyStats?.filter(p => p.is_published).reduce((sum, p) => sum + Number(p.price), 0) || 0;
      
      const totalInquiries = inquiries?.length || 0;
      const monthlyInquiries = inquiries?.filter(i => 
        new Date(i.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length || 0;

      // Prepare chart data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const propertyViewsData = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('bg-BG', { month: 'short', day: 'numeric' }),
        views: propertyViews?.filter(v => v.viewed_at.startsWith(date)).length || 0
      }));

      const inquiriesData = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('bg-BG', { month: 'short', day: 'numeric' }),
        inquiries: inquiries?.filter(i => i.created_at.startsWith(date)).length || 0
      }));

      setStats({
        totalProperties,
        totalValue,
        publishedProperties,
        totalInquiries,
        monthlyInquiries,
        totalBlogPosts: blogPosts?.length || 0,
        totalPropertyViews: propertyViews?.length || 0,
        totalBlogViews: blogViews?.length || 0,
        recentProperties: propertyStats?.slice(0, 5) || [],
        recentInquiries: inquiries?.slice(0, 5) || [],
        propertyViewsData,
        inquiriesData
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ title, value, description, icon: Icon, trend, trendValue, color = "blue" }: any) => {
    const getIconColor = (color: string) => {
      switch (color) {
        case 'blue': return 'text-blue-600';
        case 'green': return 'text-green-600';
        case 'orange': return 'text-orange-600';
        case 'purple': return 'text-purple-600';
        default: return 'text-blue-600';
      }
    };

    const getIconBgColor = (color: string) => {
      switch (color) {
        case 'blue': return 'bg-blue-100';
        case 'green': return 'bg-green-100';
        case 'orange': return 'bg-orange-100';
        case 'purple': return 'bg-purple-100';
        default: return 'bg-blue-100';
      }
    };

    const getGradientColor = (color: string) => {
      switch (color) {
        case 'blue': return 'bg-gradient-to-r from-blue-500 to-blue-600';
        case 'green': return 'bg-gradient-to-r from-green-500 to-green-600';
        case 'orange': return 'bg-gradient-to-r from-orange-500 to-orange-600';
        case 'purple': return 'bg-gradient-to-r from-purple-500 to-purple-600';
        default: return 'bg-gradient-to-r from-blue-500 to-blue-600';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${getIconBgColor(color)}`}>
            <Icon className={`h-5 w-5 ${getIconColor(color)}`} />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{description}</span>
            {trend && (
              <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
        </CardContent>
        <div className={`absolute bottom-0 left-0 w-full h-1 ${getGradientColor(color)}`} />
      </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-gray-50"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent opacity-60 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-50 to-transparent opacity-40 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Добре дошли в управлението
              </h1>
              <p className="text-gray-600 text-lg">
                Преглед на ключовите показатели и дейности
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Системата е активна
                </div>
                <div className="text-sm text-gray-500">
                  Последно обновяване: {new Date().toLocaleDateString('bg-BG')}
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{new Date().getDate()}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  {new Date().toLocaleDateString('bg-BG', { month: 'short' })}
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Общо имоти"
          value={stats.totalProperties}
          description={`${stats.publishedProperties} публикувани`}
          icon={Building}
          color="blue"
        />
        <StatCard
          title="Обща стойност"
          value={formatCurrency(stats.totalValue)}
          description="Публикувани имоти"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Запитвания"
          value={stats.totalInquiries}
          description={`${stats.monthlyInquiries} този месец`}
          icon={MessageSquare}
          color="orange"
        />
        <StatCard
          title="Новини"
          value={stats.totalBlogPosts}
          description="Общо публикувани"
          icon={FileText}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Прегледи на имоти
              </CardTitle>
              <CardDescription>Последните 7 дни</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.propertyViewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Запитвания
              </CardTitle>
              <CardDescription>Последните 7 дни</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.inquiriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inquiries" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Последни имоти
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSectionChange?.('properties')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Добави
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.recentProperties.length > 0 ? (
                stats.recentProperties.map((property, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{property.title}</p>
                      <p className="text-xs text-muted-foreground">{property.city} • {property.property_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatCurrency(property.price)}</p>
                      <Badge variant={property.is_published ? "default" : "secondary"} className="text-xs">
                        {property.is_published ? "Публикуван" : "Чернова"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Няма имоти</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Последни запитвания
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/management/property-inquiries'}
                  >
                    Запитвания имоти
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/management/sales-inquiries'}
                  >
                    Заявки за продажба
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.recentInquiries.length > 0 ? (
                stats.recentInquiries.map((inquiry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{inquiry.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {inquiry.properties?.title || 'Общо запитване'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(inquiry.created_at).toLocaleDateString('bg-BG')}
                      </p>
                      <Badge variant={inquiry.responded ? "default" : "destructive"} className="text-xs">
                        {inquiry.responded ? "Отговорено" : "Чака"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Няма запитвания</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Бързи действия</CardTitle>
            <CardDescription>Често използвани функции</CardDescription>
          </CardHeader>
          <CardContent>
                       <div className="grid gap-3 md:grid-cols-6">
             <Button 
               variant="outline" 
               className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
               onClick={() => onSectionChange?.('properties')}
             >
               <Building className="h-6 w-6" />
               <span className="text-xs">Нов имот</span>
             </Button>
             <Button 
               variant="outline" 
               className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-200 transition-colors"
               onClick={() => onSectionChange?.('blog')}
             >
               <FileText className="h-6 w-6" />
               <span className="text-xs">Нова новина</span>
             </Button>
             <Button 
               variant="outline" 
               className="h-20 flex-col gap-2 hover:bg-yellow-50 hover:border-yellow-200 transition-colors"
               onClick={() => window.location.href = '/management/property-inquiries'}
             >
               <MessageSquare className="h-6 w-6" />
               <span className="text-xs">Запитвания</span>
             </Button>
             <Button 
               variant="outline" 
               className="h-20 flex-col gap-2 hover:bg-red-50 hover:border-red-200 transition-colors"
               onClick={() => window.location.href = '/management/sales-inquiries'}
             >
               <Home className="h-6 w-6" />
               <span className="text-xs">Продажби</span>
             </Button>
             <Button 
               variant="outline" 
               className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200 transition-colors"
               onClick={() => onSectionChange?.('team')}
             >
               <Users className="h-6 w-6" />
               <span className="text-xs">Екип</span>
             </Button>
             <Button 
               variant="outline" 
               className="h-20 flex-col gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
               onClick={() => onSectionChange?.('analytics')}
             >
               <Activity className="h-6 w-6" />
               <span className="text-xs">Аналитика</span>
             </Button>
           </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard; 