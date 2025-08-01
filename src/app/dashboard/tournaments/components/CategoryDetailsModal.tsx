'use client';

import { memo } from 'react';
import { Tournament } from '../../types/event';
import { X } from 'lucide-react';

interface CategoryDetailsModalProps {
  tournament: Tournament;
  onClose: () => void;
  onAddPhase: (tournamentId: string, phase: any) => Promise<void>;
  onAddParticipantToPhase: (phaseId: string, participantId: string) => Promise<void>;
}


function CategoryDetailsModal({ tournament, onClose }: CategoryDetailsModalProps) {

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Détails de la catégorie : {tournament.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-lg p-2 transition-colors duration-200"
            aria-label="Fermer le modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Nom</p>
                <p className="text-sm text-gray-900">{tournament.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Événement</p>
                <p className="text-sm text-gray-900">{tournament.event?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Image</p>
                {tournament.logoUrl ? (
                  <a href={tournament.logoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {"Voir l'image"}
                  </a>
                ) : (
                  <p className="text-sm text-gray-900">N/A</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CategoryDetailsModal);