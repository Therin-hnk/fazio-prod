'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Recherche pour:', searchQuery);
      // TODO: prisma.emission.findMany({ where: { nom: { contains: searchQuery } } })
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="absolute bottom-8 sm:bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-40">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0">
        <input
          type="text"
          placeholder="Rechercher une émission..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-6 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-r-none focus:outline-none focus:border-orange-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 hover:shadow-lg focus:shadow-lg focus:-translate-y-1"
          aria-label="Rechercher une émission"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-400 dark:hover:bg-orange-500 px-8 py-4 text-white font-semibold text-lg rounded-lg sm:rounded-l-none transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
          aria-label="Lancer la recherche"
        >
          <Search className="w-5 h-5" />
          Rechercher
        </button>
      </div>
    </div>
  );
};

export default SearchBar;