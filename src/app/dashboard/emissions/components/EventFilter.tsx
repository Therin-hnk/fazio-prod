'use client';

import { useState, useEffect, useCallback } from 'react';
import { Organizer } from '../../types/event';
import { Search, Filter, X, Users, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

interface EventFilterProps {
  onFilterChange: (organizerId: string | null, status: string | null, search: string) => void;
}

export default function EventFilter({ onFilterChange }: EventFilterProps) {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  const debouncedOnFilterChange = useCallback(
    debounce((organizerId: string | null, status: string | null, searchTerm: string) => {
      onFilterChange(organizerId, status, searchTerm);
    }, 300),
    [onFilterChange]
  );

  useEffect(() => {
    const loadOrganizers = async () => {
      setLoading(true);
      setError('');
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (userId) {
          headers['x-user-id'] = userId;
        }
        const res = await fetch('/api/manager/v1/users/get', { headers });
        if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrganizers(data);
        } else {
          throw new Error('Format de données invalide');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des organisateurs:', err);
        setError(err instanceof Error ? err.message : 'Impossible de charger les organisateurs');
      } finally {
        setLoading(false);
      }
    };
    loadOrganizers();
  }, [userId]);

  useEffect(() => {
    debouncedOnFilterChange(selectedOrganizerId, selectedStatus, search);
  }, [selectedOrganizerId, selectedStatus, search, debouncedOnFilterChange]);

  const handleOrganizerChange = (value: string) => {
    setSelectedOrganizerId(value ? value : null);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value ? value : null);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const clearFilters = () => {
    setSelectedOrganizerId(null);
    setSelectedStatus(null);
    setSearch('');
  };

  const clearOrganizer = () => {
    setSelectedOrganizerId(null);
  };

  const clearStatus = () => {
    setSelectedStatus(null);
  };

  const clearSearch = () => {
    setSearch('');
  };

  const hasActiveFilters = selectedOrganizerId !== null || selectedStatus !== null || search !== '';
  const activeFiltersCount = (selectedOrganizerId ? 1 : 0) + (selectedStatus ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 text-red-900 hover:text-red-700 transition-colors duration-200 group"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-red-200 rounded-lg group-hover:bg-red-300 transition-colors duration-200">
              <Filter className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-bold">Filtres avancés</h3>
              <p className="text-sm text-red-600 opacity-80">
                {hasActiveFilters ? `${activeFiltersCount} filtre(s) actif(s)` : 'Aucun filtre actif'}
              </p>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <X className="h-4 w-4" />
              <span className="font-medium">Tout effacer</span>
            </button>
          )}
        </div>
      </div>
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg animate-pulse">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm font-medium text-red-700">Erreur de chargement</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label htmlFor="organizerFilter" className="block text-sm font-semibold text-gray-700">
                Filtrer par organisateur
              </label>
              <div className="relative group">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                <select
                  id="organizerFilter"
                  value={selectedOrganizerId || ''}
                  onChange={(e) => handleOrganizerChange(e.target.value)}
                  disabled={loading}
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-red-300 text-gray-900 font-medium appearance-none cursor-pointer"
                >
                  <option value="">Tous les organisateurs</option>
                  {organizers.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.firstName} {org.lastName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                {loading && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="animate-spin h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <label htmlFor="statusFilter" className="block text-sm font-semibold text-gray-700">
                Filtrer par statut
              </label>
              <div className="relative group">
                <select
                  id="statusFilter"
                  value={selectedStatus || ''}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white hover:border-red-300 text-gray-900 font-medium appearance-none cursor-pointer"
                >
                  <option value="">Tous les statuts</option>
                  <option value="coming">À venir</option>
                  <option value="ongoing">En cours</option>
                  <option value="finished">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700">
                Recherche globale
              </label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Nom, description, lieu..."
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 hover:border-red-300 placeholder-gray-400 text-gray-900 font-medium"
                />
                {search && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 hover:bg-red-50 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filtres actifs :
                </span>
                {selectedOrganizerId && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-sm font-medium rounded-full border border-red-300 shadow-sm">
                    <Users className="h-3 w-3" />
                    {organizers.find((org) => org.id === selectedOrganizerId)?.firstName}{' '}
                    {organizers.find((org) => org.id === selectedOrganizerId)?.lastName}
                    <button
                      onClick={clearOrganizer}
                      className="hover:text-red-900 transition-colors duration-200 ml-1 hover:bg-red-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedStatus && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-sm font-medium rounded-full border border-red-300 shadow-sm">
                    <Filter className="h-3 w-3" />
                    {selectedStatus === 'coming' ? 'À venir' :
                     selectedStatus === 'ongoing' ? 'En cours' :
                     selectedStatus === 'finished' ? 'Terminé' : 'Annulé'}
                    <button
                      onClick={clearStatus}
                      className="hover:text-red-900 transition-colors duration-200 ml-1 hover:bg-red-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-sm font-medium rounded-full border border-red-300 shadow-sm">
                    <Search className="h-3 w-3" />
                    "{search}"
                    <button
                      onClick={clearSearch}
                      className="hover:text-red-900 transition-colors duration-200 ml-1 hover:bg-red-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}