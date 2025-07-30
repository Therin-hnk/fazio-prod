'use client';

interface Participant {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

interface ParticipantSelectorProps {
  participants: Participant[];
  selectedParticipantIds: string[];
  onSelectParticipant: (userId: string) => void;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ParticipantSelector({
  participants,
  selectedParticipantIds,
  onSelectParticipant,
  onSelectAll,
}: ParticipantSelectorProps) {
  const getParticipantName = (participant: Participant) => {
    return participant.firstName && participant.lastName
      ? `${participant.firstName} ${participant.lastName}`
      : participant.username || 'N/A';
  };

  return (
    <div>
      {participants.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun participant disponible</p>
      ) : (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          <label className="flex items-center gap-2 text-sm text-gray-900">
            <input
              type="checkbox"
              checked={selectedParticipantIds.length === participants.length && participants.length > 0}
              onChange={onSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            Tout sélectionner
          </label>
          {participants.map((participant) => (
            <label key={participant.id} className="flex items-center gap-2 text-sm text-gray-900">
              <input
                type="checkbox"
                checked={selectedParticipantIds.includes(participant.id)}
                onChange={() => onSelectParticipant(participant.id)}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              {getParticipantName(participant)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default ParticipantSelector;