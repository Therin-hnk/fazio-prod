// app/admin/advertissements/page.tsx
// Page principale pour la gestion des publicités (Advertissement).

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Advertissement } from '../types/advertissement';
import AdvertissementTable from './components/AdvertissementTable';
import AdvertissementFilter from './components/AdvertissementFilter';
import AdvertissementForm from './components/AdvertissementForm';
import DeleteAdvertissementModal from './components/DeleteAdvertissementModal';
import AdvertissementDetailsModal from './components/AdvertissementDetailsModal';

export default function AdvertissementsPage() {
  const [advertissements, setAdvertissements] = useState<Advertissement[]>([]);
  const [filteredAdvertissements, setFilteredAdvertissements] = useState<Advertissement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAdvertissement, setEditingAdvertissement] = useState<Advertissement | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<Advertissement | null>(null);
  const [selectedAdvertissementIds, setSelectedAdvertissementIds] = useState<string[]>([]);
  const [filterParams, setFilterParams] = useState<{
    organizationId: string | null;
    search: string;
  }>({ organizationId: null, search: '' });

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  useEffect(() => {
    const loadAdvertissements = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (userId) {
          headers['x-user-id'] = userId;
        }
        const res = await fetch('/api/admin/advertissements', { headers });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des publicités.');
        }
        const data = await res.json();
        setAdvertissements(data);
        setFilteredAdvertissements(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    loadAdvertissements();
  }, []);

  const handleFilterChange = useCallback(
    (organizationId: string | null, search: string) => {
      setFilterParams({ organizationId, search });
      let filtered = advertissements;
      if (organizationId) {
        filtered = filtered.filter((ad) => ad.organizationId === organizationId);
      }
      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
          (ad) =>
            ad.name.toLowerCase().includes(lowerSearch) ||
            (ad.description && ad.description.toLowerCase().includes(lowerSearch))
        );
      }
      setFilteredAdvertissements(filtered);
    },
    [advertissements]
  );

  const handleCreate = async (data: {
    name: string;
    description?: string;
    owner: string;
    organizationId: string;
    link: string;
    image: string;
  }) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch(`/api/admin/advertissements/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la création de la publicité.");
      }
      const response = await res.json();
      window.location.reload();
      setAdvertissements([...advertissements, response]);
      handleFilterChange(filterParams.organizationId, filterParams.search);
      setSuccess('Publicité créée avec succès');
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleUpdate = async (data: {
    name: string;
    description?: string;
    owner: string;
    organizationId: string;
    link: string;
    image: string;
  }) => {
    if (!editingAdvertissement) return;
    try {
      const updatedData = { ...data, id: editingAdvertissement.id };
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/advertissements/update', {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour de la publicité.");
      }
      const response = await res.json();
      const updatedAdvertissements = advertissements.map((a) => (a.id === editingAdvertissement.id ? response : a));
      window.location.reload();
      setAdvertissements(updatedAdvertissements);
      handleFilterChange(filterParams.organizationId, filterParams.search);
      setSuccess('Publicité mise à jour avec succès');
      setEditingAdvertissement(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedAdvertissementIds.length === 0) return;
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/advertissements/delete', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ ids: selectedAdvertissementIds }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression des publicités.');
      }
      const updatedAdvertissements = advertissements.filter((a) => !selectedAdvertissementIds.includes(a.id));
      setAdvertissements(updatedAdvertissements);
      handleFilterChange(filterParams.organizationId, filterParams.search);
      setSuccess('Publicité(s) supprimée(s) avec succès');
      setShowDeleteModal(false);
      setSelectedAdvertissementIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleViewDetails = (advertissement: Advertissement) => {
    setShowDetailsModal(advertissement);
  };

  const handleSelectAdvertissements = (ids: string[]) => {
    setSelectedAdvertissementIds(ids);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="inline-block bg-blue-100 text-red-600 rounded-full p-2">
              <svg width="24" height="24" fill="none">
                <path
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Gestion des publicités
          </h1>
          <p className="text-gray-500 mt-1">Ajoutez, modifiez ou supprimez les publicités de la plateforme.</p>
        </div>
        <button
          onClick={() => {
            setEditingAdvertissement(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
          aria-label="Ajouter une publicité"
        >
          <svg width="20" height="20" fill="none">
            <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Ajouter une publicité
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-100 text-red-700 p-4 rounded mb-4 animate-fade-in">
          <svg width="20" height="20" fill="none">
            <path
              d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z"
              fill="currentColor"
            />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 p-4 rounded mb-4 animate-fade-in">
          <svg width="20" height="20" fill="none">
            <path
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4l-3-3 1.41-1.41L9 11.17l4.59-4.59L15 8l-6 6z"
              fill="currentColor"
            />
          </svg>
          {success}
        </div>
      )}

      {selectedAdvertissementIds.length > 0 && (
        <div className="sticky top-0 z-10 flex justify-end mb-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
            aria-label={`Supprimer ${selectedAdvertissementIds.length} publicité(s)`}
          >
            <svg width="18" height="18" fill="none">
              <path
                d="M6 6v6m6-6v6M4 4h10v10H4V4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Supprimer la sélection ({selectedAdvertissementIds.length})
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <AdvertissementFilter onFilterChange={handleFilterChange} />
        <AdvertissementTable
          advertissements={filteredAdvertissements}
          onEdit={(ad) => {
            setEditingAdvertissement(ad);
            setShowForm(true);
          }}
          onDelete={(ad) => {
            setSelectedAdvertissementIds([ad.id]);
            setShowDeleteModal(true);
          }}
          onViewDetails={handleViewDetails}
          onSelectAdvertissements={handleSelectAdvertissements}
          isLoading={loading}
        />
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
            <AdvertissementForm
              advertissement={editingAdvertissement ?? undefined}
              onSubmit={editingAdvertissement ? handleUpdate : handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteAdvertissementModal
          advertissement={null}
          selectedAdvertissementCount={selectedAdvertissementIds.length}
          onConfirm={handleDeleteSelected}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedAdvertissementIds([]);
          }}
        />
      )}

      {showDetailsModal && (
        <AdvertissementDetailsModal
          advertissement={showDetailsModal}
          onClose={() => setShowDetailsModal(null)}
        />
      )}

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
          animation: fade-in 0.4s;
        }
      `}</style>
    </div>
  );
}