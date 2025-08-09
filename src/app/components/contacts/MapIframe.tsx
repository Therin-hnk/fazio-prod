import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface MapIframeProps {
  src: string;
  title?: string;
  width?: string;
  height?: string;
  className?: string;
  address?: string;
}

const MapIframe: React.FC<MapIframeProps> = ({
  src,
  title = "Notre localisation",
  width = "100%",
  height = "400px",
  className = "",
  address = "Adresse non spécifiée"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleOpenInMaps = () => {
    window.open(src, '_blank');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Container principal avec formes décoratives */}
      <div 
        className="relative overflow-hidden rounded-3xl shadow-2xl bg-white border border-gray-100"
        style={{ width, height }}
      >
        {/* Formes décoratives en arrière-plan */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-100 rounded-full opacity-30 -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-200 rounded-full opacity-40 translate-x-12 translate-y-12"></div>
        <div className="absolute top-1/3 right-8 w-16 h-16 bg-orange-50 rounded-full opacity-60"></div>

        {/* En-tête élégant */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-white/95 to-orange-50/95 backdrop-blur-sm border-b border-orange-100/50">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 truncate max-w-64">
                  {address}
                </p>
              </div>
            </div>
            
            {/* Bouton d'ouverture externe */}
            <button
              onClick={handleOpenInMaps}
              className="group flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              Ouvrir
            </button>
          </div>
        </div>

        {/* Zone de la carte */}
        <div className="absolute inset-0 mt-20">
          {/* Loader pendant le chargement */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 z-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Navigation className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 font-medium">Chargement de la carte...</p>
                <div className="flex justify-center mt-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Iframe Google Maps */}
          <iframe
            src={src}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title}
            className="rounded-b-3xl"
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* Indicateurs décoratifs */}
        <div className="absolute bottom-6 left-6 flex gap-3 z-30">
          {/* Badge interactif */}
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-orange-100/50 flex items-center gap-2 group hover:bg-white transition-all duration-300">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-300">
              En direct
            </span>
          </div>
        </div>

        {/* Lignes décoratives subtiles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {/* Routes stylisées */}
          <div className="absolute top-1/4 left-8 w-20 h-px bg-gradient-to-r from-transparent via-orange-300/30 to-transparent transform rotate-12"></div>
          <div className="absolute top-1/2 right-12 w-16 h-px bg-gradient-to-r from-transparent via-orange-300/30 to-transparent transform -rotate-45"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-orange-300/30 to-transparent transform rotate-6"></div>
          
          {/* Points d'intérêt simulés */}
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-orange-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-50"></div>
        </div>

        {/* Badge Google Maps moderne */}
        <div className="absolute top-6 right-6 z-30">
          <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-orange-100/50 group hover:scale-105 transition-transform duration-300">
            <MapPin className="w-5 h-5 text-orange-500 group-hover:text-orange-600 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapIframe;