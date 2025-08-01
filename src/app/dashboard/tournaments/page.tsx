'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tournament, Event } from '../types/event';
import CategoryTable from './components/CategoryTable';
import CategoryFilter from './components/CategoryFilter';
import CategoryForm from './components/CategoryForm';
import DeleteCategoryModal from './components/DeleteCategoryModal';
import CategoryDetailsModal from './components/CategoryDetailsModal';

export default function CategoriesPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<Tournament | null>(null);
  const [selectedTournamentIds, setSelectedTournamentIds] = useState<string[]>([]);
  const [filterParams, setFilterParams] = useState<{
    eventId: string | null;
    search: string;
  }>({ eventId: null, search: '' });

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (userId) {
          headers['x-user-id'] = userId;
        }
        const res = await fetch('/api/admin/tournaments', { headers });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des catégories.');
        }
        const data = await res.json();
        setTournaments(data);
        setFilteredTournaments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    loadTournaments();
  }, []);

  const handleFilterChange = useCallback(
    (eventId: string | null, search: string) => {
      setFilterParams({ eventId, search });
      let filtered = tournaments;
      if (eventId) {
        filtered = filtered.filter((tournament) => tournament.eventId === eventId);
      }
      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
          (tournament) =>
            tournament.name.toLowerCase().includes(lowerSearch) ||
            (tournament.description?.toLowerCase().includes(lowerSearch) ?? false) ||
            (tournament.location?.toLowerCase().includes(lowerSearch) ?? false)
        );
      }
      setFilteredTournaments(filtered);
    },
    [tournaments]
  );

  const handleCreate = async (data: {
    name: string;
    description?: string;
    logoUrl?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    eventId: string;
  }) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/tournaments/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la catégorie.');
      }
      const response = await res.json();
      setTournaments([...tournaments, response]);
      handleFilterChange(filterParams.eventId, filterParams.search);
      setSuccess('Catégorie créée avec succès');
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleUpdate = async (data: {
    name: string;
    description?: string;
    logoUrl?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    eventId: string;
  }) => {
    if (!editingTournament) return;
    try {
      const updatedData = { ...data, id: editingTournament.id };
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/tournaments/update', {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour de la catégorie.');
      }
      const response = await res.json();
      const updatedTournaments = tournaments.map((t) => (t.id === editingTournament.id ? response : t));
      setTournaments(updatedTournaments);
      handleFilterChange(filterParams.eventId, filterParams.search);
      setSuccess('Catégorie mise à jour avec succès');
      setEditingTournament(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTournamentIds.length === 0) return;
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/tournaments/delete', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ ids: selectedTournamentIds }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression des catégories.');
      }
      const updatedTournaments = tournaments.filter((t) => !selectedTournamentIds.includes(t.id));
      setTournaments(updatedTournaments);
      handleFilterChange(filterParams.eventId, filterParams.search);
      setSuccess('Catégorie(s) supprimée(s) avec succès');
      setShowDeleteModal(false);
      setSelectedTournamentIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleViewDetails = (tournament: Tournament) => {
    setShowDetailsModal(tournament);
  };

  const handleAddPhase = async (tournamentId: string, phase: any) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/phases/create', {
        method: 'POST',
        headers,
        body: JSON.stringify({ tournamentId, ...phase }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de l’ajout de la phase.');
      }
      const loadTournaments = async () => {
        const res = await fetch('/api/admin/tournaments', { headers });
        if (!res.ok) throw new Error('Erreur lors de la récupération des catégories.');
        const data = await res.json();
        setTournaments(data);
        handleFilterChange(filterParams.eventId, filterParams.search);
      };
      await loadTournaments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleAddParticipantToPhase = async (phaseId: string, participantId: string) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/phase-participants/add', {
        method: 'POST',
        headers,
        body: JSON.stringify({ phaseId, participantId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de l’association du participant.');
      }
      const loadTournaments = async () => {
        const res = await fetch('/api/admin/tournaments', { headers });
        if (!res.ok) throw new Error('Erreur lors de la récupération des catégories.');
        const data = await res.json();
        setTournaments(data);
        handleFilterChange(filterParams.eventId, filterParams.search);
      };
      await loadTournaments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleSelectTournaments = (ids: string[]) => {
    setSelectedTournamentIds(ids);
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
            Gestion des catégories
          </h1>
          <p className="text-gray-500 mt-1">Ajoutez, modifiez ou supprimez les catégories de la plateforme.</p>
        </div>
        <button
          onClick={() => {
            setEditingTournament(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
          aria-label="Ajouter une catégorie"
        >
          <svg width="20" height="20" fill="none">
            <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Ajouter une catégorie
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
              d="M10 18a8 8 0 100-16 8 8 0 000-16zm-1-4l-3-3 1.41-1.41L9 11.17l4.59-4.59L15 8l-6 6z"
              fill="currentColor"
            />
          </svg>
          {success}
        </div>
      )}

      {selectedTournamentIds.length > 0 && (
        <div className="sticky top-0 z-10 flex justify-end mb-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
            aria-label={`Supprimer ${selectedTournamentIds.length} catégorie(s)`}
          >
            <svg width="18" height="18" fill="none">
              <path
                d="M6 6v6m6-6v6M4 4h10v10H4V4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Supprimer la sélection ({selectedTournamentIds.length})
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <CategoryFilter onFilterChange={handleFilterChange} />
        <CategoryTable
          tournaments={filteredTournaments}
          onEdit={(tournament) => {
            setEditingTournament(tournament);
            setShowForm(true);
          }}
          onDelete={(tournament) => {
            setSelectedTournamentIds([tournament.id]);
            setShowDeleteModal(true);
          }}
          onViewDetails={handleViewDetails}
          onSelectTournaments={handleSelectTournaments}
          isLoading={loading}
        />
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <CategoryForm
              tournament={editingTournament ?? undefined}
              onSubmit={editingTournament ? handleUpdate : handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteCategoryModal
          tournament={null}
          selectedTournamentCount={selectedTournamentIds.length}
          onConfirm={handleDeleteSelected}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedTournamentIds([]);
          }}
        />
      )}

      {showDetailsModal && (
        <CategoryDetailsModal
          tournament={showDetailsModal}
          onClose={() => setShowDetailsModal(null)}
          onAddPhase={handleAddPhase}
          onAddParticipantToPhase={handleAddParticipantToPhase}
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