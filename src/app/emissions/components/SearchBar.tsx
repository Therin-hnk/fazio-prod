import React from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  searchTerm: string;
  sortBy: string;
  onSearchChange: (term: string) => void;
  onSortChange: (sort: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  sortBy,
  onSearchChange,
  onSortChange
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un participant"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default SearchBar;