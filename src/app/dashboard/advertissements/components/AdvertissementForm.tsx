// app/admin/advertissements/components/AdvertissementForm.tsx
// Formulaire pour créer ou modifier une publicité.

'use client';

import { memo, useState, useCallback, useEffect } from 'react';
import { Advertissement, Organization } from '../../types/advertissement';
import { CheckCircle, AlertCircle, X, Save, Loader2, Link } from 'lucide-react';

interface AdvertissementFormProps {
    advertissement?: Advertissement;
    onSubmit: (data: {
        name: string;
        description?: string;
        owner: string;
        organizationId: string;
        link: string;
        image: string;
    }) => Promise<void>;
    onCancel: () => void;
}

function AdvertissementForm({ advertissement, onSubmit, onCancel }: AdvertissementFormProps) {
    const [name, setName] = useState(advertissement?.name || '');
    const [description, setDescription] = useState(advertissement?.description || '');
    const [owner, setOwner] = useState(advertissement?.owner || '');
    const [organizationId, setOrganizationId] = useState(advertissement?.organizationId || '');
    const [link, setLink] = useState(advertissement?.link || '');
    const [image, setImage] = useState(advertissement?.image || '');
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

    useEffect(() => {
        const loadOrganizations = async () => {
            try {
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };
                if (userId) {
                    headers['x-user-id'] = userId;
                }
                const res = await fetch('/api/admin/organizations', {headers});
                if (!res.ok) throw new Error('Erreur lors de la récupération des organisations.');
                const data = await res.json();
                setOrganizations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            }
        };
        loadOrganizations();
    }, []);

    const validateField = useCallback(
        (field: string, value: any) => {
            const errors: Record<string, string> = {};
            switch (field) {
                case 'name':
                    if (!value.trim()) {
                        errors.name = "Le nom est requis";
                    }
                    break;
                case 'owner':
                    if (!value.trim()) {
                        errors.owner = "Le propriétaire est requis";
                    }
                    break;
                case 'organizationId':
                    if (!value) {
                        errors.organizationId = "L'organisation est requise";
                    }
                    break;
                case 'link':
                    if (!value.trim()) {
                        errors.link = "Le lien est requis";
                    } else if (!isValidUrl(value)) {
                        errors.link = "Le lien doit être une URL valide";
                    }
                    break;
                case 'image':
                    if (!value.trim()) {
                        errors.image = "L'image est requise";
                    }
                    break;
            }
            setValidationErrors((prev) => ({
                ...prev,
                [field]: errors[field] || '',
            }));
            return !errors[field];
        },
        []
    );

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const isNameValid = validateField('name', name);
        const isOwnerValid = validateField('owner', owner);
        const isOrganizationIdValid = validateField('organizationId', organizationId);
        const isLinkValid = validateField('link', link);
        const isImageValid = validateField('image', image);

        if (!isNameValid || !isOwnerValid || !isOrganizationIdValid || !isLinkValid || !isImageValid) {
            setError('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
                owner: owner.trim(),
                organizationId,
                link: link.trim(),
                image: image.trim(),
            });
            setSuccess(advertissement ? 'Publicité modifiée avec succès' : 'Publicité créée avec succès');
            setValidationErrors({});
            setTimeout(() => onCancel(), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white bg-opacity-20 rounded-lg p-2">
                                <Link className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {advertissement ? "Modifier la publicité" : "Ajouter une publicité"}
                                </h2>
                                <p className="text-red-100 text-sm">
                                    {advertissement ? 'Mettez à jour les informations' : 'Créez une nouvelle publicité'}
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
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg animate-pulse" aria-live="polite">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <p className="text-sm font-medium text-green-700">{success}</p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg" aria-live="assertive">
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
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    validateField('name', e.target.value);
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${validationErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                                    }`}
                                placeholder="Nom de la publicité"
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
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-300 transition-all duration-200"
                                placeholder="Description de la publicité"
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="owner" className="block text-sm font-semibold text-gray-700">
                                Propriétaire *
                            </label>
                            <input
                                id="owner"
                                type="text"
                                value={owner}
                                onChange={(e) => {
                                    setOwner(e.target.value);
                                    validateField('owner', e.target.value);
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${validationErrors.owner ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                                    }`}
                                placeholder="Propriétaire de la publicité"
                                required
                                aria-invalid={!!validationErrors.owner}
                                aria-describedby={validationErrors.owner ? 'owner-error' : undefined}
                            />
                            {validationErrors.owner && (
                                <p id="owner-error" className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {validationErrors.owner}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="organizationId" className="block text-sm font-semibold text-gray-700">
                                Organisation *
                            </label>
                            <select
                                id="organizationId"
                                value={organizationId}
                                onChange={(e) => {
                                    setOrganizationId(e.target.value);
                                    validateField('organizationId', e.target.value);
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${validationErrors.organizationId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                                    } bg-white appearance-none cursor-pointer`}
                                required
                                aria-invalid={!!validationErrors.organizationId}
                                aria-describedby={validationErrors.organizationId ? 'organizationId-error' : undefined}
                            >
                                <option value="">Sélectionnez une organisation</option>
                                {organizations.map((org) => (
                                    <option key={org.id} value={org.id}>
                                        {org.firstName} {org.lastName}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.organizationId && (
                                <p id="organizationId-error" className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {validationErrors.organizationId}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="link" className="block text-sm font-semibold text-gray-700">
                                Lien *
                            </label>
                            <input
                                id="link"
                                type="text"
                                value={link}
                                onChange={(e) => {
                                    setLink(e.target.value);
                                    validateField('link', e.target.value);
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${validationErrors.link ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                                    }`}
                                placeholder="Lien de la publicité"
                                required
                                aria-invalid={!!validationErrors.link}
                                aria-describedby={validationErrors.link ? 'link-error' : undefined}
                            />
                            {validationErrors.link && (
                                <p id="link-error" className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {validationErrors.link}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="image" className="block text-sm font-semibold text-gray-700">
                                Image (URL) *
                            </label>
                            <input
                                id="image"
                                type="text"
                                value={image}
                                onChange={(e) => {
                                    setImage(e.target.value);
                                    validateField('image', e.target.value);
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${validationErrors.image ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                                    }`}
                                placeholder="URL de l'image"
                                required
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
                                aria-label={advertissement ? 'Mettre à jour' : 'Créer'}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Traitement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        {advertissement ? 'Mettre à jour' : 'Créer'}
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

export default memo(AdvertissementForm);