import React, { useMemo, useState } from 'react'; // Ajouter useState
import ParticipantCard from './ParticipantCard';
import { Event, Phase, Participant, Tournament, Vote } from '@/app/dashboard/types/event';
import driveImageLoader from '@/app/lib/driveImageLoader';

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
  // État pour gérer l'affichage du loader
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour gérer le vote
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    return headers;
  };

  const handleVote = async (participantId: string, voteCount: number, price: number, tournamentId: string | undefined, phaseId: string | undefined) => {
    setIsLoading(true); // Activer le loader au début du vote
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

      // get current url
      const currentUrl = window.location.href;

      // Étape 1 : Créer la collecte via l'API FedaPay
      const createTransactionResponse = await fetch(
        '/api/public/createTransactions', // Remplacez par l'URL de votre API
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

      // Étape 3 : Rediriger l'utilisateur vers la page de paiement
      const paymentUrl = transactionData["v1/transaction"]["payment_url"];
      window.location.href = paymentUrl;
    } finally {
      setIsLoading(false); // Désactiver le loader à la fin, même en cas d'erreur
    }
  };

  // Filtrer les participants de la phase en cours
  const phaseParticipants = currentPhase?.participants || [];

  console.log('Phase participants:', currentPhase);

  return (
    <div className="relative">
      {/* Loader affiché conditionnellement */}
      {isLoading && (
        <div className="fixed w-full h-full inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100000]">
          <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {phaseParticipants.map((participant) => {
          return (
            <ParticipantCard
              key={participant.id}
              id={participant.id}
              name={`${participant.firstName} ${participant.lastName}`}
              description={participant.description || 'Aucune description disponible'}
              image={driveImageLoader({ src: participant.avatarUrl || ""})}
              votePrice={tournament!.event!.votePrice}
              totalVotes={participant.totalVotes || 0}
              phaseId={currentPhase?.id || ''}
              tournamentId={tournament.id}
              youtubeLinks={
                participant.videos?.map((video) => video.url) || []
              }
              onVote={handleVote}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantsSection; 