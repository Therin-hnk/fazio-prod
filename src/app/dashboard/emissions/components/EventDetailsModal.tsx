'use client';

import { memo } from 'react';
import Image from 'next/image';
import { X, Info, Video, Trophy, Users } from 'lucide-react';
import { Event } from '../../types/event';
import AddPhaseForm from './AddPhaseForm';
import AddParticipantsToPhaseForm from './AddParticipantsToPhaseForm';
import VideoPlayer from '@/app/components/VideoPlayer';
import driveImageLoader from '@/app/lib/driveImageLoader';

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
  onAddPhase: (tournamentId: string, phase: any) => Promise<void>;
  onAddParticipantToPhase: (phaseId: string, userId: string) => Promise<void>;
}

function EventDetailsModal({ event, onClose, onAddPhase, onAddParticipantToPhase }: EventDetailsModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) return onClose();
  };

  const getParticipantName = (participant: { firstName?: string; lastName?: string; username?: string }) => {
    return participant.firstName && participant.lastName
      ? `${participant.firstName} ${participant.lastName}`
      : participant.username || 'N/A';
  };

  console.log('Rendering EventDetailsModal for event:', event);

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
            {"Détails de l'événement"} : {event.name}
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
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{event.description || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date de début</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {event.startDate ? new Date(event.startDate).toLocaleDateString('fr-FR') : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date de fin</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {event.endDate ? new Date(event.endDate).toLocaleDateString('fr-FR') : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Lieu</dt>
              <dd className="mt-1 text-sm text-gray-900">{event.location || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Statut</dt>
              <dd className="mt-1 text-sm text-gray-900">{event.status || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        {/* Vidéos */}
        {event.videos?.length > 0 && (
          <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Video className="h-5 w-5 text-red-600" aria-hidden="true" />
              Vidéos
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              
              {event.videos.map((video, index) => (
                <div key={index} className="w-full aspect-video rounded-lg overflow-hidden shadow-sm">
                  {/* <p>{video.url}</p> */}
                  <VideoPlayer
                    youtubeUrl={video.url}
                    title={`Vidéo de ${event.name}`}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Participants */}
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-red-600" aria-hidden="true" />
            Participants ({event.participants?.length || 0})
          </h3>
          {event.participants?.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun participant</p>
          ) : (
            <ul className="space-y-3 max-h-40 overflow-y-auto">
              {event.participants.map((participant) => (
                <li
                  key={participant.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-md transition-colors duration-200"
                >
                  <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {participant.avatarUrl ? (
                      <Image
                        src={driveImageLoader({ src: participant.avatarUrl || '' })}
                        alt={`Avatar de ${getParticipantName(participant)}`}
                        className="object-cover w-[40px] h-[40px]"
                        width={20}
                        height={20}
                        quality={75}
                        loading="lazy"
                      />
                    ) : (
                      <Users className="w-full h-full text-gray-400 p-1" aria-hidden="true" />
                    )}
                  </div>
                  <span className="text-sm text-gray-900">{getParticipantName(participant)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tournoi par défaut */}
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-red-600" aria-hidden="true" />
            Tournoi : {event.tournaments?.[0]?.name || 'N/A'}
          </h3>
          {event.tournaments?.[0]?.phases?.length ? (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Phases</h4>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {event.tournaments[0].phases.map((phase) => (
                  <li
                    key={phase.id}
                    className="text-sm text-gray-900 p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    {phase.name} ({phase.participants?.length || 0} participants)
                    {phase.startDate &&
                      ` - Début: ${new Date(phase.startDate).toLocaleDateString('fr-FR')}`}
                    {phase.endDate && ` - Fin: ${new Date(phase.endDate).toLocaleDateString('fr-FR')}`}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucune phase définie</p>
          )}
        </div>

        {/* Formulaire pour ajouter une phase */}
        {/* <AddPhaseForm
          event={event}
          onAddPhase={onAddPhase}
        /> */}

        {/* Formulaire pour associer des participants à une phase */}
        {/* {event.tournaments?.[0]?.phases?.length > 0 && (
          <AddParticipantsToPhaseForm
            event={event}
            onAddParticipantToPhase={onAddParticipantToPhase}
          />
        )} */}

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

export default memo(EventDetailsModal);