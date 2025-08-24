'use client';

import React, { useState, useEffect } from 'react';
import ParticipantCard from './ParticipantCard';
import ParticipantDetailsOverlay from './ParticipantDetailsOverlay';
import { Event, Participant, Tournament } from '@/app/dashboard/types/event';
import driveImageLoader from '@/app/lib/driveImageLoader';
import { Search } from 'lucide-react';

interface ParticipantsSectionProps {
  emissionData: Event;
  currentParticipantId?: string;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
  emissionData,
  currentParticipantId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLearnMoreOverlay, setShowLearnMoreOverlay] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fonction pour gérer le vote
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    return headers;
  };

  const handleVote = async (participantId: string, voteCount: number, price: number, tournamentId: string | undefined, phaseId: string | undefined) => {
    setIsLoading(true);
    try {
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

      const paymentUrl = transactionData["v1/transaction"]["payment_url"];
      window.location.href = paymentUrl;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour gérer l'affichage des détails du participant
  const handleLearnMore = (participantId: string) => {
    setShowLearnMoreOverlay(participantId);
  };

  // Détection du paramètre currentParticipantId au chargement
  useEffect(() => {
    if (currentParticipantId && !showLearnMoreOverlay) {
      // Vérifier si l'ID du participant existe dans emissionData
      const participantExists = emissionData.tournaments
        .flatMap(tournament => tournament.phases.flatMap(phase => phase.participants))
        .some(participant => participant.id === currentParticipantId);
      if (participantExists) {
        handleLearnMore(currentParticipantId);
      } else {
        console.warn(`Participant avec l'ID ${currentParticipantId} non trouvé.`);
      }
    }
  }, [currentParticipantId, emissionData]);

  // Trouver le participant sélectionné pour l'overlay
  const selectedParticipant = emissionData.tournaments
    .flatMap(tournament => tournament.phases.flatMap(phase => phase.participants))
    .find(participant => participant.id === showLearnMoreOverlay);

  // Extraire les participants uniques par tournoi avec filtrage par recherche
  const getTournamentParticipants = (tournament: Tournament): Participant[] => {
    const participantMap = new Map<string, Participant>();
    tournament.phases.forEach(phase => {
      phase.participants.forEach(participant => {
        if (!participantMap.has(participant.id)) {
          const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
          if (!searchQuery || fullName.includes(searchQuery.toLowerCase())) {
            participantMap.set(participant.id, participant);
          }
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
        <div className="fixed w-full h-full inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100000000000]">
          <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Overlay des détails du participant */}
      {showLearnMoreOverlay && selectedParticipant && (
        <ParticipantDetailsOverlay
          participant={selectedParticipant}
          votePrice={emissionData.votePrice || 0}
          tournamentId={emissionData.tournaments.find(t => t.phases.some(p => p.participants.some(p => p.id === selectedParticipant.id)))?.id}
          phaseId={getActivePhaseId(emissionData.tournaments.find(t => t.phases.some(p => p.participants.some(p => p.id === selectedParticipant.id)))!)}
          onVote={handleVote}
          onClose={() => setShowLearnMoreOverlay(null)}
          isAvailable={emissionData.tournaments.some(tournament =>
            tournament.phases.some(phase =>
              phase.participants.some(p => p.id === selectedParticipant.id) &&
              (() => {
                const now = new Date();
                const start = phase.startDate ? new Date(phase.startDate) : null;
                const end = phase.endDate ? new Date(phase.endDate) : null;
                return start && end && now >= start && now <= end;
              })()
            )
          )}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un participant..."
              className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              aria-label="Rechercher un participant par nom"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {emissionData?.tournaments.map(tournament => {
          const participants = getTournamentParticipants(tournament);
          return (
            <div key={tournament.id} className="mb-12">
              {tournament.phases.length > 0 && participants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {participants.map(participant => (
                  <ParticipantCard
                    key={participant.id}
                    id={participant.id}
                    name={`${participant.firstName} ${participant.lastName}`}
                    description={participant.description || ''}
                    image={driveImageLoader({ src: participant.avatarUrl || "" })}
                    votePrice={emissionData.votePrice || 0}
                    totalVotes={participant.totalVotes || 0}
                    phaseId={getActivePhaseId(tournament)}
                    tournamentId={tournament.id}
                    youtubeLinks={participant.videos?.map(video => video.url) || []}
                    onVote={handleVote}
                    onLearnMore={handleLearnMore}
                    isAvailable={
                      tournament.phases.some((phase) => {
                        const now = new Date();
                        const start = phase.startDate ? new Date(phase.startDate) : null;
                        const end = phase.endDate ? new Date(phase.endDate) : null;
                        // Le participant est disponible si la phase est en cours ET qu'il est dans cette phase
                        return start && end && now >= start && now <= end && phase.participants.some(p => p.id === participant.id);
                      })
                    }
                  />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm text-center">
                  {searchQuery ? 'Aucun participant trouvé pour cette recherche.' : 'Aucune phase disponible pour ce tournoi.'}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantsSection;