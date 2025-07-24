import React from 'react';

interface MapIframeProps {
  src: string;
  title?: string;
  width?: string;
  height?: string;
  className?: string;
}

const MapIframe: React.FC<MapIframeProps> = ({
  src,
  title = "Localisation",
  width = "100%",
  height = "400px",
  className = ""
}) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}
      style={{ width, height }}
    >
      {/* Overlay avec design stylisé */}
      <div className="absolute inset-0 bg-gray-200 z-0">
        {/* Routes simulées en arrière-plan */}
        <div className="absolute top-8 left-4 w-16 h-0.5 bg-white/70 transform rotate-45"></div>
        <div className="absolute top-12 right-8 w-12 h-0.5 bg-white/70 transform -rotate-12"></div>
        <div className="absolute bottom-16 left-8 w-20 h-0.5 bg-white/70 transform rotate-12"></div>
        <div className="absolute bottom-8 right-4 w-14 h-0.5 bg-white/70 transform -rotate-45"></div>
        
        {/* Routes verticales */}
        <div className="absolute top-4 left-12 w-0.5 h-16 bg-white/70"></div>
        <div className="absolute top-20 right-12 w-0.5 h-12 bg-white/70"></div>
        <div className="absolute bottom-4 left-20 w-0.5 h-20 bg-white/70"></div>
        
        {/* Numéros de routes */}
        <div className="absolute top-6 right-16 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">55</span>
        </div>
        <div className="absolute bottom-12 left-16 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">130</span>
        </div>
      </div>

      {/* Zone principale avec iframe */}
      <div className="absolute inset-4 bg-gray-700 rounded-md shadow-lg overflow-hidden">
        {/* En-tête avec titre */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white px-4 py-2 rounded shadow-md">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide">
              {title}
            </h3>
          </div>
        </div>

        {/* Iframe Google Maps */}
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0, marginTop: '60px' }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
          className="rounded-sm"
        ></iframe>
      </div>

      {/* Indicateur Google Maps */}
      <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-md z-20">
        <svg 
          className="w-4 h-4 text-blue-600" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </div>
  );
};

export default MapIframe;