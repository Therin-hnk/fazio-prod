'use client';

import React from 'react';

interface CarouselIndicatorsProps {
  totalSlides: number;
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  totalSlides,
  currentSlide,
  onSlideChange,
}) => (
  <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
    {Array.from({ length: totalSlides }).map((_, index) => (
      <button
        key={index}
        onClick={() => onSlideChange(index)}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          index === currentSlide
            ? 'bg-orange-500 animate-pulse'
            : 'bg-gray-200 dark:bg-gray-600 hover:bg-orange-300 dark:hover:bg-orange-400'
        }`}
        aria-label={`Aller à la diapositive ${index + 1}`}
        aria-current={index === currentSlide ? 'true' : 'false'}
      />
    ))}
  </div>
);

export default CarouselIndicators;