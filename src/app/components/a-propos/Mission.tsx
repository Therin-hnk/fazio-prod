// components/MissionSection.tsx
'use client'; // This directive makes it a Client Component in Next.js

import React from 'react';

interface MissionProps {
  title?: string;
  description?: string;
  primaryButton: {
    text: string;
    targetId: string; // ID de la section cible
    className?: string; // Optional custom class for the button
  };
  secondaryButton: {
    text: string;
    targetId: string; // ID de la section cible
    className?: string; // Optional custom class for the button
  };
}

const Mission: React.FC<MissionProps> = ({
  title = "Notre Mission", // Default title
  description = "Bienvenue chez FazioProd, la plateforme innovante qui révolutionne la gestion d'émissions événementielles et de tournois interactifs.", // Default description
  primaryButton,
  secondaryButton,
}) => {
  const handleScroll = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[420px] py-16 px-4 bg-gradient-to-r from-gray-50 via-gray-400 to-gray-50 text-gray-800">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#1E3A8A]">
        {title}
      </h1>
      <div className="w-16 h-1 bg-orange-500 rounded mb-8"></div> {/* Orange underline */}

      <p className="text-lg md:text-xl text-center max-w-2xl leading-relaxed mb-10 text-gray-600">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => handleScroll(primaryButton.targetId)}
          className={`px-8 py-3 rounded-md font-semibold transition-transform transform hover:scale-105 duration-300
                     bg-blue-700 text-white shadow-lg
                     ${primaryButton.className || ''}`}
        >
          {primaryButton.text}
        </button>
        <button
          onClick={() => handleScroll(secondaryButton.targetId)}
          className={`px-8 py-3 rounded-md font-semibold transition-transform transform hover:scale-105 duration-300
                     bg-white text-blue-700 border border-blue-700 shadow-lg
                     ${secondaryButton.className || ''}`}
        >
          {secondaryButton.text}
        </button>
      </div>
    </section>
  );
};

export default Mission;