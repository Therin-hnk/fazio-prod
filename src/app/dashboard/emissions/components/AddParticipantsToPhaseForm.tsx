'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { Event } from '../../types/event';
import ParticipantSelector from './ParticipantSelector';
import ErrorAlert from './ErrorAlert';

interface AddParticipantsToPhaseFormProps {
  event: Event;
  onAddParticipantToPhase: (phaseId: string, userId: string) => Promise<void>;
}

function AddParticipantsToPhaseForm({ event, onAddParticipantToPhase }: AddParticipantsToPhaseFormProps) {
  const [participantForm, setParticipantForm] = useState({
    phaseId: '',
    selectedParticipantIds: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const handleParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantForm.phaseId) {
      setError('Veuillez sélectionner une phase');
      return;
    }
    if (!participantForm.selectedParticipantIds.length) {
      setError('Veuillez sélectionner au moins un participant');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      for (const userId of participantForm.selectedParticipantIds) {
        await onAddParticipantToPhase(participantForm.phaseId, userId);
      }
      setParticipantForm({ phaseId: '', selectedParticipantIds: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAddParticipants = async () => {
    if (!participantForm.phaseId) {
      setError('Veuillez sélectionner une phase');
      return;
    }
    if (!event.participants?.length) {
      setError('Aucun participant disponible pour cet événement');
      return;
    }
    setBulkLoading(true);
    setError(null);
    try {
      for (const participant of event.participants) {
        await onAddParticipantToPhase(participantForm.phaseId, participant.id);
      }
      setParticipantForm({ phaseId: '', selectedParticipantIds: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l’association des participants');
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-red-600" aria-hidden="true" />
        Associer des participants à une phase
      </h3>
      {error && <ErrorAlert message={error} />}
      <form onSubmit={handleParticipantSubmit} className="space-y-5">
        <div>
          <label htmlFor="phaseSelect" className="block text-sm font-medium text-gray-700">
            Phase *
          </label>
          <select
            id="phaseSelect"
            value={participantForm.phaseId}
            onChange={(e) => setParticipantForm({ ...participantForm, phaseId: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-colors duration-200 sm:text-sm"
            required
            aria-required="true"
          >
            <option value="">Sélectionner une phase</option>
            {event.tournaments?.[0]?.phases?.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.name}
              </option>
            ))}
          </select>
        </div>
        <ParticipantSelector
          participants={event.participants || []}
          selectedParticipantIds={participantForm.selectedParticipantIds}
          onSelectParticipant={(userId) =>
            setParticipantForm((prev) => {
              const newSelected = prev.selectedParticipantIds.includes(userId)
                ? prev.selectedParticipantIds.filter((id) => id !== userId)
                : [...prev.selectedParticipantIds, userId];
              return { ...prev, selectedParticipantIds: newSelected };
            })
          }
          onSelectAll={(e) =>
            setParticipantForm({
              ...participantForm,
              selectedParticipantIds: e.target.checked ? event.participants?.map((p) => p.id) || [] : [],
            })
          }
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || bulkLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Associer les participants sélectionnés"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Users className="h-5 w-5" aria-hidden="true" />
                Associer
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleBulkAddParticipants}
            disabled={bulkLoading || loading || !participantForm.phaseId || !event.participants?.length}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Associer tous les participants"
          >
            {bulkLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Users className="h-5 w-5" aria-hidden="true" />
                Associer tous
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddParticipantsToPhaseForm;
