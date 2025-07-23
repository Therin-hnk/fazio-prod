'use client';

import { memo, useState } from 'react';
import { Event } from '../../types/event';
import { Trash2, AlertTriangle, X, AlertCircle } from 'lucide-react';

interface DeleteEventModalProps {
  event: Event | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

function DeleteEventModal({ event, onConfirm, onCancel }: DeleteEventModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!event) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const isMultipleEvents = !event.id;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 id="delete-modal-title" className="text-xl font-bold text-gray-900">
              Confirmer la suppression
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            disabled={isLoading}
            aria-label="Fermer la modale"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg" aria-live="assertive">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            </div>
          )}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <p id="delete-modal-description" className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {isMultipleEvents ? (
                'Voulez-vous vraiment supprimer les émissions sélectionnées ?'
              ) : (
                <>
                  {`Voulez-vous vraiment supprimer l'émission `}
                  <span className="font-semibold text-gray-900">{event.name}</span> ?
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">Cette action est irréversible.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 p-6 bg-gray-50 rounded-b-lg">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
            aria-label="Annuler la suppression"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
            aria-label="Confirmer la suppression"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Suppression...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 w-4" />
                <span>Supprimer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(DeleteEventModal);