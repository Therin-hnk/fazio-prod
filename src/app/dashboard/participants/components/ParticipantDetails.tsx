'use client';

import { Participant } from '../../types/participant';
import Image from 'next/image';
import { X } from 'lucide-react';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface ParticipantDetailsProps {
  participant: Participant;
  onClose: () => void;
}

function ParticipantDetails({ participant, onClose }: ParticipantDetailsProps) {
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

  const totalVotes = participant.votes.reduce((total, vote) => total + vote.voteCount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Détails du participant : {participant.firstName} {participant.lastName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="Fermer les détails"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Prénom</h3>
            <p className="text-sm text-gray-900">{participant.firstName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Nom</h3>
            <p className="text-sm text-gray-900">{participant.lastName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Description</h3>
            <p className="text-sm text-gray-900">{participant.description || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Matricule</h3>
            <p className="text-sm text-gray-900">{participant.matricule || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Date de naissance</h3>
            <p className="text-sm text-gray-900">{formatDate(participant.birthDate as string)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Événement</h3>
            <p className="text-sm text-gray-900">{participant.event?.name || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Mot de passe</h3>
            <p className="text-sm text-gray-900 font-mono">{participant.password}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">URL de l’avatar</h3>
            {participant.avatarUrl ? (
              <Image
                src={participant.avatarUrl}
                alt={`Avatar de ${participant.firstName} ${participant.lastName}`}
                className="h-16 w-16 object-cover rounded-full"
              />
            ) : (
              <p className="text-sm text-gray-900">N/A</p>
            )}
          </div>
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-700">Votes ({totalVotes})</h3>
            {participant.votes.length > 0 ? (
              <ul className="text-sm text-gray-900 list-disc pl-5">
                {participant.votes.map((vote) => (
                  <li key={vote.id}>
                    Vote ID: {vote.id}, Nombre de votes: {vote.voteCount}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-900">Aucun vote</p>
            )}
          </div>
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-700">Vidéos</h3>
            {participant.videos.length > 0 ? (
              <ul className="text-sm text-gray-900 list-disc pl-5">
                {participant.videos.map((video) => (
                  <li key={video.id}>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {video.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-900">Aucune vidéo</p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParticipantDetails;