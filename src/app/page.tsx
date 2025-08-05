'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Loader2 } from 'lucide-react';
import CarouselSlide from './components/CarouselSlide';
import MenuBare from './components/menu';
import EventsSection from './components/EventsSection';
import WebsiteStatsSection from './components/WebsiteStatsSection';
import driveImageLoader from './lib/driveImageLoader';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  alt: string;
}

interface RawSlide {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

const HomePage: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/public/events/ongoing/3');
        if (!response.ok) throw new Error('Erreur lors du chargement des diapositives');
        const rawSlides: RawSlide[] = await response.json();

        // Transformer les données brutes en objets Slide
        const formattedSlides: Slide[] = rawSlides.map((rawSlide, index) => ({
          id: rawSlide.id, // Générer un ID numérique à partir de l'index
          title: rawSlide.name,
          subtitle: rawSlide.description || 'Découvrez cet événement incroyable',
          backgroundImage: driveImageLoader({ src: rawSlide.image || '' }), // Utiliser une image par défaut si aucune n'est fournie
          alt: `${rawSlide.name} - Événement en vedette`,
        }));

        setSlides(formattedSlides);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <Head>
        <title>Accueil - Gestion des Émissions</title>
        <meta name="description" content="Découvrez les meilleurs événements et talents de votre région" />
      </Head>
      <MenuBare />
      <section
        className="relative h-screen overflow-hidden"
        role="region"
        aria-label="Carrousel des événements en vedette"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-600">
            <p>{error}</p>
          </div>
        ) : slides.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-600 dark:text-gray-400">
            <p>Aucune diapositive disponible.</p>
          </div>
        ) : (
          <CarouselSlide slides={slides} autoPlayDelay={10000} className="h-full" />
        )}
      </section>
      <EventsSection />
      {/* <SponsorsPartnersSection /> */}
      <div className='pb-20'></div>
      <WebsiteStatsSection />
      {/* <NewsSection /> */}
    </div>
  );
};

export default HomePage;