'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Vote, Eye, PlayCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '../dashboard/types/event';
import driveImageLoader from '../lib/driveImageLoader';
import VideoPlayer from './VideoPlayer';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [showVideos, setShowVideos] = useState(false);

  console.log(event);

  return (
    <>
      {/* CARD */}
      <motion.div
        className="relative bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] border border-white/20 dark:border-gray-700/50"
        style={{
          transform: 'translate3d(0,0,0)',
        }}
      >
        {/* Image */}
        <div className="relative h-32 md:h-36 overflow-hidden">
          <Image
            src={driveImageLoader({ src: event.image || '' })}
            alt={event.name}
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
              {event.totalVotes}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            {event.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Lien Voir Plus */}
          <a
            href={`/emissions/${event.id}`}
            className="text-orange-500 hover:text-orange-600 font-medium text-sm mb-3 transition-colors duration-300 flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            Voir Plus
          </a>

          {/* Bouton Voir les vidéos */}
          {event.videos?.length > 0 && (
            <button
              onClick={() => setShowVideos(true)}
              className="mt-2 flex items-center gap-1 text-sm text-white bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2 rounded-lg shadow"
            >
              <PlayCircle className="w-4 h-4" />
              Voir les Vidéos
            </button>
          )}
        </div>

        {/* OVERLAY VIDEOS */}
        <AnimatePresence>
          {showVideos && (
            <motion.div
              className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm px-4 py-10 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Fermer */}
              <button
                onClick={() => setShowVideos(false)}
                className="fixed z-10 top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                aria-label="Fermer la vidéo"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Liste des vidéos */}
              <div className="gap-6 w-full">
                {event.videos.map((video, index) => {
                  return (
                    <div key={index} className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                      <VideoPlayer
                        youtubeUrl={video.url}
                        title={`Vidéo de ${event.name}`}
                        className="w-full h-full"
                      />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default EventCard;
