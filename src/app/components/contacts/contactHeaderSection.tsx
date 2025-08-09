import React from 'react';

const ContactHeaderSection = () => {
  return (
    <section className="relative bg-white text-gray-900 overflow-hidden">
      {/* Formes géométriques décoratives */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full opacity-30 -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-50 rounded-full opacity-40 translate-x-48 translate-y-48"></div>
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-orange-200 opacity-20 rotate-45 transform"></div>
      
      {/* Contenu principal */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full border border-orange-200">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium tracking-wide text-orange-600">Support Client</span>
          </div>
          
          {/* Titre principal */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Contactez- 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 relative">
                 nous
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-orange-500 rounded-full"></div>
              </span>
            </h1>
          </div>
          
          {/* Description */}
          <div className="max-w-3xl mx-auto">
            <p className="text-md lg:text-xl leading-relaxed text-gray-600 font-light"
              style={{
                lineHeight: "1.8"
              }}
            >
              {"Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions "}
              <span className="font-medium text-orange-600"> concernant les événements, les votes</span> ou 
              {"l'utilisation de la plateforme."}
            </p>
          </div>
          
          {/* Indicateurs de contact */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Lundi - Vendredi: 9h - 18h30</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Samedi: 9h - 14h</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-20">
        <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z" 
            fill="#fb923c" 
            opacity="0.1"
          />
        </svg>
      </div>
    </section>
  );
};

export default ContactHeaderSection;