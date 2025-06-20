import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TeamMember } from '@/integrations/supabase/types';
import { SocialMediaLinks } from '@/components/icons/SocialMediaIcons';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={member.image_url || "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=400"} 
          alt={member.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="text-xl font-semibold mb-1 text-gray-900">{member.name}</h3>
          <p className="text-primary/70 mb-3 font-medium">{member.position}</p>
          
          {member.bio && (
            <p 
              className="text-neutral-dark mb-4 text-sm leading-relaxed overflow-hidden"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                maxHeight: '5.5rem'
              }}
            >
              {member.bio}
            </p>
          )}
          
          {/* Contact Information */}
          {(member.email || member.phone_number) && (
            <div className="mb-4 text-sm text-gray-600 space-y-1">
              {member.email && (
                <p className="flex items-center">
                  <span className="mr-2">📧</span>
                  <span className="break-all">{member.email}</span>
                </p>
              )}
              {member.phone_number && (
                <p className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>{member.phone_number}</span>
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Social Media Links - Always at bottom */}
        <div className="flex justify-center mt-auto pt-4 border-t border-gray-100">
          <SocialMediaLinks
            facebookUrl={member.facebook_url || undefined}
            instagramUrl={member.instagram_url || undefined}
            tiktokUrl={member.tiktok_url || undefined}
            className="flex space-x-3"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
