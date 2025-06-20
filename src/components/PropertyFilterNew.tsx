import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cities, propertyTypes } from '@/data/content';
import { FilterState } from '@/components/properties/types';
import { Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
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

const PropertyFilterNew: React.FC<PropertyFilterProps> = ({ onFilterChange, initialFilters }) => {
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
      setFilters(initialFilters);
      setPriceRange([
        initialFilters.minPrice || 0,
        initialFilters.maxPrice || 2000000
      ]);
      setInitialFilterSet(true);
    }
  }, [initialFilters]);

  const handleListingTypeChange = (value: string) => {
    const newFilters = { ...filters, listingType: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePropertyTypeChange = (value: string) => {
    const newFilters = { ...filters, propertyType: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCityChange = (value: string) => {
    const newFilters = { ...filters, city: value === 'all' ? '' : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    // If max price is at the maximum (2,000,000), treat it as "2,000,000+" (no upper limit)
    const maxPrice = value[1] >= 2000000 ? null : value[1];
    const newFilters = { ...filters, minPrice: value[0], maxPrice };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBedroomsChange = (value: string) => {
    const bedrooms = value === 'all' ? null : parseInt(value);
    const newFilters = { ...filters, bedrooms };
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

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-base">
      <div className="p-5 border-b border-gray-200 bg-gray-100 text-gray-800 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Филтри
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="text-gray-800 hover:text-gray-900 hover:bg-gray-200 rounded-xl font-medium"
          >
            {expanded ? 'Скрий' : 'Покажи всички'}
          </Button>
        </div>
      </div>
      
      <div className="p-5 space-y-7">
        {/* Listing Type */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800 text-lg">Тип оферта</h3>
          <ToggleGroup 
            type="single" 
            value={filters.listingType} 
            onValueChange={handleListingTypeChange} 
            className="flex flex-wrap gap-2"
          >
            <ToggleGroupItem 
              value="sale" 
              className="flex-1 text-base py-2.5 data-[state=on]:bg-gray-800 data-[state=on]:text-white rounded-xl"
            >
              Продажба
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="rent" 
              className="flex-1 text-base py-2.5 data-[state=on]:bg-gray-800 data-[state=on]:text-white rounded-xl"
            >
              Наем
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Property Type */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800 text-lg">Вид имот</h3>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.slice(0, expanded ? undefined : 4).map((type, index) => (
              <Button 
                key={index}
                variant={filters.propertyType === type ? "default" : "outline"} 
                className={`justify-start w-full text-base py-2.5 rounded-xl ${filters.propertyType === type ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'border-gray-300 hover:bg-gray-100'}`}
                onClick={() => {
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
              className="w-full mt-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl py-2.5 text-base"
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
          <h3 className="font-semibold mb-3 text-gray-800 text-lg">Град</h3>
          <Select value={filters.city} onValueChange={handleCityChange}>
            <SelectTrigger className="w-full rounded-xl py-2.5 text-base">
              <SelectValue placeholder="Изберете град" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-base">
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
          <h3 className="font-semibold mb-4 text-gray-800 text-lg">Ценови диапазон</h3>
          <div className="px-3">
            <Slider
              value={priceRange}
              min={0}
              max={2000000}
              step={25000}
              onValueChange={handlePriceChange}
              className="my-7"
            />
            <div className="flex justify-between text-base text-gray-700 font-medium mt-2">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{priceRange[1] >= 2000000 ? '2 000 000+' : formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800 text-lg">Брой спални</h3>
          <Select value={filters.bedrooms?.toString() || 'all'} onValueChange={handleBedroomsChange}>
            <SelectTrigger className="w-full rounded-xl py-2.5 text-base">
              <SelectValue placeholder="Изберете брой спални" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-base">
              <SelectGroup>
                <SelectItem value="all">Всички</SelectItem>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'спалня' : 'спални'}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full mt-5 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white rounded-xl py-2.5 text-base font-medium"
        >
          Изчисти филтрите
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilterNew; 