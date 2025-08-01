'use client';

import { memo } from 'react';
import { Tournament } from '../../types/event';
import { X, Trash2 } from 'lucide-react';

interface DeleteCategoryModalProps {
  tournament: Tournament | null;
  selectedTournamentCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteCategoryModal({ tournament, selectedTournamentCount, onConfirm, onCancel }: DeleteCategoryModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Confirmer la suppression</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 rounded-lg p-2 transition-colors duration-200"
            aria-label="Fermer le modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {selectedTournamentCount > 1
              ? `Voulez-vous vraiment supprimer ${selectedTournamentCount} catégories ? Cette action est irréversible.`
              : tournament
              ? `Voulez-vous vraiment supprimer la catégorie "${tournament.name}" ? Cette action est irréversible.`
              : 'Voulez-vous vraiment supprimer la catégorie sélectionnée ? Cette action est irréversible.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            aria-label="Annuler"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 sm:flex-none px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            aria-label="Supprimer"
          >
            <Trash2 className="h-5 w-5" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(DeleteCategoryModal);