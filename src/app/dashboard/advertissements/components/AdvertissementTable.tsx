// app/admin/advertissements/components/AdvertissementTable.tsx
// Composant pour afficher la liste des publicités sous forme de tableau.

'use client';

import { memo, useState } from 'react';
import { Advertissement } from '../../types/advertissement';
import { Edit2, Trash2, Eye, Users } from 'lucide-react';

interface AdvertissementTableProps {
  advertissements: Advertissement[];
  onEdit: (advertissement: Advertissement) => void;
  onDelete: (advertissement: Advertissement) => void;
  onViewDetails: (advertissement: Advertissement) => void;
  onSelectAdvertissements: (selectedIds: string[]) => void;
  isLoading: boolean;
}

function AdvertissementTable({ advertissements, onEdit, onDelete, onViewDetails, onSelectAdvertissements, isLoading }: AdvertissementTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelectedIds);
    onSelectAdvertissements(newSelectedIds);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === advertissements.length) {
      setSelectedIds([]);
      onSelectAdvertissements([]);
    } else {
      const allIds = advertissements.map((ad) => ad.id);
      setSelectedIds(allIds);
      onSelectAdvertissements(allIds);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900">
            Publicités ({advertissements.length})
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
                  checked={selectedIds.length === advertissements.length && advertissements.length > 0}
                  onChange={handleSelectAll}
                  disabled={isLoading}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-colors duration-200"
                  aria-label="Sélectionner toutes les publicités"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propriétaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organisation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
                    <p className="text-sm text-gray-500">Chargement...</p>
                  </div>
                </td>
              </tr>
            ) : advertissements.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
                    <p className="text-sm text-gray-500">Aucune publicité trouvée</p>
                  </div>
                </td>
              </tr>
            ) : (
              advertissements.map((ad) => (
                <tr
                  key={ad.id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    selectedIds.includes(ad.id) ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(ad.id)}
                      onChange={() => handleSelect(ad.id)}
                      disabled={isLoading}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-colors duration-200"
                      aria-label={`Sélectionner la publicité ${ad.name}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{ad.description || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ad.owner}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ad.organization?.lastName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ad.link || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ad.image || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(ad)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                        title="Modifier"
                        aria-label={`Modifier la publicité ${ad.name}`}
                      >
                        <Edit2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onDelete(ad)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                        title="Supprimer"
                        aria-label={`Supprimer la publicité ${ad.name}`}
                      >
                        <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onViewDetails(ad)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                        title="Voir les détails"
                        aria-label={`Voir les détails de la publicité ${ad.name}`}
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

export default memo(AdvertissementTable);