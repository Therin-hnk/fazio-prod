'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import { Event } from '../dashboard/types/event';

const EventsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 6;

  // Filtrer les événements en fonction de la recherche
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/public/events');
        if (!response.ok) throw new Error('Erreur lors du chargement des diapositives');
        const eventsList: Event[] = await response.json();

        setEvents(eventsList);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  return (
    <section id='events' className="relative py-16 pt-20 bg-white overflow-hidden" role="region" aria-label="Liste des événements">
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
          className="text-1xl sm:text-3xl md:text-3xl font-bold text-center mb-8 md:mb-9 text-[#000000aa]"
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
          <div className="flex items-center bg-white dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden transition-all duration-300">
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

        {/* Pagination moderne et attrayante */}
{totalPages > 1 && (
  <motion.div 
    className="mt-12 md:mt-16 flex justify-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
  >
    <div className="flex items-center space-x-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
      {/* Bouton Précédent */}
      <motion.button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="group relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
        whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        aria-label="Page précédente"
      >
        <svg className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Pages */}
      <div className="flex items-center space-x-1 mx-2">
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNum = index + 1;
          const isActive = currentPage === pageNum;
          const isNearActive = Math.abs(currentPage - pageNum) <= 1;
          const shouldShow = totalPages <= 7 || isNearActive || pageNum === 1 || pageNum === totalPages;

          if (!shouldShow && pageNum !== 2 && pageNum !== totalPages - 1) {
            return pageNum === 2 || pageNum === totalPages - 1 ? (
              <span key={`dots-${pageNum}`} className="px-2 py-2 text-gray-400 dark:text-gray-500 font-medium">
                ...
              </span>
            ) : null;
          }

          return (
            <motion.button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`relative w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-orange-600 dark:hover:text-orange-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Aller à la page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600"
                  layoutId="activePageBg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{pageNum}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Bouton Suivant */}
      <motion.button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="group relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
        aria-label="Page suivante"
      >
        <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>

    {/* Indicateur de page (optionnel) */}
    <div className="absolute mt-20 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      <span>Page {currentPage} sur {totalPages}</span>
      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
      <span>{filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''}</span>
    </div>
  </motion.div>
)}
      </div>
    </section>
  );
};

export default EventsSection;