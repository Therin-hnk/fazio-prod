// app/admin/advertissements/components/AdvertissementFilter.tsx
// Composant pour filtrer les publicités.

'use client';

import { memo, useState, useEffect, useCallback } from 'react';
import { Organization } from '../../types/advertissement';
import { Search, Filter, X, ChevronDown, AlertCircle, Users } from 'lucide-react';

interface AdvertissementFilterProps {
    onFilterChange: (organizationId: string | null, search: string) => void;
}

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timeoutId: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
}

function AdvertissementFilter({ onFilterChange }: AdvertissementFilterProps) {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState(true);

    const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

    useEffect(() => {
        const loadOrganizations = async () => {
            try {
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };
                if (userId) {
                    headers['x-user-id'] = userId;
                }
                const res = await fetch('/api/admin/organizations', {headers});
                if (!res.ok) throw new Error('Erreur lors de la récupération des organisations.');
                const data = await res.json();
                setOrganizations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            }
        };
        loadOrganizations();
    }, []);

    const debouncedOnFilterChange = useCallback(
        debounce((organizationId: string | null, searchTerm: string) => {
            onFilterChange(organizationId, searchTerm);
        }, 300),
        [onFilterChange]
    );

    useEffect(() => {
        debouncedOnFilterChange(selectedOrganizationId, search);
    }, [selectedOrganizationId, search, debouncedOnFilterChange]);

    const handleOrganizationChange = (value: string) => {
        setSelectedOrganizationId(value ? value : null);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const clearFilters = () => {
        setSelectedOrganizationId(null);
        setSearch('');
    };

    const clearOrganization = () => {
        setSelectedOrganizationId(null);
    };

    const clearSearch = () => {
        setSearch('');
    };

    const hasActiveFilters = selectedOrganizationId !== null || search !== '';
    const activeFiltersCount = (selectedOrganizationId ? 1 : 0) + (search ? 1 : 0);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-3 text-red-900 hover:text-red-700 transition-colors duration-200 group"
                        aria-expanded={isExpanded}
                        aria-controls="filter-panel"
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
                            aria-label="Effacer tous les filtres"
                        >
                            <X className="h-4 w-4" />
                            <span className="font-medium">Tout effacer</span>
                        </button>
                    )}
                </div>
            </div>
            <div
                id="filter-panel"
                className={`transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
            >
                <div className="p-6">
                    {error && (
                        <div
                            className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg animate-pulse"
                            aria-live="assertive"
                        >
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                <p className="text-sm font-medium text-red-700">Erreur de chargement</p>
                            </div>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label htmlFor="organizationFilter" className="block text-sm font-semibold text-gray-700">
                                Filtrer par organisation
                            </label>
                            <div className="relative group">
                                <select
                                    id="organizationFilter"
                                    value={selectedOrganizationId || ''}
                                    onChange={(e) => handleOrganizationChange(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white hover:border-red-300 text-gray-900 font-medium appearance-none cursor-pointer"
                                    aria-label="Filtrer par organisation"
                                >
                                    <option value="">Toutes les organisations</option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.firstName} {org.lastName}
                                        </option>
                                    ))}
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
                                    placeholder="Nom, description..."
                                    className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 hover:border-red-300 placeholder-gray-400 text-gray-900 font-medium"
                                    aria-label="Recherche globale"
                                />
                                {search && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 hover:bg-red-50 rounded-full"
                                        aria-label="Effacer la recherche"
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
                                {selectedOrganizationId && (
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-sm font-medium rounded-full border border-red-300 shadow-sm">
                                        <Users className="h-3 w-3" />
                                        {organizations.find((org) => org.id === selectedOrganizationId)?.firstName} {organizations.find((org) => org.id === selectedOrganizationId)?.lastName}
                                        <button
                                            onClick={clearOrganization}
                                            className="hover:text-red-900 transition-colors duration-200 ml-1 hover:bg-red-300 rounded-full p-0.5"
                                            aria-label="Effacer le filtre organisation"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                                {search && (
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-sm font-medium rounded-full border border-red-300 shadow-sm">
                                        <Search className="h-3 w-3" />
                                        {search}
                                        <button
                                            onClick={clearSearch}
                                            className="hover:text-red-900 transition-colors duration-200 ml-1 hover:bg-red-300 rounded-full p-0.5"
                                            aria-label="Effacer la recherche"
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

export default memo(AdvertissementFilter);