'use client';

import { memo, useState, useCallback } from 'react';
import { Event, Tournament } from '../../types/event';
import { Search, Filter, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface PhaseFilterProps {
  events: Event[];
  tournaments: Tournament[];
  onFilterChange: (eventId: string | null, tournamentId: string | null, search: string) => void;
}

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

function PhaseFilter({ events, tournaments, onFilterChange }: PhaseFilterProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const debouncedFilterChange = useCallback(
    debounce((eventId: string | null, tournamentId: string | null, search: string) => {
      onFilterChange(eventId, tournamentId, search);
    }, 300),
    [onFilterChange]
  );

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = e.target.value || null;
    setSelectedEventId(eventId);
    setSelectedTournamentId(null); // Réinitialiser le tournoi lors du changement d'événement
    debouncedFilterChange(eventId, null, search);
  };

  const handleTournamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tournamentId = e.target.value || null;
    setSelectedTournamentId(tournamentId);
    debouncedFilterChange(selectedEventId, tournamentId, search);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    debouncedFilterChange(selectedEventId, selectedTournamentId, searchValue);
  };

  const handleClearFilters = () => {
    setSelectedEventId(null);
    setSelectedTournamentId(null);
    setSearch('');
    onFilterChange(null, null, '');
  };

  // Filtrer les tournois en fonction de l'événement sélectionné
  const filteredTournaments = selectedEventId
    ? tournaments.filter((tournament) => tournament.eventId === selectedEventId)
    : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          Filtrer les phases
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label={isExpanded ? 'Réduire les filtres' : 'Afficher les filtres'}
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      {isExpanded && (
        <div className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg" aria-live="assertive">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="eventFilter" className="block text-sm font-semibold text-gray-700">
                Événement
              </label>
              <div className="relative">
                <select
                  id="eventFilter"
                  value={selectedEventId || ''}
                  onChange={handleEventChange}
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-300 transition-all duration-200 bg-white appearance-none cursor-pointer"
                  aria-label="Filtrer par événement"
                >
                  <option value="">Tous les événements</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="tournamentFilter" className="block text-sm font-semibold text-gray-700">
                Catégorie
              </label>
              <div className="relative">
                <select
                  id="tournamentFilter"
                  value={selectedTournamentId || ''}
                  onChange={handleTournamentChange}
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-300 transition-all duration-200 bg-white appearance-none cursor-pointer"
                  aria-label="Filtrer par catégorie"
                  disabled={!selectedEventId}
                >
                  <option value="">Toutes les catégories</option>
                  {filteredTournaments.map((tournament) => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="searchFilter" className="block text-sm font-semibold text-gray-700">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="searchFilter"
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-300 transition-all duration-200"
                  placeholder="Rechercher par nom ou description"
                  aria-label="Rechercher des phases"
                />
              </div>
            </div>
          </div>
          {(selectedEventId || selectedTournamentId || search) && (
            <div className="flex justify-end">
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                aria-label="Réinitialiser les filtres"
              >
                <X className="h-4 w-4" />
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(PhaseFilter);