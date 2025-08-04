'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Vote, Eye, PlayCircle, X, Share2, Copy, Check, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '../dashboard/types/event';
import driveImageLoader from '../lib/driveImageLoader';
import VideoPlayer from './VideoPlayer';
import Head from 'next/head';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [showVideos, setShowVideos] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const eventUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/emissions/${event.id}`;
  const imageUrl = driveImageLoader({ src: event.image || '' });
  const shareText = `Découvrez "${event.name}" - ${event.description || 'Un événement passionnant à ne pas manquer!'}`;
  const shareImage = imageUrl; // URL de l'image pour le partage

  const handleShare = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}&via=${encodeURIComponent('votreCompteTwitter')}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${eventUrl}`)}`;
        break;
      case 'instagram':
        // Instagram ne supporte pas le partage direct par URL, on copie le lien
        copyToClipboard();
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      setShowShareMenu(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${eventUrl}`);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      setShowShareMenu(false);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      alert('Impossible de copier le lien. Veuillez le copier manuellement.');
    }
  };

  return (
    <>
      {/* CARD */}
      <motion.div
        className="group relative bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden transform transition-all duration-700 hover:shadow-3xl hover:-translate-y-4 hover:scale-[1.03] border border-white/30 dark:border-gray-600/30"
        style={{
          transform: 'translate3d(0,0,0)',
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
        whileHover={{
          boxShadow: '0 32px 64px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)',
        }}
      >
        {/* Image Container - Optimisée pour affichage complet */}
        <div className="relative h-56 md:h-64 overflow-visible">
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover object-center transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            quality={90}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        
          {/* Badge votes redesigné */}
          <motion.div 
            className="absolute top-6 right-6 z-30"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 backdrop-blur-lg text-white px-2 py-1 rounded-lg shadow-2xl border border-white/20">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5" />
                <span className="font-bold text-lg">{event.totalVotes}</span>
              </div>
            </div>
          </motion.div>

          {/* Bouton de partage modernisé */}
          <div className="absolute top-6 left-6 z-30">
            <motion.button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="bg-white/20 backdrop-blur-lg text-white p-3 rounded-2xl shadow-xl border border-white/20 transition-all duration-300 hover:bg-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>

            {/* Menu de partage */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  className="absolute left-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/30 dark:border-gray-600/30 min-w-[200px] z-50"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <Facebook className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Facebook</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <Twitter className="w-4 h-4 text-black dark:text-white" />
                      <span className="text-sm">Twitter</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.512z"/>
                      </svg>
                      <span className="text-sm">WhatsApp</span>
                    </button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Lien copié!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm">Copier le lien</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Contenu redesigné */}
        <div className="relative p-6 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm">
          {/* Titre avec effet de brillance */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-black dark:text-gray-100 mb-3 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text">
              {event.name}
              <div className='h-[3px] rounded-sm w-[100px] bg-orange-500 mt-1'></div>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Boutons d'action modernisés */}
          <div className="flex flex-col gap-3">
            {/* Bouton Voir les vidéos */}
            {event.videos?.length > 0 && (
              <motion.button
                onClick={() => setShowVideos(true)}
                className="group flex items-center gap-3 text-orange-500 hover:text-orange-600 font-semibold text-sm transition-all duration-300 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <span>Voir les Vidéos ({event.videos.length})</span>
              </motion.button>
            )}

            {/* Bouton Voir Plus */}
            <motion.a
              href={`/emissions/${event.id}`}
              className="inline-flex items-center justify-center gap-3 text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl font-semibold text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-5 h-5" />
              <span>{"Découvrir l'événement"}</span>
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* OVERLAY VIDEOS - Inchangé */}
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
    </>
  );
};

export default EventCard;