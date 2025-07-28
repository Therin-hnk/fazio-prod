import React from 'react';
import Image from 'next/image';
import { 
  Linkedin, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Github, 
  Mail, 
  Globe, 
  MessageCircle 
} from 'lucide-react';

interface SocialLink {
  platform: 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'github' | 'email' | 'website' | 'whatsapp' | string;
  url: string;
  icon?: React.ReactNode; // Pour les plateformes personnalisées
}

interface TeamMemberCardProps {
  imageUrl: string;
  name: string;
  position: string;
  description: string;
  socialLinks?: SocialLink[];
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  imageUrl,
  name,
  position,
  description,
  socialLinks = []
}) => {
  const getSocialIcon = (platform: string, customIcon?: React.ReactNode) => {
    // Si une icône personnalisée est fournie, l'utiliser
    if (customIcon) {
      return customIcon;
    }
    
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'instagram':
        return <Instagram size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      case 'facebook':
        return <Facebook size={20} />;
      case 'youtube':
        return <Youtube size={20} />;
      case 'github':
        return <Github size={20} />;
      case 'email':
        return <Mail size={20} />;
      case 'website':
        return <Globe size={20} />;
      case 'whatsapp':
        return <MessageCircle size={20} />;
      default:
        return <Globe size={20} />; // Icône par défaut
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center max-w-xs mx-auto">
      {/* Photo de profil */}
      <div className="w-20 h-20 mb-4 overflow-hidden rounded-full relative">
        <Image 
          src={imageUrl} 
          alt={`Photo de ${name}`}
          fill
          unoptimized={true}
          className="object-cover"
        />
      </div>
      
      {/* Nom */}
      <h3 className="text-xl font-semibold text-blue-800 mb-2">
        {name}
      </h3>
      
      {/* Poste */}
      <p className="text-orange-500 font-medium mb-4 text-sm">
        {position}
      </p>
      
      {/* Description */}
      <p className="text-gray-600 leading-relaxed text-sm mb-6">
        {description}
      </p>
      
      {/* Réseaux sociaux */}
      {socialLinks.length > 0 && (
        <div className="flex space-x-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              {getSocialIcon(link.platform, link.icon)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};