import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { siteContent } from '../data/content';
import logo from '@/assets/logo.png';
import { createClient } from '@supabase/supabase-js';

// Custom TikTok icon since it's not available in lucide-react
const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
    <path d="M16 8v8"/>
    <path d="M12 16v-8"/>
    <path d="M18 8a4 4 0 0 0-4-4"/>
    <path d="M16 4h-4"/>
    <path d="M16 8a4 4 0 0 1 4 4v1"/>
  </svg>
);

// Default social media links (used as fallback if Supabase fetch fails)
const defaultSocialLinks = [
  { id: 'default-1', platform: "Facebook", url: "https://facebook.com", icon: "Facebook", is_active: true, display_order: 1 },
  { id: 'default-2', platform: "Instagram", url: "https://instagram.com", icon: "Instagram", is_active: true, display_order: 2 },
  { id: 'default-3', platform: "TikTok", url: "https://tiktok.com", icon: "TikTok", is_active: true, display_order: 3 },
];

// Icons mapping
const iconComponents: Record<string, React.ReactNode> = {
  Facebook: <Facebook />,
  Instagram: <Instagram />,
  Twitter: <Twitter />,
  Linkedin: <Linkedin />,
  TikTok: <TikTokIcon />,
};

// Interface for social media links
interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

// Initialize Supabase client (consider moving to a shared config if used in multiple places)
const supabaseUrl = 'https://zanfdpuiblradrbtfzhl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmZkcHVpYmxyYWRyYnRmemhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDMwMTksImV4cCI6MjA2MjIxOTAxOX0.vOGXgtT7M4Vlrwt5vXIXW69VARao80gZCSfl2kgliZ0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Footer = () => {
  const { footer, nav } = siteContent;
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(defaultSocialLinks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: dbError } = await supabase
          .from('social_media_links')
          .select('*')
          .eq('is_active', true) // Fetch only active links
          .order('display_order', { ascending: true });
        
        if (dbError) {
          throw dbError;
        }
        
        if (data && data.length > 0) {
          setSocialLinks(data);
        } else {
          console.warn('No active social media links found in database, using defaults.');
          setSocialLinks(defaultSocialLinks); // Keep defaults if no active links from DB
        }
      } catch (error: any) {
        console.error('Error fetching social media links for footer:', error.message);
        setError(error.message || 'Unknown error fetching links');
        setSocialLinks(defaultSocialLinks); // Fallback to defaults on any error
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  // No need to re-filter and sort here as it's done in the fetch or set by defaultSocialLinks
  // const activeSocialLinks = socialLinks;

  return (
    <footer className="bg-gradient-to-b from-white to-gray-200 text-gray-800">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info with Logo */}
          <div>
            <div className="mb-4">
              <img 
                src="/trendimo.png" 
                alt="AutomationAid Logo" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-600 mb-4">
              {footer.aboutText}
            </p>
            <div className="flex space-x-4">
              {loading ? (
                <div className="text-sm text-gray-400">Зареждане...</div>
              ) : error ? (
                <div className="text-sm text-red-500">Грешка: {error}</div>
              ) : socialLinks.length === 0 ? (
                <div className="text-sm text-gray-400">Няма активни социални мрежи.</div>
              ) : (
                socialLinks.map((link) => (
                  <a 
                    key={link.id}
                    href={link.url} 
                    className="text-gray-600 hover:text-primary transition-colors" 
                    aria-label={link.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {iconComponents[link.icon] || link.platform}
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Quick Links - Redesigned as pills/buttons */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">{footer.quickLinks}</h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                {nav.home}
              </Link>
              <Link to="/properties" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                {nav.properties}
              </Link>
              <Link to="/services" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                {nav.services}
              </Link>
              <Link to="/sell" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                {nav.sell}
              </Link>
              <Link to="/about" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                {nav.about}
              </Link>
              <Link to="/careers" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                {nav.careers}
              </Link>
              <Link to="/news" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                {nav.blog}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">{footer.contact.title}</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-gray-600" />
                <span className="text-gray-600">{footer.contact.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-gray-600" />
                <span className="text-gray-600">{footer.contact.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gray-600" />
                <a href={`mailto:${footer.contact.email}`} className="text-gray-600 hover:text-gray-800 transition-colors">
                  {footer.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">{footer.newsletter.title}</h3>
            <div className="flex">
              <Input
                type="email"
                placeholder={footer.newsletter.placeholder}
                className="bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button variant="outline" className="ml-2 border-black text-black hover:bg-black hover:text-white transition-colors">
                {footer.newsletter.buttonText}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between">
          <div className="text-gray-600 mb-4 md:mb-0">
            © 2025 Automation Aid. Всички права запазени.
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-gray-600 hover:text-gray-800 transition-colors">
              {footer.terms}
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-800 transition-colors">
              {footer.privacy}
            </Link>
            <Link to="/cookies" className="text-gray-600 hover:text-gray-800 transition-colors">
              {footer.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
