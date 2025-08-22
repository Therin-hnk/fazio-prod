'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Advertissement } from '../dashboard/types/advertissement';
import driveImageLoader from '../lib/driveImageLoader';

interface PublicAdvertissementsProps {
  className?: string;
}

function PublicAdvertissements({ className = '' }: PublicAdvertissementsProps) {
  const [advertissements, setAdvertissements] = useState<Advertissement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour mélanger un tableau (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fonction pour démarrer/redémarrer l'auto-scroll
  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (advertissements.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % advertissements.length);
      }, 5000);
    }
  };

  useEffect(() => {
    const loadAdvertissements = async () => {
      try {
        const res = await fetch('/api/public/advertissements', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des publicités.');
        }
        const data = await res.json();
        // Mélanger les publicités de manière aléatoire pour l'équité
        setAdvertissements(shuffleArray(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    loadAdvertissements();
  }, []);

  // Auto-scroll du carrousel
  useEffect(() => {
    startAutoScroll();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [advertissements.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? advertissements.length - 1 : prevIndex - 1
    );
    startAutoScroll(); // Redémarre le compteur
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % advertissements.length);
    startAutoScroll(); // Redémarre le compteur
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    startAutoScroll(); // Redémarre le compteur
  };

  return (
    <div className={`mx-auto w-full ${className}`}
        style={{
            transform: "translate3d(0,0,0)"
        }}
    >
      {loading ? (
        <div className="">
          
        </div>
      ) : advertissements.length === 0 ? (
        <div className="text-center p-0">
          
        </div>
      ) : (
        <div className="relative mt-[70px] p-6">
          {/* Carrousel */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 backdrop-blur-sm">
            {/* Effet de lueur subtile */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50/30 via-transparent to-purple-50/30 pointer-events-none" />
            
            <div 
              className="flex transition-all duration-700 ease-out items-end"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {advertissements.map((ad, index) => (
                <div key={ad.id} className="w-full flex-shrink-0 relative">
                  {/* Effet de parallaxe subtil */}
                  <div className={`absolute inset-0 opacity-20 transition-opacity duration-1000 ${
                    index === currentIndex ? 'opacity-30' : 'opacity-10'
                  }`}>
                    <div className="w-full h-full bg-gradient-to-br from-orange-400/10 via-transparent to-purple-400/10" />
                  </div>
                  
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    aria-label={`Visiter ${ad.name}`}
                  >
                    <div className="relative overflow-hidden">
                      <div className="w-full overflow-hidden">
                        <img
                          src={driveImageLoader({ src: ad.image })}
                          loading="lazy"
                          alt={`Image de la publicité ${ad.name}`}
                          className="w-full h-full max-h-[500px] object-contain transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                          style={{
                            filter: index === currentIndex ? 'none' : 'brightness(0.95)',
                            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                        
                        {/* Overlay dynamique avec effet de respiration */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        {/* Effet de brillance qui traverse l'image au hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white">
                        {/* Animation de fade-up pour le texte */}
                        <div className="transform transition-all duration-500 group-hover:translate-y-[-2px]">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-white bg-orange-600 inline-block px-6 py-2 rounded-3xl transition-all duration-300 drop-shadow-lg">
                            {ad.name}
                          </h3>
                          {ad.description && (
                            <p className="text-sm text-white/90 line-clamp-2 transition-all duration-300 group-hover:text-white">
                              {ad.description}
                            </p>
                          )}
                          <div className="mt-3 flex items-center gap-2 text-white/90 group-hover:text-white transition-all duration-300">
                            <span className="text-sm font-medium">Découvrir</span>
                            <ChevronRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Navigation avec effets améliorés */}
            {advertissements.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl backdrop-blur-sm border border-white/20 group"
                  aria-label="Publicité précédente"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700 transition-all duration-300 group-hover:text-orange-600 group-hover:scale-110" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl backdrop-blur-sm border border-white/20 group"
                  aria-label="Publicité suivante"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700 transition-all duration-300 group-hover:text-orange-600 group-hover:scale-110" />
                </button>
              </>
            )}
          </div>

          {/* Indicateurs améliorés */}
          {advertissements.length > 1 && (
            <div className="flex justify-center mt-6 gap-3">
              {advertissements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative transition-all duration-300 rounded-full ${
                    index === currentIndex 
                      ? 'w-8 h-3 bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg' 
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-125 shadow-md'
                  }`}
                  aria-label={`Aller à la publicité ${index + 1}`}
                >
                  {/* Effet de pulsation pour l'indicateur actif */}
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-30" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default PublicAdvertissements;