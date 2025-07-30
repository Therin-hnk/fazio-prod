import React, { useMemo } from 'react';
import ParticipantCard from './ParticipantCard';
import { Event, Phase, Participant, Tournament, Vote } from '@/app/dashboard/types/event';
import driveImageLoader from '@/app/lib/driveImageLoader';

import { useKKiaPay } from 'kkiapay-react';

interface ParticipantsSectionProps {
  currentPhase: Phase | null | undefined;
  participants: Participant[];
  tournament: Tournament;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
  currentPhase,
  participants,
  tournament,
}) => {
  const {openKkiapayWidget} = useKKiaPay();
  // Fonction pour gérer le vote
  const handleVote = async (participantId: string, voteCount: number, price: number) => {
    openKkiapayWidget({
      amount: price,
      sandbox: true,
      api_key: process.env.NEXT_PUBLIC_KKPAY_PUBLIC || '',
      data: participantId
    })
  };

  // Filtrer les participants de la phase en cours
  const phaseParticipants = currentPhase?.participants || [];

  console.log('Phase participants:', currentPhase);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {phaseParticipants.map((participant) => {
        return (
          <ParticipantCard
            key={participant.id}
            id={participant.id}
            name={`${participant.firstName} ${participant.lastName}`}
            description={participant.description || 'Aucune description disponible'}
            image={driveImageLoader({ src: participant.avatarUrl || ""})}
            votePrice={tournament.votePrice}
            totalVotes={participant.totalVotes || 0}
            youtubeLinks={
              participant.videos?.map((video) => video.url) || []
            }
            onVote={handleVote}
          />
        );
      })}
    </div>
  );
};

export default ParticipantsSection;