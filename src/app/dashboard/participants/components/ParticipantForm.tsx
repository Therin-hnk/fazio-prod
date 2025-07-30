'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, User, FileText, Hash, Calendar, Image, Lock, Video, Trash2, Plus } from 'lucide-react';

// Types simulés pour la démo
interface Participant {
  id?: string;
  firstName: string;
  lastName: string;
  description?: string | null;
  matricule?: string | null;
  birthDate?: string | null;
  eventId: string;
  avatarUrl?: string | null;
  videos?: { url: string }[];
}

interface Event {
  id: string;
  name: string;
}

interface ParticipantFormProps {
  participant?: Participant | null | undefined;
  events: Event[];
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    description?: string;
    matricule?: string;
    birthDate?: string;
    eventId: string;
    avatarUrl?: string;
    regeneratePassword?: boolean;
    videos?: { url: string }[];
  }) => void;
  onClose: () => void;
}

function ParticipantForm({ participant, events, onSubmit, onClose }: ParticipantFormProps) {
  const [firstName, setFirstName] = useState(participant?.firstName || '');
  const [lastName, setLastName] = useState(participant?.lastName || '');
  const [description, setDescription] = useState(participant?.description || '');
  const [matricule, setMatricule] = useState(participant?.matricule || '');
  const [birthDate, setBirthDate] = useState(participant?.birthDate || '');
  const [eventId, setEventId] = useState(participant?.eventId || '');
  const [avatarUrl, setAvatarUrl] = useState(participant?.avatarUrl || '');
  const [regeneratePassword, setRegeneratePassword] = useState(false);
  const [videos, setVideos] = useState<{ url: string }[]>(
    participant?.videos || []
  );
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string;
    lastName?: string;
    eventId?: string;
    avatarUrl?: string;
    videos?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (participant) {
      setFirstName(participant.firstName);
      setLastName(participant.lastName);
      setDescription(participant.description || '');
      setMatricule(participant.matricule || '');
      setBirthDate(participant.birthDate || '');
      setEventId(participant.eventId);
      setAvatarUrl(participant.avatarUrl || '');
      setVideos(participant.videos || []);
      setRegeneratePassword(false);
    }
  }, [participant]);

  const validateField = (field: string, value: any) => {
    const errors: {
      firstName?: string;
      lastName?: string;
      eventId?: string;
      avatarUrl?: string;
      videos?: string;
    } = {};
    switch (field) {
      case 'firstName':
        if (!value.trim()) errors.firstName = 'Le prénom est requis';
        break;
      case 'lastName':
        if (!value.trim()) errors.lastName = 'Le nom est requis';
        break;
      case 'eventId':
        if (!value) errors.eventId = 'Un événement doit être sélectionné';
        break;
      case 'avatarUrl':
        break;
      case 'videos':
        if (value.length > 10) errors.videos = 'Maximum 10 vidéos autorisées';
        break;
    }
    setValidationErrors((prev) => ({ ...prev, ...errors }));
  };

  const handleAddVideo = () => {
    if (newVideoUrl.trim()) {
      const newVideos = [...videos, { url: newVideoUrl.trim() }];
      setVideos(newVideos);
      setNewVideoUrl('');
      validateField('videos', newVideos);
    }
  };

  const handleRemoveVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
    validateField('videos', newVideos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {
      firstName?: string;
      lastName?: string;
      eventId?: string;
      avatarUrl?: string;
      videos?: string;
    } = {};
    if (!firstName.trim()) errors.firstName = 'Le prénom est requis';
    if (!lastName.trim()) errors.lastName = 'Le nom est requis';
    if (!eventId) errors.eventId = 'Un événement doit être sélectionné';
    if (videos.length > 10) errors.videos = 'Maximum 10 vidéos autorisées';

    setValidationErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        await onSubmit({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          description: description.trim() || undefined,
          matricule: matricule.trim() || undefined,
          birthDate: birthDate || undefined,
          eventId,
          avatarUrl: avatarUrl.trim() || undefined,
          regeneratePassword: participant ? regeneratePassword : undefined,
          videos: videos.length > 0 ? videos : undefined,
        });
        setFirstName('');
        setLastName('');
        setDescription('');
        setMatricule('');
        setBirthDate('');
        setEventId('');
        setAvatarUrl('');
        setVideos([]);
        setNewVideoUrl('');
        setRegeneratePassword(false);
        setValidationErrors({});
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Données de démo pour les événements
  const demoEvents = events.length > 0 ? events : [
    { id: '1', name: 'Conférence Tech 2024' },
    { id: '2', name: 'Workshop Innovation' },
    { id: '3', name: 'Séminaire Digital' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-8 py-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                {participant ? 'Modifier le participant' : 'Nouveau participant'}
              </h2>
              <p className="text-red-100 text-sm">
                {participant ? 'Modifiez les informations du participant' : 'Ajoutez un nouveau participant à votre événement'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              aria-label="Fermer le formulaire"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Contenu du formulaire avec scroll */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="p-8 space-y-8">
            {/* Loader */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Section informations personnelles */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Informations personnelles</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prénom */}
                <div className="group">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        validateField('firstName', e.target.value);
                      }}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        validationErrors.firstName 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20 hover:border-gray-300'
                      } focus:ring-4 focus:outline-none bg-gray-50/50 focus:bg-white`}
                      placeholder="Entrez le prénom"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  {validationErrors.firstName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Nom */}
                <div className="group">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        validateField('lastName', e.target.value);
                      }}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        validationErrors.lastName 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20 hover:border-gray-300'
                      } focus:ring-4 focus:outline-none bg-gray-50/50 focus:bg-white`}
                      placeholder="Entrez le nom"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  {validationErrors.lastName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.lastName}
                    </p>
                  )}
                </div>

                {/* Matricule */}
                <div className="group">
                  <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 mb-2">
                    Matricule
                  </label>
                  <div className="relative">
                    <input
                      id="matricule"
                      type="text"
                      value={matricule}
                      onChange={(e) => setMatricule(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 focus:outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white hover:border-gray-300"
                      placeholder="Numéro de matricule"
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                </div>

                {/* Date de naissance */}
                <div className="group">
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  <div className="relative">
                    <input
                      id="birthDate"
                      type="date"
                      value={birthDate ? new Date(birthDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setBirthDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 focus:outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white hover:border-gray-300"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="group">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 focus:outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white hover:border-gray-300 resize-none"
                    placeholder="Description du participant..."
                  />
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* Section événement et médias */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Événement et médias</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Événement */}
                <div className="group">
                  <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
                    Événement associé <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="eventId"
                    value={eventId}
                    onChange={(e) => {
                      setEventId(e.target.value);
                      validateField('eventId', e.target.value);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      validationErrors.eventId 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20 hover:border-gray-300'
                    } focus:ring-4 focus:outline-none bg-gray-50/50 focus:bg-white`}
                  >
                    <option value="">Sélectionner un événement</option>
                    {demoEvents.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.eventId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.eventId}
                    </p>
                  )}
                </div>

                {/* Avatar URL */}
                <div className="group">
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'avatar
                  </label>
                  <div className="relative">
                    <input
                      id="avatarUrl"
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => {
                        setAvatarUrl(e.target.value);
                        validateField('avatarUrl', e.target.value);
                      }}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        validationErrors.avatarUrl 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20 hover:border-gray-300'
                      } focus:ring-4 focus:outline-none bg-gray-50/50 focus:bg-white`}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  {validationErrors.avatarUrl && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.avatarUrl}
                    </p>
                  )}
                </div>
              </div>

              {/* Section vidéos */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Video className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium text-gray-800">Vidéos du participant</h4>
                  <span className="text-sm text-gray-500">({videos.length}/10)</span>
                </div>

                {/* Ajouter une vidéo */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 bg-white hover:border-gray-300"
                      placeholder="URL de la vidéo (YouTube, Vimeo...)"
                    />
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVideo}
                    disabled={!newVideoUrl.trim() || videos.length >= 10}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </button>
                </div>

                {/* Liste des vidéos */}
                {videos.length > 0 && (
                  <div className="space-y-2">
                    {videos.map((video, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <Video className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate flex-1">{video.url}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          aria-label="Supprimer la vidéo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {validationErrors.videos && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.videos}
                  </p>
                )}
              </div>

              {/* Régénérer mot de passe */}
              {participant && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={regeneratePassword}
                        onChange={(e) => setRegeneratePassword(e.target.checked)}
                        className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-amber-300 rounded transition-all duration-200"
                      />
                    </div>
                    <Lock className="h-5 w-5 text-amber-600" />
                    <div>
                      <span className="font-medium text-amber-800">Régénérer le mot de passe</span>
                      <p className="text-sm text-amber-700">Un nouveau mot de passe sera généré et envoyé au participant</p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer avec boutons */}
        <div className="border-t border-gray-200 px-8 py-6 bg-gray-50/80 backdrop-blur-sm">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-500/20 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {participant ? 'Modifier le participant' : 'Créer le participant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParticipantForm;