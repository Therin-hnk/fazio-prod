'use client';

import React, { useState, SVGProps } from 'react';
import { Facebook, Instagram, Linkedin, Send, Youtube } from 'lucide-react';

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

// Interface pour les données du formulaire
interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  //acceptPolicy: boolean;
}

// Interface pour les props du composant principal
interface ContactSectionProps {
  contactInfo: ContactInfoItem[];
  socialLinks: SocialLink[];
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
  privacyPolicyLink?: string;
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
    <div className="flex items-start gap-4 mb-6">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
        {logo}
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
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
  onSubmit,
}) => {
  // État du formulaire
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    //acceptPolicy: false
  });

  // État de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gestion des changements dans les inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // if (!formData.acceptPolicy) {
    //   alert('Veuillez accepter la politique de confidentialité');
    //   return;
    // }

    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        alert('Message envoyé avec succès !');
      }
      
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
        //acceptPolicy: false
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div  id='contact-info' className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-2 md:p-10 md:gap-10 bg-white">
      {/* Section Informations de contact */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-blue-600 mb-6">
          Informations de contact
        </h2>
        
        <div className="mb-8">
          {contactInfo.map((info, index) => (
            <ContactItem
              key={index}
              logo={info.logo}
              title={info.title}
              content={info.content}
            />
          ))}
        </div>
        
        {socialLinks.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Suivez-nous
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label={`Suivez-nous sur ${social.network}`}
                >
                  {getSocialIcon(social.network)}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section Formulaire de contact */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-blue-600 mb-6">
          Envoyez-nous un message
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Première ligne : Nom et Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Votre nom"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="votre-email@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Sujet */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Sujet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Sujet de votre message"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Votre message..."
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
            />
          </div>

          {/* Checkbox politique de confidentialité
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="acceptPolicy"
              name="acceptPolicy"
              checked={formData.acceptPolicy}
              onChange={handleInputChange}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="acceptPolicy" className="text-sm text-gray-600 leading-relaxed">
              J&apos;accepte la{' '}
              <a 
                href={privacyPolicyLink} 
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                politique de confidentialité
              </a>
            </label>
          </div> */}

          {/* Bouton d'envoi */}
          <button
            type="submit"
            disabled={isSubmitting}
            //disabled={isSubmitting || !formData.acceptPolicy}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer le message
                <Send size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactAdressSection;
export type { ContactInfoItem, SocialLink, ContactFormData, ContactSectionProps };