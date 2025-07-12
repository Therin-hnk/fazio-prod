'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  votes: number;
  youtubeUrl: string;
  alt: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Talents Latent',
    description: 'Découvrez les talents cachés de votre région dans ce concours épique !',
    image: '/images/Gemini_Generated_Image_zdnt48zdnt48zdnt.png',
    votes: 2400,
    youtubeUrl: 'https://youtu.be/kdL8qrhyfOQ?si=GimL8KGd5lrCrlms',
    alt: 'Talents Latent - Émission de découverte de talents',
  },
  {
    id: 2,
    title: 'Agone Humour',
    description: "Le meilleur de l'humour africain avec des performances hilarantes.",
    image: '/images/Gemini_Generated_Image_s078zbs078zbs078.png',
    votes: 1800,
    youtubeUrl: 'https://youtu.be/kdL8qrhyfOQ?si=GimL8KGd5lrCrlms',
    alt: "Agone Humour - Spectacle d'humour",
  },
  {
    id: 3,
    title: 'Fais moi rire',
    description: 'Un comedy show interactif où le public vote pour ses favoris.',
    image: '/images/Gemini_Generated_Image_iyvq97iyvq97iyvq.png',
    votes: 3200,
    youtubeUrl: 'https://youtu.be/kdL8qrhyfOQ?si=GimL8KGd5lrCrlms',
    alt: 'Fais moi rire - Show interactif',
  },
  {
    id: 4,
    title: 'Chant des Étoiles',
    description: 'Un concours de chant qui révèle les futures stars.',
    image: '/images/Gemini_Generated_Image_iyvq97iyvq97iyvq.png',
    votes: 1500,
    youtubeUrl: 'https://youtu.be/kdL8qrhyfOQ?si=GimL8KGd5lrCrlms',
    alt: 'Chant des Étoiles - Concours de chant',
  },
  {
    id: 5,
    title: 'Danse Passion',
    description: 'Montrez vos talents de danseur dans cette compétition enflammée.',
    image: '/images/Gemini_Generated_Image_iyvq97iyvq97iyvq.png',
    votes: 2700,
    youtubeUrl: 'https://youtu.be/kdL8qrhyfOQ?si=GimL8KGd5lrCrlms',
    alt: 'Danse Passion - Compétition de danse',
  },
  {
    id: 6,
    title: 'Comedy Night',
    description: 'Une soirée comique avec les meilleurs humoristes.',
    image: '/images/Gemini_Generated_Image_iyvq97iyvq97iyvq.png',
    votes: 2000,
    youtubeUrl: 'https://youtu.be/kdL8qrhyfOQ?si=GimL8KGd5lrCrlms',
    alt: 'Comedy Night - Soirée comique',
  },
  {
    id: 7,
    title: 'Star Talent',
    description: "Les stars de demain s'affrontent dans ce concours unique.",
    image: '/images/Gemini_Generated_Image_iyvq97iyvq97iyvq.png',
    votes: 2900,
    youtubeUrl: 'https://youtu.be/kdL8qrhyfOQ?si=GimL8KGd5lrCrlms',
    alt: 'Star Talent - Concours de talents',
  },
];

const EventsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Filtrer les événements en fonction de la recherche
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-white overflow-hidden" role="region" aria-label="Liste des événements">
      {/* Background Wave */}
      <div className="absolute top-0 w-full mt-[-30px] inset-0 opacity-1 dark:opacity-40">
        <svg className="top-0" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,400 C480,300 960,500 1440,400 L1440,800 L0,800 Z" fill="#F97316" />
          <path d="M0,500 C480,400 960,600 1440,500 L1440,800 L0,800 Z" fill="#F97316" />
          <path d="M0,600 C480,500 960,700 1440,600 L1440,800 L0,800 Z" fill="#F97316" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <motion.h2 
          className="text-1xl sm:text-3xl md:text-3xl font-bold text-center mb-8 md:mb-9 text-[#F97316]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Nos Événements
        </motion.h2>

        {/* Barre de recherche */}
        <motion.div 
          className="max-w-2xl mx-auto mb-8 md:mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden transition-all duration-300">
            <Search className="w-6 h-6 mx-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-3 px-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-lg"
              aria-label="Rechercher un événement par titre"
            />
          </div>
        </motion.div>

        {/* Grille des cartes */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {paginatedEvents.length > 0 ? (
            paginatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <motion.p 
              className="text-center text-gray-600 dark:text-gray-400 col-span-full text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Aucun événement trouvé.
            </motion.p>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="mt-12 md:mt-16 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Page précédente"
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === index + 1
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-orange-100 dark:hover:bg-gray-600'
                }`}
                aria-label={`Aller à la page ${index + 1}`}
                aria-current={currentPage === index + 1 ? 'page' : undefined}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Page suivante"
            >
              Suivant
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;