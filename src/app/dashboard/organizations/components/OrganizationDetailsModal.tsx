// app/admin/organizations/components/OrganizationDetailsModal.tsx
// Modal pour afficher les détails d'une organisation, similaire à EventDetailsModal.

'use client';

import { memo } from 'react';
import { X, Info, Users } from 'lucide-react';
import { Organization } from '../../types/organization';

interface OrganizationDetailsModalProps {
  organization: Organization;
  onClose: () => void;
}

function OrganizationDetailsModal({ organization, onClose }: OrganizationDetailsModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="details-modal-title"
    >
      <div className="bg-white rounded-lg shadow-2xl mx-auto p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b pb-4">
          <h2 id="details-modal-title" className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Info className="h-6 w-6 text-red-600" aria-hidden="true" />
            {"Détails de l'organisation"} : {organization.firstName} {organization.lastName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-gray-600" aria-hidden="true" />
          </button>
        </div>

        {/* Informations générales */}
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-red-600" aria-hidden="true" />
            Informations générales
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Prénom</dt>
              <dd className="mt-1 text-sm text-gray-900">{organization.firstName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nom</dt>
              <dd className="mt-1 text-sm text-gray-900">{organization.lastName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Sexe</dt>
              <dd className="mt-1 text-sm text-gray-900">{organization.sex === 'M' ? 'Masculin' : 'Féminin'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Logo</dt>
              <dd className="mt-1 text-sm text-gray-900">{organization.logo || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        {/* Publicités */}
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-red-600" aria-hidden="true" />
            Publicités ({organization.advertissements?.length || 0})
          </h3>
          {organization.advertissements?.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune publicité</p>
          ) : (
            <ul className="space-y-3 max-h-40 overflow-y-auto">
              {organization.advertissements.map((ad) => (
                <li
                  key={ad.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-md transition-colors duration-200"
                >
                  <span className="text-sm text-gray-900">{ad.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}

export default memo(OrganizationDetailsModal);