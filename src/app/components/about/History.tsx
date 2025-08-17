import Image from 'next/image';

export default function NotreHistoire() {
  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section - À gauche */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="aspect-[4/3] relative">
                <img
                  src="/images/concert-image.png"
                  alt="Concert avec public - FazioProd événements"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
            
            {/* Carrés décoratifs */}
            {/* Carré en haut à gauche, derrière l'image */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-400 rounded-lg opacity-80 -z-10"></div>
            {/* Carré à droite et en bas */}
            <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-blue-500 rounded-lg opacity-70 -z-10"></div>
          </div>

          {/* Content Section - À droite */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-3xl font-bold text-[#1E3A8A] mb-4">
                Notre Histoire
              </h2>
              
              {/* Ligne décorative orange */}
              <div className="w-16 h-1 bg-orange-400 rounded-full"></div>
            </div>

            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-lg">
                FazioProd est né d&apos;une vision simple mais puissante : créer une plateforme 
                qui permette aux organisateurs d&apos;événements de gérer efficacement 
                leurs émissions tout en offrant une expérience interactive et engageante 
                pour le public.
              </p>

              <p className="text-lg">
                Fondée en 2023, notre entreprise s&apos;est rapidement imposée comme un 
                acteur innovant dans le domaine de la gestion événementielle, en 
                combinant technologie de pointe et simplicité d&apos;utilisation.
              </p>

              <p className="text-lg">
                Notre système unique de votes payants et de tournois à phases multiples 
                permet aux promoteurs de monétiser leurs événements tout en offrant au 
                public un moyen direct de soutenir leurs candidats favoris.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}