'use client';

import { useState, useEffect, useCallback } from 'react';
import { Phase, Event, Tournament } from '../types/event';
import PhaseTable from './components/PhaseTable';
import PhaseFilter from './components/PhaseFilter';
import PhaseForm from './components/PhaseForm';
import DeletePhaseModal from './components/DeletePhaseModal';
import PhaseDetailsModal from './components/PhaseDetailsModal';

export default function PhasesPage() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [filteredPhases, setFilteredPhases] = useState<Phase[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<Phase | null>(null);
  const [selectedPhaseIds, setSelectedPhaseIds] = useState<string[]>([]);
  const [filterParams, setFilterParams] = useState<{
    eventId: string | null;
    tournamentId: string | null;
    search: string;
  }>({ eventId: null, tournamentId: null, search: '' });

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (userId) {
          headers['x-user-id'] = userId;
        }

        // Charger les phases
        const phaseRes = await fetch('/api/admin/phases', { headers });
        if (!phaseRes.ok) {
          const errorData = await phaseRes.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des phases.');
        }
        const phaseData = await phaseRes.json();
        setPhases(phaseData);
        setFilteredPhases(phaseData);

        // Charger les événements (avec leurs participants)
        const eventRes = await fetch('/api/admin/events', { headers });
        if (!eventRes.ok) {
          const errorData = await eventRes.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des événements.');
        }
        const eventData = await eventRes.json();
        setEvents(eventData);

        // Charger les tournois
        const tournamentRes = await fetch('/api/admin/tournaments', { headers });
        if (!tournamentRes.ok) {
          const errorData = await tournamentRes.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des tournois.');
        }
        const tournamentData = await tournamentRes.json();
        setTournaments(tournamentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const handleFilterChange = useCallback(
    (eventId: string | null, tournamentId: string | null, search: string) => {
      setFilterParams({ eventId, tournamentId, search });
      let filtered = phases;
      if (eventId) {
        filtered = filtered.filter((phase) => phase.tournament?.eventId === eventId);
      }
      if (tournamentId) {
        filtered = filtered.filter((phase) => phase.tournamentId === tournamentId);
      }
      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
          (phase) =>
            phase.name.toLowerCase().includes(lowerSearch) ||
            (phase.description?.toLowerCase().includes(lowerSearch) ?? false)
        );
      }
      setFilteredPhases(filtered);
    },
    [phases]
  );

  const handleCreate = async (data: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    tournamentId: string;
    participantIds?: string[];
  }) => {
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
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la phase.');
      }
      const response = await res.json();
      setPhases([...phases, response]);
      handleFilterChange(filterParams.eventId, filterParams.tournamentId, filterParams.search);
      setSuccess('Phase créée avec succès');
      setShowForm(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleUpdate = async (data: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    tournamentId: string;
    participantIds?: string[];
  }) => {
    if (!editingPhase) return;
    try {
      const updatedData = { ...data, id: editingPhase.id };
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/phases/update', {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour de la phase.');
      }
      const response = await res.json();
      const updatedPhases = phases.map((p) => (p.id === editingPhase.id ? response : p));
      setPhases(updatedPhases);
      handleFilterChange(filterParams.eventId, filterParams.tournamentId, filterParams.search);
      setSuccess('Phase mise à jour avec succès');
      setEditingPhase(null);
      setShowForm(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPhaseIds.length === 0) return;
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/phases/delete', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ ids: selectedPhaseIds }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression des phases.');
      }
      const updatedPhases = phases.filter((p) => !selectedPhaseIds.includes(p.id));
      setPhases(updatedPhases);
      handleFilterChange(filterParams.eventId, filterParams.tournamentId, filterParams.search);
      setSuccess('Phase(s) supprimée(s) avec succès');
      setShowDeleteModal(false);
      setSelectedPhaseIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleViewDetails = (phase: Phase) => {
    setShowDetailsModal(phase);
  };

  const handleSelectPhases = (ids: string[]) => {
    setSelectedPhaseIds(ids);
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
            Gestion des phases
          </h1>
          <p className="text-gray-500 mt-1">Ajoutez, modifiez ou supprimez les phases des catégories.</p>
        </div>
        <button
          onClick={() => {
            setEditingPhase(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
          aria-label="Ajouter une phase"
        >
          <svg width="20" height="20" fill="none">
            <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Ajouter une phase
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

      {selectedPhaseIds.length > 0 && (
        <div className="sticky top-0 z-10 flex justify-end mb-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
            aria-label={`Supprimer ${selectedPhaseIds.length} phase(s)`}
          >
            <svg width="18" height="18" fill="none">
              <path
                d="M6 6v6m6-6v6M4 4h10v10H4V4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Supprimer la sélection ({selectedPhaseIds.length})
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <PhaseFilter events={events} tournaments={tournaments} onFilterChange={handleFilterChange} />
        <PhaseTable
          phases={filteredPhases}
          onEdit={(phase) => {
            setEditingPhase(phase);
            setShowForm(true);
          }}
          onDelete={(phase) => {
            setSelectedPhaseIds([phase.id]);
            setShowDeleteModal(true);
          }}
          onViewDetails={handleViewDetails}
          onSelectPhases={handleSelectPhases}
          isLoading={loading}
        />
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <PhaseForm
              phase={editingPhase ?? undefined}
              events={events}
              tournaments={tournaments}
              onSubmit={editingPhase ? handleUpdate : handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeletePhaseModal
          phase={null}
          selectedPhaseCount={selectedPhaseIds.length}
          onConfirm={handleDeleteSelected}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedPhaseIds([]);
          }}
        />
      )}

      {showDetailsModal && (
        <PhaseDetailsModal phase={showDetailsModal} onClose={() => setShowDetailsModal(null)} />
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