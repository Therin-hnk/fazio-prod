'use client';

import { memo, useState, useEffect, useCallback } from 'react';
import { Tournament, Event } from '../../types/event';
import { Save, X, AlertCircle, CheckCircle, Link, Calendar, MapPin, FileText } from 'lucide-react';

interface CategoryFormProps {
  tournament?: Tournament;
  onSubmit: (data: {
    name: string;
    description?: string;
    logoUrl?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    eventId: string;
  }) => Promise<void>;
  onCancel: () => void;
}

function CategoryForm({ tournament, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(tournament?.name || '');
  const [description, setDescription] = useState(tournament?.description || '');
  const [image, setImage] = useState(tournament?.logoUrl || '');
  const [startDate, setStartDate] = useState(tournament?.startDate || '');
  const [endDate, setEndDate] = useState(tournament?.endDate || '');
  const [location, setLocation] = useState(tournament?.location || '');
  const [eventId, setEventId] = useState(tournament?.eventId || '');
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (userId) {
          headers['x-user-id'] = userId;
        }
        const res = await fetch('/api/admin/events', { headers });
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des événements');
        }
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      }
    };
    fetchEvents();
  }, []);

  const validateField = useCallback(
    (field: string, value: any) => {
      const errors: Record<string, string> = {};
      switch (field) {
        case 'name':
          if (!value.trim()) {
            errors.name = 'Le nom de la catégorie est requis';
          }
          break;
        case 'image':
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
            errors.eventId = "L'événement est requis";
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

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidDate = (date: string) => {
    return !isNaN(new Date(date).getTime());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const isNameValid = validateField('name', name);
    const isImageValid = validateField('image', image);
    const isStartDateValid = validateField('startDate', startDate);
    const isEndDateValid = validateField('endDate', endDate);
    const isEventIdValid = validateField('eventId', eventId);

    if (!isNameValid || !isImageValid || !isStartDateValid || !isEndDateValid || !isEventIdValid) {
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        logoUrl: image.trim() || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        location: location.trim() || undefined,
        eventId,
      });
      setSuccess(tournament ? 'Catégorie modifiée avec succès' : 'Catégorie créée avec succès');
      setValidationErrors({});
      setTimeout(() => onCancel(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
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
                {tournament ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
              </h2>
              <p className="text-red-100 text-sm">
                {tournament ? 'Mettez à jour les informations' : 'Créez une nouvelle catégorie'}
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
                placeholder="Nom de la catégorie"
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
          {/* <div className="space-y-2">
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
                placeholder="Description de la catégorie"
                rows={4}
              />
            </div>
          </div> */}
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700">
              Image (URL)
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="image"
                type="text"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  validateField('image', e.target.value);
                }}
                className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
                  validationErrors.image
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                }`}
                placeholder="URL de l'image"
                aria-invalid={!!validationErrors.image}
                aria-describedby={validationErrors.image ? 'image-error' : undefined}
              />
              {validationErrors.image && (
                <p id="image-error" className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.image}
                </p>
              )}
            </div>
          </div>
          {/* <div className="space-y-2">
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
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
              Lieu
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-300 transition-all duration-200"
                placeholder="Lieu de la catégorie"
              />
            </div>
          </div> */}
          <div className="space-y-2">
            <label htmlFor="eventId" className="block text-sm font-semibold text-gray-700">
              Événement *
            </label>
            <div className="relative">
              <select
                id="eventId"
                value={eventId}
                onChange={(e) => {
                  setEventId(e.target.value);
                  validateField('eventId', e.target.value);
                }}
                className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
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
              {validationErrors.eventId && (
                <p id="eventId-error" className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.eventId}
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
              aria-label={tournament ? 'Mettre à jour' : 'Créer'}
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
                  {tournament ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(CategoryForm);