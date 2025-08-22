// app/admin/organizations/components/OrganizationTable.tsx
// Composant pour afficher la liste des organisations sous forme de tableau, similaire à EventTable.

'use client';

import { memo, useState } from 'react';
import { Organization } from '../../types/organization';
import { Edit2, Trash2, Eye, Users } from 'lucide-react';

interface OrganizationTableProps {
  organizations: Organization[];
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
  onViewDetails: (organization: Organization) => void;
  onSelectOrganizations: (selectedIds: string[]) => void;
  isLoading: boolean;
}

function OrganizationTable({ organizations, onEdit, onDelete, onViewDetails, onSelectOrganizations, isLoading }: OrganizationTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelectedIds);
    onSelectOrganizations(newSelectedIds);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === organizations.length) {
      setSelectedIds([]);
      onSelectOrganizations([]);
    } else {
      const allIds = organizations.map((org) => org.id);
      setSelectedIds(allIds);
      onSelectOrganizations(allIds);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900">
            Organisations ({organizations.length})
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
                  checked={selectedIds.length === organizations.length && organizations.length > 0}
                  onChange={handleSelectAll}
                  disabled={isLoading}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-colors duration-200"
                  aria-label="Sélectionner toutes les organisations"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publicités
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
                    <p className="text-sm text-gray-500">Chargement...</p>
                  </div>
                </td>
              </tr>
            ) : organizations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
                    <p className="text-sm text-gray-500">Aucune organisation trouvée</p>
                  </div>
                </td>
              </tr>
            ) : (
              organizations.map((org) => (
                <tr
                  key={org.id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    selectedIds.includes(org.id) ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(org.id)}
                      onChange={() => handleSelect(org.id)}
                      disabled={isLoading}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-colors duration-200"
                      aria-label={`Sélectionner l'organisation ${org.lastName}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{org.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{org.logo ? 'Oui' : 'Non'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{org.advertissements.length}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(org)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                        title="Modifier"
                        aria-label={`Modifier l'organisation ${org.lastName}`}
                      >
                        <Edit2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onDelete(org)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                        title="Supprimer"
                        aria-label={`Supprimer l'organisation ${org.lastName}`}
                      >
                        <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onViewDetails(org)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                        title="Voir les détails"
                        aria-label={`Voir les détails de l'organisation ${org.lastName}`}
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

export default memo(OrganizationTable);