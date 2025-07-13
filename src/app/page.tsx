'use client';

import React from 'react';
import Head from 'next/head';
import SearchBar from './components/SearchBar';
import CarouselSlide from './components/CarouselSlide';
import MenuBare from './components/menu';
import EventsSection from './components/EventsSection';
import SponsorsPartnersSection from './components/SponsorsPartnersSection';
import WebsiteStatsSection from './components/WebsiteStatsSection';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: string;
  alt: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Talents Latent",
    subtitle: "Découvrez les talents cachés de votre région",
    backgroundImage: "/images/Gemini_Generated_Image_zdnt48zdnt48zdnt.png",
    alt: "Talents Latent - Émission de découverte de talents"
  },
  {
    id: 2,
    title: "Agone Humour",
    subtitle: "Le meilleur de l'humour africain",
    backgroundImage: "/images/Gemini_Generated_Image_s078zbs078zbs078.png",
    alt: "Agone Humour - Spectacle d'humour"
  },
  {
    id: 3,
    title: "Fais moi rire",
    subtitle: "Comedy show interactif avec le public",
    backgroundImage: "/images/Gemini_Generated_Image_iyvq97iyvq97iyvq.png",
    alt: "Fais moi rire - Show interactif"
  }
];

const HomePage: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
    <MenuBare />
    {/* Hero Section */}
    <section className="relative h-screen overflow-hidden" role="main" aria-label="Section principale des moments forts">
      <CarouselSlide slides={slides} autoPlayDelay={10000} className="h-full" />
    </section>
    <EventsSection />

    <SponsorsPartnersSection/>

    <WebsiteStatsSection/>
  </div>
);

export default HomePage;