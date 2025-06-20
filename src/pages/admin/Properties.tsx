import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Loader2, 
  Check,
  X,
  Star,
  StarOff
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  city: string;
  property_type: string;
  listing_type: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
}

const Properties: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  
  const queryClient = useQueryClient();

  // Fetch properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('imotidesk_properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Грешка при зареждане на имоти",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data as Property[];
    },
  });

  // Toggle property publication status
  const togglePropertyPublished = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from('imotidesk_properties')
        .update({ is_published: isPublished })
        .eq('id', id);
      
      if (error) throw error;
      return { id, isPublished };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({
        title: data.isPublished ? "Имотът е публикуван" : "Имотът е скрит",
        description: data.isPublished 
          ? "Имотът вече е видим в публичния сайт" 
          : "Имотът вече не е видим в публичния сайт",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Грешка при обновяване на статуса",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Toggle property featured status
  const togglePropertyFeatured = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const { error } = await supabase
        .from('imotidesk_properties')
        .update({ is_featured: isFeatured })
        .eq('id', id);
      
      if (error) throw error;
      return { id, isFeatured };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({
        title: data.isFeatured ? "Имотът е отбелязан като препоръчан" : "Имотът е премахнат от препоръчаните",
        description: data.isFeatured 
          ? "Имотът ще се показва в секцията с препоръчани имоти" 
          : "Имотът вече няма да се показва в секцията с препоръчани имоти",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Грешка при обновяване на статуса",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bg-BG', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = search.trim() === '' || 
      property.title.toLowerCase().includes(search.toLowerCase()) || 
      property.address.toLowerCase().includes(search.toLowerCase()) ||
      property.city.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = !filterType || filterType === 'all' || property.property_type === filterType;
    const matchesStatus = !filterStatus || filterStatus === 'all' || 
      (filterStatus === 'published' && property.is_published) ||
      (filterStatus === 'unpublished' && !property.is_published) ||
      (filterStatus === 'featured' && property.is_featured);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>
      <Helmet>
        <title>Управление на имоти | Automation Aid Админ</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Управление на имоти</h1>
          <p className="text-muted-foreground">Преглед и редакция на имоти</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Търсене по име или адрес..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType || 'all'} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{filterType || 'Всички типове'}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички типове</SelectItem>
            <SelectItem value="apartment">Апартамент</SelectItem>
            <SelectItem value="house">Къща</SelectItem>
            <SelectItem value="office">Офис</SelectItem>
            <SelectItem value="land">Парцел</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus || 'all'} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{
                filterStatus === 'published' ? 'Публикувани' : 
                filterStatus === 'unpublished' ? 'Непубликувани' : 
                filterStatus === 'featured' ? 'Препоръчани' : 
                'Всички статуси'
              }</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички статуси</SelectItem>
            <SelectItem value="published">Публикувани</SelectItem>
            <SelectItem value="unpublished">Непубликувани</SelectItem>
            <SelectItem value="featured">Препоръчани</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имот</TableHead>
              <TableHead>Адрес</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-[150px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
                    <span>Зареждане на имоти...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Няма намерени имоти
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{property.title}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {property.property_type} - {property.listing_type}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{property.address}</div>
                      <div className="text-sm text-muted-foreground">{property.city}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(property.price)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${property.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {property.is_published ? 'Публикуван' : 'Непубликуван'}
                      </div>
                      {property.is_featured && (
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                          bg-amber-100 text-amber-800"
                        >
                          Препоръчан
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={`/properties/${property.id}`} target="_blank">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>Преглед</span>
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {}}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Редактирай</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => togglePropertyPublished.mutate({ 
                              id: property.id, 
                              isPublished: !property.is_published 
                            })}
                          >
                            {property.is_published ? (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                <span>Скрий имота</span>
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                <span>Публикувай имота</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => togglePropertyFeatured.mutate({ 
                              id: property.id, 
                              isFeatured: !property.is_featured 
                            })}
                          >
                            {property.is_featured ? (
                              <>
                                <StarOff className="mr-2 h-4 w-4" />
                                <span>Премахни от препоръчани</span>
                              </>
                            ) : (
                              <>
                                <Star className="mr-2 h-4 w-4" />
                                <span>Добави към препоръчани</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Properties;
