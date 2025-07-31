'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Heart } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  logo: string;
  type: 'sponsor' | 'partner';
  website?: string;
  description?: string;
}

const partners: Partner[] = [
  {
    id: 1,
    name: 'Orange Bénin',
    logo: '/images/orange-logo.png',
    type: 'sponsor',
    website: 'https://orange.bj',
    description: 'Sponsor principal'
  },
  {
    id: 2,
    name: 'MTN Bénin',
    logo: '/images/mtn-logo.png',
    type: 'sponsor',
    website: 'https://mtn.bj',
    description: 'Sponsor officiel'
  },
  {
    id: 3,
    name: 'Moov Africa',
    logo: '/images/moov-logo.png',
    type: 'partner',
    website: 'https://moov-africa.bj',
    description: 'Partenaire média'
  },
  {
    id: 4,
    name: 'Canal+',
    logo: '/images/canal-logo.png',
    type: 'partner',
    website: 'https://canalplus.com',
    description: 'Partenaire diffusion'
  },
  {
    id: 5,
    name: 'Bénin Révélé',
    logo: '/images/benin-logo.png',
    type: 'sponsor',
    website: 'https://beninrevele.bj',
    description: 'Sponsor culture'
  },
  {
    id: 6,
    name: 'Radio Tokpa',
    logo: '/images/tokpa-logo.png',
    type: 'partner',
    website: 'https://radiotokpa.bj',
    description: 'Partenaire radio'
  },
  {
    id: 7,
    name: 'Bénin Web TV',
    logo: '/images/webtv-logo.png',
    type: 'partner',
    website: 'https://beninwebtv.com',
    description: 'Partenaire streaming'
  },
  {
    id: 8,
    name: 'Golfe FM',
    logo: '/images/golfe-logo.png',
    type: 'partner',
    website: 'https://golfefm.bj',
    description: 'Partenaire radio'
  }
];

const SponsorsPartnersSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  const PartnerCard: React.FC<{ partner: Partner; delay?: number }> = ({ partner, delay = 0 }) => (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={() => partner.website && window.open(partner.website, '_blank')}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Logo placeholder */}
      <div className="relative z-10 flex items-center justify-center h-20 mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          {partner.name.charAt(0)}
        </div>
      </div>

      <div className="relative z-10 text-center">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {partner.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {partner.description}
        </p>
        
        {/* Type badge */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          partner.type === 'sponsor' 
            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        }`}>
          {partner.type === 'sponsor' ? <Sparkles className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
          {partner.type === 'sponsor' ? 'Sponsor' : 'Partenaire'}
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Nos Partenaires
            </h2>
            <Heart className="w-8 h-8 text-orange-500 ml-3" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez les entreprises et organisations qui nous accompagnent dans cette aventure
          </p>
        </motion.div>

        {/* Infinite Scrolling Partners */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Scrolling Container */}
          <div 
            className="relative overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 py-8"
            // onMouseEnter={() => setIsPaused(true)}
            // onMouseLeave={() => setIsPaused(false)}
          >
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white/50 to-transparent dark:from-gray-800/50 z-10" />
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white/50 to-transparent dark:from-gray-800/50 z-10" />

            {/* Scrolling Animation */}
            <motion.div
              className="flex gap-8"
              animate={{ x: isPaused ? undefined : "-100%" }}
              transition={{
                duration: isPaused ? 0 : 30,
                ease: "linear",
                repeat: isPaused ? 0 : Infinity,
              }}
            >
              {/* First set of partners */}
              {partners.map((partner) => (
                <div key={`first-${partner.id}`} className="min-w-[280px] flex-shrink-0">
                  <PartnerCard partner={partner} />
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {partners.map((partner) => (
                <div key={`second-${partner.id}`} className="min-w-[280px] flex-shrink-0">
                  <PartnerCard partner={partner} />
                </div>
              ))}
            </motion.div>

            {/* Play/Pause indicator */}
            <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-3 z-20">
              {/* {isPaused ? (
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
              ) : (
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-orange-500 rounded-full animate-pulse" />
                  <div className="w-1 h-4 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 h-4 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              )} */}
              <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-orange-500 rounded-full animate-pulse" />
                  <div className="w-1 h-4 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 h-4 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Vous souhaitez devenir partenaire ?
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Contactez-nous
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorsPartnersSection;