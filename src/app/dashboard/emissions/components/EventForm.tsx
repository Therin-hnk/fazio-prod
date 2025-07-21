'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event, Organizer } from '../../types/event';
import { Calendar, FileText, User, CheckCircle, AlertCircle, X, Save, Loader2, Link, MapPin } from 'lucide-react';

interface EventFormProps {
  event?: Event;
  onSubmit: (data: {
    name: string;
    description?: string;
    videos?: string[];
    organizerId: string;
    image?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    status?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [name, setName] = useState(event?.name || '');
  const [description, setDescription] = useState(event?.description || '');
  const [videos, setVideos] = useState<string[]>(event?.videos || []);
  const [organizerId, setOrganizerId] = useState(event?.organizerId || '');
  const [image, setImage] = useState(event?.image || '');
  const [startDate, setStartDate] = useState(event?.startDate || '');
  const [endDate, setEndDate] = useState(event?.endDate || '');
  const [location, setLocation] = useState(event?.location || '');
  const [status, setStatus] = useState<string>(event?.status || 'coming');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [organizersLoading, setOrganizersLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;


  const validateField = useCallback((field: string, value: any) => {
    const errors: Record<string, string> = {};
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Le nom de l\'événement est requis';
        }
        break;
      case 'organizerId':
        if (!value) {
          errors.organizerId = 'Un organisateur est requis';
        }
        break;
      case 'image':
        // if (value && !isValidUrl(value)) {
        //   errors.image = 'L\'URL de l\'image doit être valide';
        // }
        break;
      case 'videos':
        if (value.some((url: string) => !isValidUrl(url))) {
          errors.videos = 'Toutes les URLs de vidéos doivent être valides';
        }
        break;
      case 'startDate':
        if (value && !isValidDate(value)) {
          errors.startDate = 'La date de début doit être au format ISO';
        }
        break;
      case 'endDate':
        if (value && !isValidDate(value)) {
          errors.endDate = 'La date de fin doit être au format ISO';
        } else if (value && startDate && new Date(value) <= new Date(startDate)) {
          errors.endDate = 'La date de fin doit être postérieure à la date de début';
        }
        break;
    }
    setValidationErrors((prev) => ({
      ...prev,
      [field]: errors[field] || '',
    }));
    return !errors[field];
  }, [startDate]);

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

  const handleAddVideo = () => {
    setVideos([...videos, '']);
  };

  const handleVideoChange = (index: number, value: string) => {
    const newVideos = [...videos];
    newVideos[index] = value;
    setVideos(newVideos);
    validateField('videos', newVideos);
  };

  const handleRemoveVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
    validateField('videos', newVideos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const isNameValid = validateField('name', name);
    const isImageValid = validateField('image', image);
    const isVideosValid = validateField('videos', videos);
    const isStartDateValid = validateField('startDate', startDate);
    const isEndDateValid = validateField('endDate', endDate);

    if (!isNameValid || !isImageValid || !isVideosValid || !isStartDateValid || !isEndDateValid) {
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);
    try {
      const isoStartDate = startDate ? new Date(startDate).toISOString() : undefined;
      const isoEndDate = endDate ? new Date(endDate).toISOString() : undefined;

      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        videos: videos.filter((url) => url.trim()).length > 0 ? videos.filter((url) => url.trim()) : undefined,
        organizerId: userId || "",
        image: image.trim() || undefined,
        startDate: isoStartDate,
        endDate: isoEndDate,
        location: location.trim() || undefined,
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
              <label className="block text-sm font-semibold text-gray-700">
                Vidéos
              </label>
              {videos.map((video, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={video}
                      onChange={(e) => handleVideoChange(index, e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${
                        validationErrors.videos
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                      }`}
                      placeholder="URL de la vidéo"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {validationErrors.videos && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.videos}
                </p>
              )}
              <button
                type="button"
                onClick={handleAddVideo}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                + Ajouter une vidéo
              </button>
            </div>
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700">
                Image
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
                />
              </div>
              {validationErrors.image && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.image}
                </p>
              )}
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
                />
              </div>
              {validationErrors.startDate && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.startDate}
                </p>
              )}
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
                />
              </div>
              {validationErrors.endDate && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.endDate}
                </p>
              )}
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
                  placeholder="Lieu de l'émission"
                />
              </div>
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
                  <option value="coming">À venir</option>
                  <option value="ongoing">En cours</option>
                  <option value="finished">Terminé</option>
                  <option value="cancelled">Annulé</option>
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