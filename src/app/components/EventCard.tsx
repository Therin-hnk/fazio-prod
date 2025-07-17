'use client';

import React from 'react';
import Image from 'next/image';
import { Vote, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoPlayer from './VideoPlayer';

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  votes: number;
  youtubeUrl: string;
  alt: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] border border-white/20 dark:border-gray-700/50"
    >
      {/* Image */}
      <div className="relative h-32 md:h-36 overflow-hidden">
        <Image
          src={event.image}
          alt={event.alt}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
          quality={75}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Badge votes */}
        <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          <div className="flex items-center gap-1">
            <Vote className="w-4 h-4" />
            {event.votes.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          {event.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>
        
        {/* Bouton Voir Plus */}
        <a href={`/emissions/${event.title}`} className="text-orange-500 hover:text-orange-600 font-medium text-sm mb-4 transition-colors duration-300 flex items-center gap-1">
          <Eye className="w-4 h-4" />
          Voir Plus
        </a>
        
        {/* Vidéo */}
        <VideoPlayer
          youtubeUrl={event.youtubeUrl}
          title={`Vidéo de ${event.title}`}
          className="rounded-lg overflow-hidden"
        />
      </div>
    </motion.div>
  );
};

export default EventCard;