import { cities } from './content';
import { TeamMember } from '@/integrations/supabase/types';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  city: string;
  address: string;
  propertyType: string;
  status: string;
  featured: boolean;
  exclusive?: boolean;
  imageUrl: string;
  images: string[];
  createdAt: string;
  virtual_tour_url?: string | null;
  agent?: {
    id: string;
    name?: string;
    position?: string;
    image_url?: string;
    email?: string;
    phone_number?: string;
    facebook_url?: string;
    instagram_url?: string;
    tiktok_url?: string;
  };
  latitude?: number | null;
  longitude?: number | null;
  property_type?: string;
  listing_type?: string;
  is_featured?: boolean;
  is_published?: boolean;
  is_exclusive?: boolean;
  owner_id?: string;
}

// Sample property data for demonstration
export const properties: Property[] = [
  {
    id: "1",
    title: "Луксозен апартамент в центъра",
    description: "Просторен и светъл апартамент с прекрасна гледка към града. Напълно обновен с висококачествени материали. Идеална локация близо до обществен транспорт, магазини и ресторанти.",
    price: 380000,
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    location: "Център",
    city: "София",
    address: "ул. Раковски 145",
    propertyType: "Апартамент",
    status: "available",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1598928636135-d146006ff4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
    ],
    createdAt: "2025-05-01"
  },
  {
    id: "2",
    title: "Модерна къща с градина",
    description: "Семейна къща с просторен двор и градина. Къщата е построена с висококачествени материали и има ефективна енергийна система. Перфектна за семейства с деца.",
    price: 560000,
    area: 220,
    bedrooms: 4,
    bathrooms: 3,
    location: "Бояна",
    city: "София",
    address: "ул. Боянска река 34",
    propertyType: "Къща",
    status: "available",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2934&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2986&q=80"
    ],
    createdAt: "2025-04-28"
  },
  {
    id: "3",
    title: "Панорамен апартамент с две спални",
    description: "Красив апартамент с невероятна панорамна гледка. Апартаментът се продава с модерно обзавеждане и качествена техника, готов за нанасяне.",
    price: 290000,
    area: 85,
    bedrooms: 2,
    bathrooms: 1,
    location: "Лозенец",
    city: "София",
    address: "бул. Черни връх 189",
    propertyType: "Апартамент",
    status: "available",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
    ],
    createdAt: "2025-05-03"
  },
  {
    id: "4",
    title: "Офис пространство в бизнес сграда",
    description: "Модерен офис в престижна бизнес сграда с 24/7 охрана и контрол на достъпа. Отлична локация с добра транспортна свързаност и паркинг.",
    price: 420000,
    area: 150,
    bedrooms: 0,
    bathrooms: 2,
    location: "Бизнес Парк София",
    city: "София",
    address: "Бизнес Парк София, сграда 10",
    propertyType: "Офис",
    status: "available",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
    ],
    createdAt: "2025-04-20"
  },
  {
    id: "5",
    title: "Вила с басейн в планината",
    description: "Луксозна вила с невероятна гледка към планината. Разполага с частен басейн, барбекю и оборудвана лятна кухня. Перфектно място за почивка и релакс.",
    price: 680000,
    area: 280,
    bedrooms: 5,
    bathrooms: 3,
    location: "Владая",
    city: "София",
    address: "ул. Иглика 12",
    propertyType: "Вила",
    status: "available",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
    ],
    createdAt: "2025-04-15"
  },
  {
    id: "6",
    title: "Нов апартамент с тераса в Пловдив",
    description: "Чисто нов апартамент в модерна жилищна сграда с високо качество на строителство. Просторна тераса с изглед към Родопите.",
    price: 210000,
    area: 92,
    bedrooms: 2,
    bathrooms: 1,
    location: "Кючук Париж",
    city: "Пловдив",
    address: "ул. Велико Търново 18",
    propertyType: "Апартамент",
    status: "available",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    images: [
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1617104678098-de229db51175?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
    ],
    createdAt: "2025-04-22"
  }
];

// Function to get featured properties
export const getFeaturedProperties = (): Property[] => {
  return properties.filter(property => property.featured);
};

// Helper function to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
    .replace('EUR', '€')
    .replace(' ', ' '); // Ensure proper spacing
};
