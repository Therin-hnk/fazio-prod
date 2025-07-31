import React from 'react';

interface ValueCardProps {
  circleColor: string;
  title: string;
  description: string;
}

export const ValueCard: React.FC<ValueCardProps> = ({ 
  circleColor, 
  title, 
  description 
}) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg max-w-sm mx-auto">
      {/* Cercle coloré */}
      <div 
        className="w-16 h-16 rounded-full mb-6"
        style={{ backgroundColor: circleColor }}
      />
      
      {/* Titre */}
      <h3 className="text-xl font-semibold text-blue-800 mb-4">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};