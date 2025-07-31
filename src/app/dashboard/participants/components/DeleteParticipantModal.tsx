'use client';

import { Participant } from '../../types/participant';
import { X } from 'lucide-react';

interface DeleteParticipantModalProps {
  participant: Participant;
  onConfirm: () => void;
  onClose: () => void;
}

function DeleteParticipantModal({ participant, onConfirm, onClose }: DeleteParticipantModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Supprimer le participant</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="Fermer la modale"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Êtes-vous sûr de vouloir supprimer le participant{' '}
          <strong>
            {participant.firstName} {participant.lastName}
          </strong>
          ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteParticipantModal;