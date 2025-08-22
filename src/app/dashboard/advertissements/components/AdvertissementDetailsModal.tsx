// app/admin/advertissements/components/AdvertissementDetailsModal.tsx
// Modal pour afficher les détails d'une publicité.

'use client';

import { memo } from 'react';
import { X, Info } from 'lucide-react';
import { Advertissement } from '../../types/advertissement';
import driveImageLoader from '@/app/lib/driveImageLoader';

interface AdvertissementDetailsModalProps {
    advertissement: Advertissement;
    onClose: () => void;
}

function AdvertissementDetailsModal({ advertissement, onClose }: AdvertissementDetailsModalProps) {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
            aria-labelledby="details-modal-title"
        >
            <div className="bg-white rounded-lg shadow-2xl mx-auto p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4 border-b pb-4">
                    <h2 id="details-modal-title" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Info className="h-6 w-6 text-red-600" aria-hidden="true" />
                        {"Détails de la publicité"} : {advertissement.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Close"
                    >
                        <X className="h-6 w-6 text-gray-600" aria-hidden="true" />
                    </button>
                </div>

                {/* Informations générales */}
                <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Info className="h-5 w-5 text-red-600" aria-hidden="true" />
                        Informations générales
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Nom</dt>
                            <dd className="mt-1 text-sm text-gray-900">{advertissement.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900">{advertissement.description || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Propriétaire</dt>
                            <dd className="mt-1 text-sm text-gray-900">{advertissement.owner}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Organisation</dt>
                            <dd className="mt-1 text-sm text-gray-900">{advertissement.organization?.lastName || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Lien</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                <a
                                    href={advertissement.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {advertissement.link || 'N/A'}
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Image</dt>
                            <dd className="mt-1 text-sm text-gray-900">{advertissement.image || 'N/A'}</dd>
                            <img
                                src={driveImageLoader({ src: advertissement.image })}
                                className="mt-2 w-full h-48 object-cover rounded-lg shadow-sm"
                            />
                        </div>
                    </dl>
                </div>

                <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
            </div>
        </div>
    );
}

export default memo(AdvertissementDetailsModal);