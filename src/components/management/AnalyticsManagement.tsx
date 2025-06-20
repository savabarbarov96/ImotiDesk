import React, { useState } from 'react';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart2, PieChart as PieChartIcon, ListFilter, Calendar, ArrowUpRight, Eye } from 'lucide-react';
import { AnalyticsTimeRange, usePropertyAnalytics, useBlogAnalytics } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#FF6B6B'];

const AnalyticsManagement = () => {
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('month');
  const [viewType, setViewType] = useState<'table' | 'bar' | 'pie'>('table');

  // Tabs
  const [activeTab, setActiveTab] = useState<'properties' | 'blog'>('properties');

  // Fetch analytics data with selected time range
  const { 
    data: propertyData, 
    isLoading: propertiesLoading, 
    error: propertiesError 
  } = usePropertyAnalytics(timeRange);
  
  const { 
    data: blogData, 
    isLoading: blogLoading, 
    error: blogError 
  } = useBlogAnalytics(timeRange);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Няма данни';
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: bg });
  };

  // Helper for rendering the correct view (table, chart)
  const renderPropertyDataView = () => {
    if (propertiesLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-12" />
          ))}
        </div>
      );
    }

    if (propertiesError || !propertyData) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Възникна грешка при зареждане на данните.
        </div>
      );
    }

    if (propertyData.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Няма налични данни за избрания период.
        </div>
      );
    }

    // Table view
    if (viewType === 'table') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имот</TableHead>
              <TableHead className="text-right">Брой преглеждания</TableHead>
              <TableHead className="text-right">Последно преглеждан</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propertyData.map((property) => (
              <TableRow key={property.property_id}>
                <TableCell className="font-medium">{property.property_title}</TableCell>
                <TableCell className="text-right">{property.view_count}</TableCell>
                <TableCell className="text-right">{formatDate(property.last_viewed_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    // Bar chart
    if (viewType === 'bar') {
      const chartData = propertyData
        .slice(0, 10) // Limit to top 10 for visibility
        .map((property) => ({
          name: property.property_title.length > 20 
            ? property.property_title.substring(0, 20) + '...' 
            : property.property_title,
          преглеждания: property.view_count
        }));

      return (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} преглеждания`, 'Брой']}
                labelFormatter={(label) => `Имот: ${label}`}
              />
              <Legend />
              <Bar dataKey="преглеждания" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Pie chart
    if (viewType === 'pie') {
      const chartData = propertyData
        .slice(0, 6) // Limit to top 6 for visibility in pie chart
        .map((property) => ({
          name: property.property_title.length > 20 
            ? property.property_title.substring(0, 20) + '...' 
            : property.property_title,
          value: property.view_count
        }));

      return (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} преглеждания`, 'Брой']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  // Helper for rendering the correct view (table, chart) for blog data
  const renderBlogDataView = () => {
    if (blogLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-12" />
          ))}
        </div>
      );
    }

    if (blogError || !blogData) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Възникна грешка при зареждане на данните.
        </div>
      );
    }

    if (blogData.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Няма налични данни за избрания период.
        </div>
      );
    }

    // Table view
    if (viewType === 'table') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Блог статия</TableHead>
              <TableHead className="text-right">Брой преглеждания</TableHead>
              <TableHead className="text-right">Последно преглеждана</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogData.map((post) => (
              <TableRow key={post.blog_post_id}>
                <TableCell className="font-medium">{post.blog_title}</TableCell>
                <TableCell className="text-right">{post.view_count}</TableCell>
                <TableCell className="text-right">{formatDate(post.last_viewed_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    // Bar chart
    if (viewType === 'bar') {
      const chartData = blogData
        .slice(0, 10) // Limit to top 10 for visibility
        .map((post) => ({
          name: post.blog_title.length > 20 
            ? post.blog_title.substring(0, 20) + '...' 
            : post.blog_title,
          преглеждания: post.view_count
        }));

      return (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} преглеждания`, 'Брой']}
                labelFormatter={(label) => `Статия: ${label}`}
              />
              <Legend />
              <Bar dataKey="преглеждания" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Pie chart
    if (viewType === 'pie') {
      const chartData = blogData
        .slice(0, 6) // Limit to top 6 for visibility in pie chart
        .map((post) => ({
          name: post.blog_title.length > 20 
            ? post.blog_title.substring(0, 20) + '...' 
            : post.blog_title,
          value: post.view_count
        }));

      return (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} преглеждания`, 'Брой']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  // Stats cards
  const PropertyStats = () => {
    const totalViews = propertyData?.reduce((sum, item) => sum + item.view_count, 0) || 0;
    const topProperty = propertyData?.[0];
    
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общо преглеждания</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange === 'all' ? 'За цялото време' : timeRange === 'today' ? 'Днес' : 
               timeRange === 'week' ? 'Тази седмица' : 
               timeRange === 'month' ? 'Този месец' : 'Тази година'}
            </p>
          </CardContent>
        </Card>
        {topProperty && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Най-преглеждан имот</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate" title={topProperty.property_title}>
                {topProperty.property_title.length > 25 
                  ? topProperty.property_title.substring(0, 25) + '...' 
                  : topProperty.property_title}
              </div>
              <p className="text-xs text-muted-foreground">{topProperty.view_count} преглеждания</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активни имоти с преглеждания</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertyData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">От всички имоти</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const BlogStats = () => {
    const totalViews = blogData?.reduce((sum, item) => sum + item.view_count, 0) || 0;
    const topBlog = blogData?.[0];
    
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общо преглеждания</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange === 'all' ? 'За цялото време' : timeRange === 'today' ? 'Днес' : 
               timeRange === 'week' ? 'Тази седмица' : 
               timeRange === 'month' ? 'Този месец' : 'Тази година'}
            </p>
          </CardContent>
        </Card>
        {topBlog && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Най-преглеждана статия</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate" title={topBlog.blog_title}>
                {topBlog.blog_title.length > 25 
                  ? topBlog.blog_title.substring(0, 25) + '...' 
                  : topBlog.blog_title}
              </div>
              <p className="text-xs text-muted-foreground">{topBlog.view_count} преглеждания</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активни статии с преглеждания</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">От всички блог статии</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Аналитични данни</CardTitle>
            <CardDescription>
              Проследявайте преглежданията на вашите имоти и блог статии
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="properties">Имоти</TabsTrigger>
                  <TabsTrigger value="blog">Блог</TabsTrigger>
                </TabsList>
                <TabsContent value="properties" className="space-y-6">
                  <PropertyStats />
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <ListFilter className="h-4 w-4" />
                      <Select
                        value={timeRange}
                        onValueChange={(value) => setTimeRange(value as AnalyticsTimeRange)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Филтър по време" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Всичко</SelectItem>
                          <SelectItem value="today">Днес</SelectItem>
                          <SelectItem value="week">Последните 7 дни</SelectItem>
                          <SelectItem value="month">Последния месец</SelectItem>
                          <SelectItem value="year">Последната година</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Изглед:</span>
                      <div className="flex border rounded-md overflow-hidden">
                        <button
                          onClick={() => setViewType('table')}
                          className={`px-3 py-1.5 text-xs ${
                            viewType === 'table' ? 'bg-primary text-primary-foreground' : 'bg-background'
                          }`}
                        >
                          Таблица
                        </button>
                        <button
                          onClick={() => setViewType('bar')}
                          className={`px-3 py-1.5 text-xs ${
                            viewType === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-background'
                          }`}
                        >
                          <BarChart2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewType('pie')}
                          className={`px-3 py-1.5 text-xs ${
                            viewType === 'pie' ? 'bg-primary text-primary-foreground' : 'bg-background'
                          }`}
                        >
                          <PieChartIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border">
                    {renderPropertyDataView()}
                  </div>
                </TabsContent>
                <TabsContent value="blog" className="space-y-6">
                  <BlogStats />
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <ListFilter className="h-4 w-4" />
                      <Select
                        value={timeRange}
                        onValueChange={(value) => setTimeRange(value as AnalyticsTimeRange)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Филтър по време" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Всичко</SelectItem>
                          <SelectItem value="today">Днес</SelectItem>
                          <SelectItem value="week">Последните 7 дни</SelectItem>
                          <SelectItem value="month">Последния месец</SelectItem>
                          <SelectItem value="year">Последната година</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Изглед:</span>
                      <div className="flex border rounded-md overflow-hidden">
                        <button
                          onClick={() => setViewType('table')}
                          className={`px-3 py-1.5 text-xs ${
                            viewType === 'table' ? 'bg-primary text-primary-foreground' : 'bg-background'
                          }`}
                        >
                          Таблица
                        </button>
                        <button
                          onClick={() => setViewType('bar')}
                          className={`px-3 py-1.5 text-xs ${
                            viewType === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-background'
                          }`}
                        >
                          <BarChart2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewType('pie')}
                          className={`px-3 py-1.5 text-xs ${
                            viewType === 'pie' ? 'bg-primary text-primary-foreground' : 'bg-background'
                          }`}
                        >
                          <PieChartIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border">
                    {renderBlogDataView()}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsManagement; 