'use client';

import { memo, useState } from 'react';
import { Phase } from '../../types/event';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PhaseTableProps {
  phases: Phase[];
  onEdit: (phase: Phase) => void;
  onDelete: (phase: Phase) => void;
  onViewDetails: (phase: Phase) => void;
  onSelectPhases: (selectedIds: string[]) => void;
  isLoading: boolean;
}

function PhaseTable({ phases, onEdit, onDelete, onViewDetails, onSelectPhases, isLoading }: PhaseTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelectedIds);
    onSelectPhases(newSelectedIds);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === phases.length) {
      setSelectedIds([]);
      onSelectPhases([]);
    } else {
      const allIds = phases.map((phase) => phase.id);
      setSelectedIds(allIds);
      onSelectPhases(allIds);
    }
  };

  const formatDate = (date: string | null): string => {
    if (!date) return 'N/A';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'N/A';
      return format(dateObj, 'dd MMMM yyyy', { locale: fr });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">
            Phases ({phases.length})
          </h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="grid">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === phases.length && phases.length > 0}
                  onChange={handleSelectAll}
                  disabled={isLoading}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-colors duration-200"
                  aria-label="Sélectionner toutes les phases"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de début
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18M3 18h18" />
                    </svg>
                    <p className="text-sm text-gray-500">Chargement...</p>
                  </div>
                </td>
              </tr>
            ) : phases.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18M3 18h18" />
                    </svg>
                    <p className="text-sm text-gray-500">Aucune phase trouvée</p>
                  </div>
                </td>
              </tr>
            ) : (
              phases.map((phase) => (
                <tr
                  key={phase.id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    selectedIds.includes(phase.id) ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(phase.id)}
                      onChange={() => handleSelect(phase.id)}
                      disabled={isLoading}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-colors duration-200"
                      aria-label={`Sélectionner la phase ${phase.name}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{phase.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{phase.tournament?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{phase.tournament?.event?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(phase.startDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(phase.endDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{phase.participants?.length || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(phase)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                        title="Modifier"
                        aria-label={`Modifier la phase ${phase.name}`}
                      >
                        <Edit2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onDelete(phase)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                        title="Supprimer"
                        aria-label={`Supprimer la phase ${phase.name}`}
                      >
                        <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onViewDetails(phase)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                        title="Voir les détails"
                        aria-label={`Voir les détails de la phase ${phase.name}`}
                      >
                        <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(PhaseTable);