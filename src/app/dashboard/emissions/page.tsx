'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event, Phase } from '../types/event';
import EventTable from './components/EventTable';
import EventFilter from './components/EventFilter';
import EventForm from './components/EventForm';
import DeleteEventModal from './components/DeleteEventModal';
import EventDetailsModal from './components/EventDetailsModal';
import RankingsComponent from './components/RankingsComponent';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<Event | null>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [filterParams, setFilterParams] = useState<{
    organizerId: string | null;
    status: string | null;
    search: string;
  }>({ organizerId: null, status: null, search: '' });

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (userId) {
          headers['x-user-id'] = userId;
        }
        const res = await fetch('/api/admin/events', { headers });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des événements.');
        }
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const handleFilterChange = useCallback(
    (organizerId: string | null, status: string | null, search: string) => {
      setFilterParams({ organizerId, status, search });
      let filtered = events;
      if (organizerId) {
        filtered = filtered.filter((event) => event.organizerId === organizerId);
      }
      if (status) {
        filtered = filtered.filter((event) => event.status === status);
      }
      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
          (event) =>
            event.name.toLowerCase().includes(lowerSearch) ||
            (event.description && event.description.toLowerCase().includes(lowerSearch)) ||
            (event.location && event.location.toLowerCase().includes(lowerSearch))
        );
      }
      setFilteredEvents(filtered);
    },
    [events]
  );

  const handleCreate = async (data: {
    name: string;
    description?: string;
    videos?: string[];
    organizerId: string;
    image?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    status?: string;
    votePrice?: number;
  }) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch(`/api/admin/events/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la création de l'événement.");
      }
      const response = await res.json();
      window.location.reload(); // Recharger la page pour refléter les changements
      setEvents([...events, response]);
      handleFilterChange(filterParams.organizerId, filterParams.status, filterParams.search);
      setSuccess('Événement créé avec succès');
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleUpdate = async (data: {
    name: string;
    description?: string;
    videos?: string[];
    organizerId: string;
    image?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    status?: string;
    votePrice?: number;
  }) => {
    if (!editingEvent) return;
    try {
      const updatedData = { ...data, id: editingEvent.id };
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/events/update', {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour de l'événement.");
      }
      const response = await res.json();
      const updatedEvents = events.map((e) => (e.id === editingEvent.id ? response : e));
      window.location.reload(); // Recharger la page pour refléter les changements
      setEvents(updatedEvents);
      handleFilterChange(filterParams.organizerId, filterParams.status, filterParams.search);
      setSuccess('Événement mis à jour avec succès');
      setEditingEvent(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEventIds.length === 0) return;
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/events/delete', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ ids: selectedEventIds }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression des événements.');
      }
      const updatedEvents = events.filter((e) => !selectedEventIds.includes(e.id));
      setEvents(updatedEvents);
      handleFilterChange(filterParams.organizerId, filterParams.status, filterParams.search);
      setSuccess('Événement(s) supprimé(s) avec succès');
      setShowDeleteModal(false);
      setSelectedEventIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleViewDetails = (event: Event) => {
    setShowDetailsModal(event);
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
      // Recharger les événements pour inclure la nouvelle phase
      const loadEvents = async () => {
        const res = await fetch('/api/admin/events', { headers });
        if (!res.ok) throw new Error('Erreur lors de la récupération des événements.');
        const data = await res.json();
        setEvents(data);
        handleFilterChange(filterParams.organizerId, filterParams.status, filterParams.search);
      };
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleAddParticipantToPhase = async (phaseId: string, userId: string) => {
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
        body: JSON.stringify({ phaseId, userId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de l’association du participant.');
      }
      // Recharger les événements pour inclure le nouveau participant
      const loadEvents = async () => {
        const res = await fetch('/api/admin/events', { headers });
        if (!res.ok) throw new Error('Erreur lors de la récupération des événements.');
        const data = await res.json();
        setEvents(data);
        handleFilterChange(filterParams.organizerId, filterParams.status, filterParams.search);
      };
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleSelectEvents = (ids: string[]) => {
    setSelectedEventIds(ids);
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
            Gestion des émissions
          </h1>
          <p className="text-gray-500 mt-1">Ajoutez, modifiez ou supprimez les émissions de la plateforme.</p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
          aria-label="Ajouter une émission"
        >
          <svg width="20" height="20" fill="none">
            <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Ajouter une émission
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

      {selectedEventIds.length > 0 && (
        <div className="sticky top-0 z-10 flex justify-end mb-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
            aria-label={`Supprimer ${selectedEventIds.length} événement(s)`}
          >
            <svg width="18" height="18" fill="none">
              <path
                d="M6 6v6m6-6v6M4 4h10v10H4V4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Supprimer la sélection ({selectedEventIds.length})
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <EventFilter onFilterChange={handleFilterChange} />
        <EventTable
          events={filteredEvents}
          onEdit={(event) => {
            setEditingEvent(event);
            setShowForm(true);
          }}
          onDelete={(event) => {
            setSelectedEventIds([event.id]);
            setShowDeleteModal(true);
          }}
          onViewDetails={handleViewDetails}
          onSelectEvents={handleSelectEvents}
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
            <EventForm
              event={editingEvent ?? undefined}
              onSubmit={editingEvent ? handleUpdate : handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteEventModal
          event={null}
          selectedEventCount={selectedEventIds.length}
          onConfirm={handleDeleteSelected}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedEventIds([]);
          }}
        />
      )}

      {showDetailsModal && (
        <EventDetailsModal
          event={showDetailsModal}
          onClose={() => setShowDetailsModal(null)}
          onAddPhase={handleAddPhase}
          onAddParticipantToPhase={handleAddParticipantToPhase}
        />
      )}

      <RankingsComponent/>

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