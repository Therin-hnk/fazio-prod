import React, { useState } from 'react';
import ParticipantCard from './ParticipantCard';
import { Event, Participant, Tournament } from '@/app/dashboard/types/event';
import driveImageLoader from '@/app/lib/driveImageLoader';

interface ParticipantsSectionProps {
  emissionData: Event;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
  emissionData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  console.log("emiison data fetched", emissionData);

  // Fonction pour gérer le vote (inchangée)
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    return headers;
  };

  const handleVote = async (participantId: string, voteCount: number, price: number, tournamentId: string | undefined, phaseId: string | undefined) => {
    setIsLoading(true);
    try {
      console.log('Vote details:', {
        participantId,
        voteCount,
        price,
        tournamentId,
        phaseId,
      });
      const response = await fetch("/api/public/payments/create", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          participantId,
          voteCount,
          amount: price,
          tournamentId,
          phaseId,
        }),
      });

      const data = await response.json();
      console.log(data);

      const currentUrl = window.location.href;
      const createTransactionResponse = await fetch(
        '/api/public/createTransactions',
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            description: `Vote pour le participant ${participantId} dans le tournoi ${tournamentId}`,
            amount: price,
            currency: { iso: 'XOF' },
            callback_url: currentUrl,
            customer: {
              email: 'fazioprod.inter@gmail.com',
            },
            merchant_reference: `VOTE-${tournamentId}-${participantId}-${Date.now()}`,
            custom_metadata: {
              participantId,
              voteCount,
              tournamentId,
              phaseId,
              paymentId: data.payment.id
            },
          }),
        }
      );

      const transactionData = await createTransactionResponse.json();

      if (!createTransactionResponse.ok) {
        throw new Error(`Erreur lors de la création de la collecte : ${transactionData.message || 'Erreur inconnue'}`);
      }

      console.log('Transaction créée :', transactionData);
      const paymentUrl = transactionData["v1/transaction"]["payment_url"];
      window.location.href = paymentUrl;
    } finally {
      setIsLoading(false);
    }
  };

  // Extraire les participants uniques par tournoi
  const getTournamentParticipants = (tournament: Tournament): Participant[] => {
    const participantMap = new Map<string, Participant>();
    tournament.phases.forEach(phase => {
      phase.participants.forEach(participant => {
        if (!participantMap.has(participant.id)) {
          participantMap.set(participant.id, participant);
        }
      });
    });
    return Array.from(participantMap.values());
  };

  // Trouver la première phase active d'un tournoi (pour vote)
  const getActivePhaseId = (tournament: Tournament): string | undefined => {
    const now = new Date();
    for (const phase of tournament.phases) {
      const start = phase.startDate ? new Date(phase.startDate) : null;
      const end = phase.endDate ? new Date(phase.endDate) : null;
      if (start && end && now >= start && now <= end) {
        return phase.id;
      }
    }
    return tournament.phases[0]?.id; // Fallback : première phase si aucune active
  };

  return (
    <div className="relative">
      {/* Loader */}
      {isLoading && (
        <div className="fixed w-full h-full inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100000]">
          <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {emissionData?.tournaments.map(tournament => (
          <div key={tournament.id} className="mb-12">
            {tournament.phases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTournamentParticipants(tournament).map(participant => (
                  <ParticipantCard
                    key={participant.id}
                    id={participant.id}
                    name={`${participant.firstName} ${participant.lastName}`}
                    description={participant.description || 'Aucune description disponible'}
                    image={driveImageLoader({ src: participant.avatarUrl || "" })}
                    votePrice={emissionData.votePrice || 0}
                    totalVotes={participant.totalVotes || 0}
                    phaseId={getActivePhaseId(tournament)}
                    tournamentId={tournament.id}
                    youtubeLinks={participant.videos?.map(video => video.url) || []}
                    onVote={handleVote}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Aucune phase disponible pour ce tournoi.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsSection;