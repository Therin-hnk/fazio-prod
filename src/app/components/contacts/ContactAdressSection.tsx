'use client';

import React, { useState, SVGProps } from 'react';
import { Facebook, Instagram, Linkedin, Send, Youtube, Mail } from 'lucide-react';

// Interface pour une information de contact
interface ContactInfoItem {
  logo: React.ReactNode;
  title: string;
  content: string;
}

// Interface pour les liens des réseaux sociaux
interface SocialLink {
  network: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
  link: string;
}

// Interface pour les props du composant principal
interface ContactSectionProps {
  contactInfo: ContactInfoItem[];
  socialLinks: SocialLink[];
  privacyPolicyLink?: string;
  contactEmail?: string;
}

// Composant pour le logo X de Twitter
const TwitterXIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-current"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Fonction pour obtenir l'icône du réseau social
const getSocialIcon = (network: SocialLink['network']) => {
  const iconProps = { size: 18 };
  
  switch (network) {
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'twitter':
      return <TwitterXIcon size={18} />;
    case 'instagram':
      return <Instagram {...iconProps} />;
    case 'linkedin':
      return <Linkedin {...iconProps} />;
    case 'youtube':
      return <Youtube {...iconProps} />;
    default:
      return null;
  }
};

// Composant pour une information de contact individuelle
const ContactItem: React.FC<ContactInfoItem> = ({ logo, title, content }) => {
  return (
    <div className="group flex items-start gap-4 mb-6 p-4 rounded-xl transition-all duration-300 hover:bg-orange-50/50 hover:shadow-sm">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-300">
        {logo}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">
          {title}
        </h3>
        <div className="text-base text-gray-600 whitespace-pre-line leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

// Composant principal
const ContactAdressSection: React.FC<ContactSectionProps> = ({
  contactInfo,
  socialLinks,
  contactEmail = "fazioprod.inter@gmail.com",
}) => {
  const handleContactClick = () => {
    const subject = encodeURIComponent("Demande d'information");
    const body = encodeURIComponent("Bonjour,\n\nJ'aimerais obtenir plus d'informations concernant...\n\nMerci pour votre attention.\n\nCordialement,");
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Formes décoratives */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full opacity-60 translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-100 rounded-full opacity-40 -translate-x-24 translate-y-24"></div>
      
      <div id='contact-info' className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-12 md:gap-12 max-w-7xl mx-auto">
        {/* Section Informations de contact */}
        <div className="relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100/50 backdrop-blur-sm">
          {/* Badge décoratif */}
          <div className="absolute -top-4 left-8">
            <div className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              Contact Direct
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-8">
              Informations de contact
            </h2>
            
            <div className="mb-10">
              {contactInfo.map((info, index) => (
                <ContactItem
                  key={index}
                  logo={info.logo}
                  title={info.title}
                  content={info.content}
                />
              ))}
            </div>

            {/* Bouton de contact email */}
            <div className="mb-8">
              <button
                onClick={handleContactClick}
                className="w-full group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Nous contacter par email
                <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </button>
            </div>
            
            {socialLinks.length > 0 && (
              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  Suivez-nous
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-orange-500 hover:to-orange-600 text-gray-600 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                      aria-label={`Suivez-nous sur ${social.network}`}
                    >
                      <div className="group-hover:rotate-6 transition-transform duration-300">
                        {getSocialIcon(social.network)}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section visuelle décorative */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-md">
            {/* Cercles décoratifs animés */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full opacity-20"></div>
            
            {/* Icône centrale */}
            <div className="relative z-10 w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <Mail className="w-16 h-16 text-orange-500" />
            </div>

            {/* Éléments flottants */}
            <div className="absolute top-8 right-8 w-4 h-4 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-12 left-8 w-6 h-6 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/3 right-4 w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAdressSection;
export type { ContactInfoItem, SocialLink, ContactSectionProps };