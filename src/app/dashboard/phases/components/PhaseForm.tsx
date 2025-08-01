'use client';

import { memo, useState, useCallback } from 'react';
import { Phase, Tournament, Event } from '../../types/event';
import { Save, X, AlertCircle, CheckCircle, FileText, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface PhaseFormProps {
  phase?: Phase;
  events: Event[];
  tournaments: Tournament[];
  onSubmit: (data: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    tournamentId: string;
    participantIds?: string[];
    order?: number;
  }) => Promise<void>;
  onCancel: () => void;
}

function PhaseForm({ phase, events, tournaments, onSubmit, onCancel }: PhaseFormProps) {
  const formatDateForInput = (date: string | null): string => {
    if (!date) return '';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toISOString().slice(0, 16); // Format YYYY-MM-DDTHH:mm
    } catch {
      return '';
    }
  };

  const [name, setName] = useState(phase?.name || '');
  const [description, setDescription] = useState(phase?.description || '');
  const [startDate, setStartDate] = useState(formatDateForInput(phase!.startDate));
  const [endDate, setEndDate] = useState(formatDateForInput(phase!.endDate));
  const [eventId, setEventId] = useState(phase?.tournament?.eventId || '');
  const [tournamentId, setTournamentId] = useState(phase?.tournamentId || '');
  const [participantIds, setParticipantIds] = useState<string[]>(phase?.participants?.map(p => p.id) || []);
  const [order, setOrder] = useState(phase?.order?.toString() || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);

  const filteredTournaments = eventId
    ? tournaments.filter((tournament) => tournament.eventId === eventId)
    : tournaments;

  const filteredParticipants = eventId
    ? events.find((event) => event.id === eventId)?.participants || []
    : [];

  const validateField = useCallback(
    (field: string, value: any) => {
      const errors: Record<string, string> = {};
      switch (field) {
        case 'name':
          if (!value.trim()) {
            errors.name = 'Le nom de la phase est requis';
          }
          break;
        case 'startDate':
          if (value && !isValidDate(value)) {
            errors.startDate = 'La date de début doit être valide';
          }
          break;
        case 'endDate':
          if (value && !isValidDate(value)) {
            errors.endDate = 'La date de fin doit être valide';
          } else if (value && startDate && new Date(value) <= new Date(startDate)) {
            errors.endDate = 'La date de fin doit être postérieure à la date de début';
          }
          break;
        case 'eventId':
          if (!value) {
            errors.eventId = 'L\'événement est requis';
          }
          break;
        case 'tournamentId':
          if (!value) {
            errors.tournamentId = 'La catégorie est requise';
          }
          break;
        case 'order':
          if (value && (isNaN(value) || Number(value) < 1)) {
            errors.order = 'L\'ordre doit être un nombre positif';
          }
          break;
      }
      setValidationErrors((prev) => ({
        ...prev,
        [field]: errors[field] || '',
      }));
      return !errors[field];
    },
    [startDate]
  );

  const isValidDate = (date: string) => {
    return !isNaN(new Date(date).getTime());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const isNameValid = validateField('name', name);
    const isStartDateValid = validateField('startDate', startDate);
    const isEndDateValid = validateField('endDate', endDate);
    const isEventIdValid = validateField('eventId', eventId);
    const isTournamentIdValid = validateField('tournamentId', tournamentId);
    const isOrderValid = validateField('order', order);

    if (!isNameValid || !isStartDateValid || !isEndDateValid || !isEventIdValid || !isTournamentIdValid || !isOrderValid) {
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        tournamentId,
        participantIds: participantIds.length > 0 ? participantIds : undefined,
        order: order ? Number(order) : undefined,
      });
      setSuccess(phase ? 'Phase modifiée avec succès' : 'Phase créée avec succès');
      setValidationErrors({});
      setTimeout(() => onCancel(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEventId = e.target.value;
    setEventId(newEventId);
    setTournamentId(''); // Réinitialiser la catégorie
    setParticipantIds([]); // Réinitialiser les participants
    validateField('eventId', newEventId);
    validateField('tournamentId', '');
  };

  const handleParticipantToggle = (participantId: string) => {
    setParticipantIds((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {phase ? 'Modifier la phase' : 'Ajouter une phase'}
              </h2>
              <p className="text-red-100 text-sm">
                {phase ? 'Mettez à jour les informations' : 'Créez une nouvelle phase'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200"
            aria-label="Fermer le formulaire"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-6">
        {success && (
          <div
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg animate-pulse"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-sm font-medium text-green-700">{success}</p>
            </div>
          </div>
        )}
        {error && (
          <div
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg"
            aria-live="assertive"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Nom *
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateField('name', e.target.value);
                }}
                className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
                  validationErrors.name
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                }`}
                placeholder="Nom de la phase"
                required
                aria-invalid={!!validationErrors.name}
                aria-describedby={validationErrors.name ? 'name-error' : undefined}
              />
              {validationErrors.name && (
                <p id="name-error" className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.name}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-300 transition-all duration-200"
                placeholder="Description de la phase"
                rows={4}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="eventId" className="block text-sm font-semibold text-gray-700">
              Événement *
            </label>
            <div className="relative">
              <select
                id="eventId"
                value={eventId}
                onChange={handleEventChange}
                className={`w-full pl-4 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
                  validationErrors.eventId
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                } bg-white appearance-none cursor-pointer`}
                required
                aria-invalid={!!validationErrors.eventId}
                aria-describedby={validationErrors.eventId ? 'eventId-error' : undefined}
              >
                <option value="">Sélectionner un événement</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              {validationErrors.eventId && (
                <p id="eventId-error" className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.eventId}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="tournamentId" className="block text-sm font-semibold text-gray-700">
              Catégorie *
            </label>
            <div className="relative">
              <select
                id="tournamentId"
                value={tournamentId}
                onChange={(e) => {
                  setTournamentId(e.target.value);
                  validateField('tournamentId', e.target.value);
                }}
                className={`w-full pl-4 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
                  validationErrors.tournamentId
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                } bg-white appearance-none cursor-pointer`}
                required
                disabled={!eventId || filteredTournaments.length === 0}
                aria-invalid={!!validationErrors.tournamentId}
                aria-describedby={validationErrors.tournamentId ? 'tournamentId-error' : undefined}
              >
                <option value="">Sélectionner une catégorie</option>
                {filteredTournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              {validationErrors.tournamentId && (
                <p id="tournamentId-error" className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.tournamentId}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="order" className="block text-sm font-semibold text-gray-700">
              Ordre
            </label>
            <div className="relative">
              <input
                id="order"
                type="number"
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value);
                  validateField('order', e.target.value);
                }}
                className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
                  validationErrors.order
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                }`}
                placeholder="Entrez l'ordre de la phase (ex. 1, 2, 3)"
                min="1"
                aria-invalid={!!validationErrors.order}
                aria-describedby={validationErrors.order ? 'order-error' : undefined}
              />
              {validationErrors.order && (
                <p id="order-error" className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.order}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Participants
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsParticipantListOpen(!isParticipantListOpen)}
                className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl bg-white text-left flex items-center justify-between hover:border-red-300 transition-all duration-200"
                aria-expanded={isParticipantListOpen}
                disabled={!eventId || filteredParticipants.length === 0}
              >
                <span className="text-sm text-gray-900">
                  {participantIds.length > 0
                    ? `${participantIds.length} participant(s) sélectionné(s)`
                    : 'Sélectionner des participants'}
                </span>
                {isParticipantListOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {isParticipantListOpen && (
                <div className="mt-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl bg-white">
                  {filteredParticipants.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">Aucun participant disponible pour cet événement</p>
                  ) : (
                    filteredParticipants.map((participant) => (
                      <label
                        key={participant.id}
                        className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={participantIds.includes(participant.id)}
                          onChange={() => handleParticipantToggle(participant.id)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          aria-label={`Sélectionner ${participant.firstName} ${participant.lastName}`}
                        />
                        <span className="text-sm text-gray-900">
                          {participant.firstName} {participant.lastName}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">Sélectionnez les participants associés à cette phase.</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">
              Date de début
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  validateField('startDate', e.target.value);
                  if (endDate) validateField('endDate', endDate);
                }}
                className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
                  validationErrors.startDate
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                }`}
                aria-invalid={!!validationErrors.startDate}
                aria-describedby={validationErrors.startDate ? 'startDate-error' : undefined}
              />
              {validationErrors.startDate && (
                <p id="startDate-error" className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.startDate}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700">
              Date de fin
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  validateField('endDate', e.target.value);
                }}
                className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
                  validationErrors.endDate
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                }`}
                aria-invalid={!!validationErrors.endDate}
                aria-describedby={validationErrors.endDate ? 'endDate-error' : undefined}
              />
              {validationErrors.endDate && (
                <p id="endDate-error" className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.endDate}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Annuler le formulaire"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label={phase ? 'Mettre à jour' : 'Créer'}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Traitement...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {phase ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(PhaseForm);