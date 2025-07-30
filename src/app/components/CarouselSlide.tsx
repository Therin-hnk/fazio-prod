'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  alt: string;
}

interface CarouselSlideProps {
  slides: Slide[];
  autoPlayDelay?: number;
  className?: string;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({
  slides,
  autoPlayDelay = 3000,
  className = "",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (autoPlayDelay <= 0 || isPaused) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, autoPlayDelay);

    return () => clearInterval(interval);
  }, [autoPlayDelay, isPaused, isTransitioning, slides.length]);

  // Reset isTransitioning after animation duration
  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => setIsTransitioning(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handlePageClick = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
  };

  // Swipe gestures for mobile
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      handleNext();
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), autoPlayDelay);
    },
    onSwipedRight: () => {
      handlePrev();
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), autoPlayDelay);
    },
    trackMouse: true,
  });

  const currentSlideData = slides[currentSlide];

  // Animation variants for slides
  const slideVariants: Variants = {
    initial: { x: '100%', opacity: 0, scale: 0.95, filter: 'blur(8px)' },
    animate: { x: '0%', opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, type: 'spring', stiffness: 120 } },
    exit: { x: '-100%', opacity: 0, scale: 0.95, filter: 'blur(8px)', transition: { duration: 0.4, type: 'spring', stiffness: 120 } },
  };

  // Animation variants for text with stagger
  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const textVariants: Variants = {
    initial: { y: 40, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  // Animation variants for buttons with spring
  const buttonVariants: Variants = {
    initial: { y: 40, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15,
      },
    },
  };

  return (
    <div
      className={`relative h-full overflow-hidden bg-slate-900 ${className}`}
      {...handlers}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container des slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlideData.id}
          className="absolute inset-0"
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Image de fond avec effet de zoom subtil */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 8, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          >
            <Image
              src={currentSlideData.backgroundImage}
              alt={currentSlideData.alt}
              fill
              className="object-cover"
              quality={90}
              priority={currentSlide === 0}
              loading={currentSlide === 0 ? undefined : 'lazy'}
            />
          </motion.div>

          {/* Gradients modernes superposés */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-transparent to-transparent" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-800/25 via-transparent to-orange-500/15"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />

          {/* Effet de texture moderne */}
          <div className="absolute inset-0 opacity-8 mix-blend-soft-light bg-gradient-to-br from-white/15 via-transparent to-gray-300/10" />
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

          {/* Contenu principal */}
          <motion.div
            className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge/Tag moderne */}
              <motion.div
                className="inline-flex items-center px-4 py-2 mb-6 bg-gray-600/20 backdrop-blur-md rounded-full border border-gray-300/30 shadow-2xl"
                variants={buttonVariants}
              >
                <motion.div
                  className="w-2 h-2 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-gray-300 text-sm font-medium tracking-wider uppercase">
                  En cours
                </span>
              </motion.div>

              {/* Titre avec effet moderne */}
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 text-white leading-tight"
                variants={textVariants}
              >
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  {currentSlideData.title}
                </span>
              </motion.h1>

              {/* Sous-titre */}
              {currentSlideData.subtitle && (
                <motion.p
                  className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-300 font-light max-w-3xl mx-auto leading-relaxed"
                  variants={textVariants}
                >
                  {currentSlideData.subtitle}
                </motion.p>
              )}

              {/* Boutons d'action modernes */}
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" variants={containerVariants}>
                <motion.div variants={buttonVariants}>
                  <Link
                    href={`/emissions/${currentSlideData.id}`}
                    className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 backdrop-blur-sm"
                    aria-label={`Voir l'émission ${currentSlideData.title}`}
                  >
                    <span className="relative z-10">Regarder maintenant</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M9 6h1m4 0h1"
                      />
                    </svg>
                    <motion.div
                      className="absolute inset-0 bg-white/15 rounded-2xl blur-xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Indicateurs sociaux */}
              <motion.div
                className="flex justify-center items-center gap-6 mt-8 text-gray-400"
                variants={textVariants}
              >
                <motion.div className="flex items-center gap-2" variants={textVariants}>
                  {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg> */}
                  {/* <span className="text-sm font-medium">2.4K votes</span> */}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Indicateurs de page à droite (chiffres cliquables) */}
      {slides.length > 1 && (
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handlePageClick(index)}
              disabled={isTransitioning}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-medium text-lg transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-orange-500 scale-110 shadow-[0_0_15px_rgba(249,115,22,0.6)]'
                  : 'bg-gray-600/30 hover:bg-gray-600/50 hover:scale-105'
              } disabled:cursor-not-allowed`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Aller au slide ${index + 1}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {index + 1}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Indicateur de progression moderne */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-80 h-1 bg-white/10 rounded-full backdrop-blur-sm overflow-hidden">
        <motion.div
          key={currentSlide}
          className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: autoPlayDelay / 1000,
            ease: "linear"
          }}
        />
        <motion.div
          key={`indicator-${currentSlide}`}
          className="absolute top-0 left-0 h-full w-2 bg-white/80 rounded-full blur-sm"
          initial={{ left: "0%" }}
          animate={{ left: "100%" }}
          transition={{
            duration: autoPlayDelay / 1000,
            ease: "linear"
          }}
        />
      </div>

      {/* Effet de particules flottantes amélioré */}
      <motion.div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-gradient-to-r from-blue-800 to-orange-500 rounded-full shadow-[0_0_8px_rgba(30,58,138,0.5)]"
          animate={{
            y: [-15, 15, -15],
            x: [10, -10, 10],
            rotate: [0, -180, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 2 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-gradient-to-r from-gray-300 to-emerald-500 rounded-full shadow-[0_0_6px_rgba(209,213,219,0.5)]"
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 4 }}
        />
      </motion.div>
    </div>
  );
};

export default CarouselSlide;