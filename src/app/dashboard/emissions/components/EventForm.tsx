'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event, Organizer } from '../../types/event';
import { Calendar, FileText, User, CheckCircle, AlertCircle, X, Save, Loader2 } from 'lucide-react';

interface EventFormProps {
  event?: Event;
  onSubmit: (data: {
    name: string;
    description?: string;
    organizerId: string;
    status?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [name, setName] = useState(event?.name || '');
  const [description, setDescription] = useState(event?.description || '');
  const [organizerId, setOrganizerId] = useState(event?.organizerId || '');
  const [status, setStatus] = useState<string>(event?.status || 'active');
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [organizersLoading, setOrganizersLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  useEffect(() => {
    const loadOrganizers = async () => {
      setOrganizersLoading(true);
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (userId) {
          headers['x-user-id'] = userId;
        }
        const res = await fetch('/api/manager/v1/users/get', { headers });
        if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrganizers(data);
          if (!event && data.length > 0) {
            setOrganizerId(data[0].id);
          }
        } else {
          throw new Error('Format de données invalide');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger les organisateurs');
      } finally {
        setOrganizersLoading(false);
      }
    };
    loadOrganizers();
  }, [event, userId]);

  const validateField = useCallback((field: string, value: string) => {
    const errors: Record<string, string> = {};
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Le nom de l\'événement est requis';
        } else if (value.length < 3) {
          errors.name = 'Le nom doit contenir au moins 3 caractères';
        }
        break;
      case 'organizerId':
        if (!value) {
          errors.organizerId = 'Un organisateur est requis';
        }
        break;
    }
    setValidationErrors((prev) => ({
      ...prev,
      [field]: errors[field] || '',
    }));
    return !errors[field];
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const isNameValid = validateField('name', name);
    const isOrganizerValid = validateField('organizerId', organizerId);

    if (!isNameValid || !isOrganizerValid) {
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        organizerId,
        status,
      });
      setSuccess(event ? 'Événement modifié avec succès' : 'Événement créé avec succès');
      setTimeout(() => onCancel(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {event ? 'Modifier l\'émission' : 'Ajouter une émission'}
                </h2>
                <p className="text-red-100 text-sm">
                  {event ? 'Mettez à jour les informations' : 'Créez une nouvelle émission'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg animate-pulse">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-sm font-medium text-green-700">{success}</p>
              </div>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
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
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validateField('name', e.target.value);
                  }}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
                    validationErrors.name
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                  }`}
                  placeholder="Nom de l'émission"
                  required
                />
              </div>
              {validationErrors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.name}
                </p>
              )}
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
                  placeholder="Description de l'émission"
                  rows={4}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="organizerId" className="block text-sm font-semibold text-gray-700">
                Organisateur *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="organizerId"
                  value={organizerId}
                  onChange={(e) => {
                    setOrganizerId(e.target.value);
                    validateField('organizerId', e.target.value);
                  }}
                  disabled={organizersLoading}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
                    validationErrors.organizerId
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                  } bg-white disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none cursor-pointer`}
                  required
                >
                  <option value="">Sélectionnez un organisateur</option>
                  {organizers.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.firstName} {org.lastName}
                    </option>
                  ))}
                </select>
                {organizersLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="animate-spin h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {validationErrors.organizerId && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.organizerId}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                Statut *
              </label>
              <div className="relative">
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-300 transition-all duration-200 bg-white appearance-none cursor-pointer"
                  required
                >
                  <option value="active">Actif</option>
                  <option value="completed">Terminé</option>
                  <option value="canceled">Annulé</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || organizersLoading}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {event ? 'Mettre à jour' : 'Créer'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}