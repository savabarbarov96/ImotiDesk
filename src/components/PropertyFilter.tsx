import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cities, propertyTypes } from '@/data/content';
import { FilterState } from '@/components/properties/types';
import { Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('bg-BG', { 
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

interface PropertyFilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    listingType: '',
    propertyType: '',
    city: '',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    bathrooms: null
  });

  const [priceRange, setPriceRange] = useState<number[]>([
    initialFilters?.minPrice || 0, 
    initialFilters?.maxPrice || 2000000
  ]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [initialFilterSet, setInitialFilterSet] = useState(false);

  useEffect(() => {
    if (initialFilters && (!initialFilterSet || 
        JSON.stringify(initialFilters) !== JSON.stringify(filters))) {
      console.log('Updating filters from initialFilters:', initialFilters);
      setFilters(initialFilters);
      setPriceRange([
        initialFilters.minPrice || 0,
        initialFilters.maxPrice || 2000000
      ]);
      setInitialFilterSet(true);
    }
  }, [initialFilters]);

  const handleListingTypeChange = (value: string) => {
    console.log('Listing type changed to:', value);
    const newFilters = { ...filters, listingType: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePropertyTypeChange = (value: string) => {
    console.log('Property type changed to:', value);
    const newFilters = { ...filters, propertyType: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCityChange = (value: string) => {
    console.log('City changed to:', value);
    const newFilters = { ...filters, city: value === 'all' ? '' : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    const newFilters = { ...filters, minPrice: value[0], maxPrice: value[1] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBedroomsChange = (value: string) => {
    const bedrooms = value === 'all' ? null : parseInt(value);
    const newFilters = { ...filters, bedrooms };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBathroomsChange = (value: string) => {
    const bathrooms = value === 'all' ? null : parseInt(value);
    const newFilters = { ...filters, bathrooms };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      listingType: '',
      propertyType: '',
      city: '',
      minPrice: null,
      maxPrice: null,
      bedrooms: null,
      bathrooms: null
    };
    setFilters(resetFilters);
    setPriceRange([0, 2000000]);
    onFilterChange(resetFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <Card className="sticky top-4 bg-gradient-to-b from-white to-[#FCE7EC] border-[#F0426A]/30">
      <CardHeader className="pb-3 bg-gradient-to-r from-[#C41945] to-[#E42B57] text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-play flex items-center text-white">
            <Filter className="mr-2" />
            Филтри
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="text-white hover:text-white hover:bg-white/10"
          >
            {expanded ? 'Скрий' : 'Покажи всички'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Listing Type */}
          <div>
            <h3 className="font-medium mb-2 text-[#C41945]">Тип оферта</h3>
            <ToggleGroup 
              type="single" 
              value={filters.listingType} 
              onValueChange={handleListingTypeChange} 
              className="flex flex-wrap"
            >
              <ToggleGroupItem 
                value="sale" 
                className="flex-1 data-[state=on]:bg-[#E42B57] data-[state=on]:text-white"
              >
                Продажба
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="rent" 
                className="flex-1 data-[state=on]:bg-[#E42B57] data-[state=on]:text-white"
              >
                Наем
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="font-medium mb-2 text-[#C41945]">Вид имот</h3>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypes.slice(0, expanded ? undefined : 4).map((type, index) => (
                <Button 
                  key={index}
                  variant={filters.propertyType === type ? "default" : "outline"} 
                  className={`justify-start w-full ${filters.propertyType === type ? 'bg-[#E42B57] hover:bg-[#C41945]' : 'border-[#F0426A]/30'}`}
                  onClick={() => {
                    console.log('Property type button clicked:', type);
                    const newValue = filters.propertyType === type ? '' : type;
                    handlePropertyTypeChange(newValue);
                  }}
                >
                  {type}
                </Button>
              ))}
            </div>
            {propertyTypes.length > 4 && (
              <Button
                variant="ghost"
                className="w-full mt-2 text-[#C41945] hover:text-[#E42B57] hover:bg-[#FCE7EC]"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    По-малко
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Повече опции
                  </>
                )}
              </Button>
            )}
          </div>

          {/* City */}
          <div>
            <h3 className="font-medium mb-2 text-[#C41945]">Местоположение</h3>
            <Select 
              value={filters.city} 
              onValueChange={handleCityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Всички градове" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Всички градове</SelectItem>
                  {cities.map((city, index) => (
                    <SelectItem key={index} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-4 text-[#C41945]">Цена</h3>
            <Slider
              value={priceRange}
              min={0}
              max={2000000}
              step={25000}
              onValueChange={handlePriceChange}
              className="mb-6"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm">
                От: <span className="font-semibold text-[#C41945]">{formatPrice(priceRange[0])}</span>
              </div>
              <div className="text-sm">
                До: <span className="font-semibold text-[#C41945]">{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>

          {expanded && (
            <>
              {/* Bedrooms */}
              <div>
                <h3 className="font-medium mb-2 text-[#C41945]">Спални</h3>
                <Select 
                  value={filters.bedrooms?.toString() || 'all'} 
                  onValueChange={handleBedroomsChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Всички" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Всички</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div>
                <h3 className="font-medium mb-2 text-[#C41945]">Бани</h3>
                <Select 
                  value={filters.bathrooms?.toString() || 'all'} 
                  onValueChange={handleBathroomsChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Всички" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Всички</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 border-[#F0426A]/30 hover:bg-[#FCE7EC] text-[#C41945]"
              onClick={handleReset}
            >
              Изчисти
            </Button>
            <Button 
              className="flex-1 bg-[#E42B57] hover:bg-[#C41945]"
              onClick={handleApplyFilters}
            >
              Приложи
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFilter;
