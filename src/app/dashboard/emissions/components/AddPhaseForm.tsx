'use client';

import { useState } from 'react';
import { Plus, Calendar, FileText, SortAsc } from 'lucide-react';
import { Event } from '../../types/event';
import ParticipantSelector from './ParticipantSelector';
import ErrorAlert from './ErrorAlert';

interface AddPhaseFormProps {
  event: Event;
  onAddPhase: (tournamentId: string, phase: any) => Promise<void>;
}

function AddPhaseForm({ event, onAddPhase }: AddPhaseFormProps) {
  const [phaseForm, setPhaseForm] = useState({
    name: '',
    order: '',
    startDate: '',
    endDate: '',
    description: '',
    selectedParticipantIds: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseForm.name.trim()) {
      setError('Le nom de la phase est requis');
      return;
    }
    if (!phaseForm.order || parseInt(phaseForm.order) < 1) {
      setError('L\'ordre de la phase doit être un nombre positif');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const tournamentId = event.tournaments?.[0]?.id;
      if (!tournamentId) {
        throw new Error('Aucun tournoi trouvé pour cet événement');
      }

      const isoStartDate = phaseForm.startDate ? new Date(phaseForm.startDate).toISOString() : undefined;
      const isoEndDate = phaseForm.endDate ? new Date(phaseForm.endDate).toISOString() : undefined;
      await onAddPhase(tournamentId, {
        name: phaseForm.name,
        order: parseInt(phaseForm.order),
        startDate: isoStartDate || null,
        endDate: isoEndDate || null,
        description: phaseForm.description || null,
        participantIds: phaseForm.selectedParticipantIds,
      });
      
      setPhaseForm({ name: '', order: '', startDate: '', endDate: '', description: '', selectedParticipantIds: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Plus className="h-6 w-6 text-red-500" aria-hidden="true" />
        Ajouter une phase
      </h3>
      {error && <ErrorAlert message={error} />}
      <form onSubmit={handlePhaseSubmit} className="space-y-6">
        {/* Section Métadonnées */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Métadonnées de la phase</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label htmlFor="phaseName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la phase *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  id="phaseName"
                  type="text"
                  value={phaseForm.name}
                  onChange={(e) => setPhaseForm({ ...phaseForm, name: e.target.value })}
                  className="p-3 pl-10 w-full outline-none rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-colors duration-300 text-sm placeholder-gray-400"
                  placeholder="Ex: Phase de qualification"
                  required
                  aria-required="true"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="phaseOrder" className="block text-sm font-medium text-gray-700 mb-2">
                Ordre de la phase *
              </label>
              <div className="relative">
                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  id="phaseOrder"
                  type="number"
                  min="1"
                  value={phaseForm.order}
                  onChange={(e) => setPhaseForm({ ...phaseForm, order: e.target.value })}
                  className="p-3 pl-10 w-full outline-none rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-colors duration-300 text-sm placeholder-gray-400"
                  placeholder="Ex: 1"
                  required
                  aria-required="true"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="phaseStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  id="phaseStartDate"
                  type="date"
                  value={phaseForm.startDate}
                  onChange={(e) => setPhaseForm({ ...phaseForm, startDate: e.target.value })}
                  className="p-3 pl-10 w-full outline-none rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-colors duration-300 text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="phaseEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  id="phaseEndDate"
                  type="date"
                  value={phaseForm.endDate}
                  onChange={(e) => setPhaseForm({ ...phaseForm, endDate: e.target.value })}
                  className="p-3 pl-10 w-full outline-none rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-colors duration-300 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="phaseDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="phaseDescription"
              value={phaseForm.description}
              onChange={(e) => setPhaseForm({ ...phaseForm, description: e.target.value })}
              className="p-3 outline-none w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-colors duration-300 text-sm placeholder-gray-400"
              placeholder="Décrivez la phase (optionnel)"
              rows={4}
            />
          </div>
        </div>

        {/* Section Participants */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Participants</h4>
          <ParticipantSelector
            participants={event.participants || []}
            selectedParticipantIds={phaseForm.selectedParticipantIds}
            onSelectParticipant={(userId) =>
              setPhaseForm((prev) => {
                const newSelected = prev.selectedParticipantIds.includes(userId)
                  ? prev.selectedParticipantIds.filter((id) => id !== userId)
                  : [...prev.selectedParticipantIds, userId];
                return { ...prev, selectedParticipantIds: newSelected };
              })
            }
            onSelectAll={(e) =>
              setPhaseForm({
                ...phaseForm,
                selectedParticipantIds: e.target.checked ? event.participants?.map((p) => p.id) || [] : [],
              })
            }
          />
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            aria-label="Ajouter la phase"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5" aria-hidden="true" />
                Ajouter la phase
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPhaseForm;