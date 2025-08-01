'use client';

import { memo } from 'react';
import { Phase } from '../../types/event';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PhaseDetailsModalProps {
  phase: Phase;
  onClose: () => void;
}

function PhaseDetailsModal({ phase, onClose }: PhaseDetailsModalProps) {
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

  const getParticipantName = (participantId: string): string => {
    const participant = phase.participants?.find((p) => p.id === participantId);
    return participant ? `${participant.firstName} ${participant.lastName}` : participantId;
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Détails de la phase : {phase.name}</h2>
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
                <p className="text-sm text-gray-900">{phase.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Catégorie</p>
                <p className="text-sm text-gray-900">{phase.tournament?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Événement</p>
                <p className="text-sm text-gray-900">{phase.tournament?.event?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Description</p>
                <p className="text-sm text-gray-900">{phase.description || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Date de début</p>
                <p className="text-sm text-gray-900">{formatDate(phase.startDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Date de fin</p>
                <p className="text-sm text-gray-900">{formatDate(phase.endDate)}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
            {phase.participants && phase.participants.length > 0 ? (
              <div className="mt-2">
                <ul className="text-sm text-gray-900 list-disc pl-5">
                  {phase.participants.map((participant) => (
                    <li key={participant.id}>
                      {participant.firstName} {participant.lastName} (Votes: {participant.totalVotes || 0})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucun participant</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Votes</h3>
            {phase.votes && phase.votes.length > 0 ? (
              <div className="mt-2">
                <ul className="text-sm text-gray-900 list-disc pl-5">
                  {phase.votes.map((vote) => (
                    <li key={`${vote.participantId}-${vote.phaseId}`}>
                      {getParticipantName(vote.participantId)} (Nombre de votes: {vote.voteCount})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucun vote</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PhaseDetailsModal);