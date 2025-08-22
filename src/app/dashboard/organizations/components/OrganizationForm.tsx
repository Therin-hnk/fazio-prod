// app/admin/organizations/components/OrganizationForm.tsx
// Formulaire pour créer ou modifier une organisation, similaire à EventForm.

'use client';

import { memo, useState, useCallback } from 'react';
import { Organization } from '../../types/organization';
import { CheckCircle, AlertCircle, X, Save, Loader2, Users } from 'lucide-react';

interface OrganizationFormProps {
    organization?: Organization;
    onSubmit: (data: {
        firstName: string;
        lastName: string;
        sex: string;
        logo: string;
    }) => Promise<void>;
    onCancel: () => void;
}

function OrganizationForm({ organization, onSubmit, onCancel }: OrganizationFormProps) {
    const [firstName, setFirstName] = useState(organization?.firstName || '');
    const [lastName, setLastName] = useState(organization?.lastName || '');
    const [sex, setSex] = useState<string>(organization?.sex || 'M');
    const [logo, setLogo] = useState(organization?.logo || '');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const validateField = useCallback(
        (field: string, value: any) => {
            const errors: Record<string, string> = {};
            switch (field) {
                case 'firstName':
                    break;
                case 'lastName':
                    if (!value.trim()) {
                        errors.lastName = "Le nom est requis";
                    }
                    break;
                case 'sex':
                    break;
                case 'logo':
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const isFirstNameValid = validateField('firstName', firstName);
        const isLastNameValid = validateField('lastName', lastName);
        const isSexValid = validateField('sex', sex);
        const isLogoValid = validateField('logo', logo);

        if (!isFirstNameValid || !isLastNameValid || !isSexValid || !isLogoValid) {
            setError('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                sex,
                logo: logo.trim(),
            });
            setSuccess(organization ? 'Organisation modifiée avec succès' : 'Organisation créée avec succès');
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
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {organization ? "Modifier l'organisation" : "Ajouter une organisation"}
                                </h2>
                                <p className="text-red-100 text-sm">
                                    {organization ? 'Mettez à jour les informations' : 'Créez une nouvelle organisation'}
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
                            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                                Nom *
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    validateField('lastName', e.target.value);
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${validationErrors.lastName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                                    }`}
                                placeholder="Nom de l'organisation"
                                required
                                aria-invalid={!!validationErrors.lastName}
                                aria-describedby={validationErrors.lastName ? 'lastName-error' : undefined}
                            />
                            {validationErrors.lastName && (
                                <p id="lastName-error" className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {validationErrors.lastName}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="logo" className="block text-sm font-semibold text-gray-700">
                                Logo (URL)
                            </label>
                            <input
                                id="logo"
                                type="text"
                                value={logo}
                                onChange={(e) => {
                                    setLogo(e.target.value);
                                    validateField('logo', e.target.value);
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 ${validationErrors.logo ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-red-500 hover:border-red-300'
                                    }`}
                                placeholder="URL du logo"
                                aria-invalid={!!validationErrors.logo}
                                aria-describedby={validationErrors.logo ? 'logo-error' : undefined}
                            />
                            {validationErrors.logo && (
                                <p id="logo-error" className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {validationErrors.logo}
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
                                aria-label={organization ? 'Mettre à jour' : 'Créer'}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Traitement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        {organization ? 'Mettre à jour' : 'Créer'}
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

export default memo(OrganizationForm);