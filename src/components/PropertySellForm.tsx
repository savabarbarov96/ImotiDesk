import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Building, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PropertySellForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    propertyType: '',
    name: '',
    email: '',
    address: '',
    message: ''
  });

  // Count only digits for reveal logic
  const digitCount = useMemo(
    () => (formData.phone.match(/\d/g) || []).length,
    [formData.phone]
  );

  // Determine which fields to display
  const showPropertyType = digitCount >= 4;
  const showAllRest = digitCount >= 6 || showPropertyType && formData.propertyType;

  // Dynamic hint under phone input
  const phoneHint = useMemo(() => {
    if (digitCount < 1) return 'Продаваш имот? Направи го само в няколко стъпки!';
    if (digitCount < 4) return 'Въведи телефонния си номер';
    if (digitCount === 4) return 'Остават още няколко стъпки, напиши останалата част от номера си';
    if (digitCount < 6) return 'Напиши още цифри, за да продължиш';
    return '';
  }, [digitCount]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate visible required fields
    if (!formData.phone || !formData.propertyType || !formData.name || !formData.email || !formData.address) {
      toast({
        title: 'Грешка',
        description: 'Моля, попълнете всички задължителни полета.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('imotidesk_sell_requests')
        .insert({
          phone: formData.phone,
          property_type: formData.propertyType,
          name: formData.name,
          email: formData.email,
          address: formData.address,
          description: formData.message || null
        });

      if (error) throw error;

      toast({
        title: 'Формулярът е изпратен успешно!',
        description: 'Благодарим ви за интереса. Наш агент ще се свърже с вас възможно най-скоро за безплатна оценка на имота.'
      });

      // Reset the form
      setFormData({ phone: '', propertyType: '', name: '', email: '', address: '', message: '' });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Phone Field - always shown */}
      <div className="group relative">
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
          <span className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center">
              <Phone className="h-3.5 w-3.5 text-white" />
            </div>
            Телефон *
          </span>
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="+359 88x xxxx"
          required
          value={formData.phone}
          onChange={handleChange}
          className="py-3 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-gray-800 focus:ring-4 focus:ring-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
        />
        {phoneHint && (
          <div className="mt-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-700 font-medium flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2 animate-pulse"></span>
              {phoneHint}
            </p>
          </div>
        )}
      </div>

      {/* Property Type - reveal after 4 digits */}
      {showPropertyType && (
        <div className="animate-fade-in group relative">
          <label htmlFor="propertyType" className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center">
                <Building className="h-3.5 w-3.5 text-white" />
              </div>
              Вид имот *
            </span>
          </label>
          <select
            id="propertyType"
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-base transition-all duration-300 focus:border-gray-800 focus:ring-4 focus:ring-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer"
            value={formData.propertyType}
            onChange={handleChange}
            required
          >
            <option value="">Изберете тип имот</option>
            <option value="apartment">Апартамент</option>
            <option value="house">Къща</option>
            <option value="land">Земя</option>
            <option value="commercial">Търговски имот</option>
            <option value="other">Друго</option>
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-3 top-[42px] pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Reveal rest after 6 digits or propertyType selected */}
      {showAllRest && (
        <div className="space-y-5 animate-fade-in">
          <div className="group relative">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">👤</span>
                </div>
                Име и фамилия *
              </span>
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Вашето име"
              value={formData.name}
              onChange={handleChange}
              required
              className="py-3 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-gray-800 focus:ring-4 focus:ring-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
            />
          </div>
          
          <div className="group relative">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Mail className="h-3.5 w-3.5 text-white" />
                </div>
                Имейл адрес *
              </span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="py-3 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-gray-800 focus:ring-4 focus:ring-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
            />
          </div>

          <div className="group relative">
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-white" />
                </div>
                Адрес на имота *
              </span>
            </label>
            <Input
              id="address"
              type="text"
              placeholder="ул./бул., номер, град"
              value={formData.address}
              onChange={handleChange}
              required
              className="py-3 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-gray-800 focus:ring-4 focus:ring-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
            />
          </div>
          
          <div className="group relative">
            <label htmlFor="message" className="block text-sm font-semibold text-neutral-dark mb-2">
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">💬</span>
                </div>
                Допълнителна информация
              </span>
            </label>
            <Textarea
              id="message"
              placeholder="Опишете накратко вашия имот - брой стаи, етаж, състояние, специални характеристики..."
              className="h-24 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-gray-800 focus:ring-4 focus:ring-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm resize-none text-sm"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      
      <div className="pt-3">
        <Button 
          type="submit"
          className="w-full text-white py-4 bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-900 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-xl font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Изпращане...
            </span>
          ) : (
            'Изпратете запитване'
          )}
        </Button>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-xl border border-gray-200/50">
        <p className="text-xs text-neutral text-center">
          С изпращането на формата, се съгласявате с нашите{' '}
          <a href="/terms" className="text-gray-800 hover:text-gray-900 font-medium hover:underline transition-colors duration-200">
            общи условия
          </a>
          {' '}и{' '}
          <a href="/privacy" className="text-gray-800 hover:text-gray-900 font-medium hover:underline transition-colors duration-200">
            политика за поверителност
          </a>
          .
        </p>
      </div>
    </form>
  );
};

export default PropertySellForm;
