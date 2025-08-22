'use client';

import { useState, useEffect } from 'react';
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

  // Fonction pour mélanger un tableau (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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
    if (advertissements.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % advertissements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [advertissements.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? advertissements.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % advertissements.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`container mx-auto max-w-4xl ${className}`}>
      {loading ? (
        <div className="">
          
        </div>
      ) : advertissements.length === 0 ? (
        <div className="text-center p-0">
          
        </div>
      ) : (
        <div className="relative mt-[100px] p-6">
          {/* Carrousel */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {advertissements.map((ad) => (
                <div key={ad.id} className="w-full flex-shrink-0">
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    aria-label={`Visiter ${ad.name}`}
                  >
                    <div className="relative">
                      <div className="aspect-[2/1] w-full overflow-hidden">
                        <img
                          src={driveImageLoader({ src: ad.image })}
                          loading="lazy"
                          alt={`Image de la publicité ${ad.name}`}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                        <h3 className="text-xl font-medium mb-2 group-hover:text-blue-200 transition-colors">
                          {ad.name}
                        </h3>
                        {ad.description && (
                          <p className="text-sm text-white/90 line-clamp-2">
                            {ad.description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-2 text-white/90 group-hover:text-white">
                          <span className="text-sm">Découvrir</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Navigation */}
            {advertissements.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="Publicité précédente"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="Publicité suivante"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Indicateurs */}
          {advertissements.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {advertissements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-blue-500 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Aller à la publicité ${index + 1}`}
                />
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
      `}</style>
    </div>
  );
}

export default PublicAdvertissements;