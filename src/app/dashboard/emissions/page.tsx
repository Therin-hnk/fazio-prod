'use client';

import { useState, useEffect } from 'react';
import { Event } from '../types/event';
import EventTable from './components/EventTable';
import EventFilter from './components/EventFilter';
import EventForm from './components/EventForm';
import DeleteEventModal from './components/DeleteEventModal';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Event | null>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

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
        if (!res.ok) throw new Error('Erreur lors de la récupération des événements.');
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setLoading(false);
      }
    };
    loadEvents();
  });

  const handleFilterChange = (organizerId: string | null, status: string | null, search: string) => {
    let filtered = events;
    if (organizerId) {
      filtered = filtered.filter((event) => event.organizerId === organizerId);
    }
    if (status) {
      filtered = filtered.filter((event) => event.status === status);
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(lowerSearch) ||
        (event.description && event.description.toLowerCase().includes(lowerSearch)) ||
        (event.location && event.location.toLowerCase().includes(lowerSearch))
      );
    }
    setFilteredEvents(filtered);
  };

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
        throw new Error(errorData.error || 'Erreur lors de la création de l\'événement.');
      }
      const response = await res.json();
      setEvents([...events, response.event]);
      setFilteredEvents([...events, response.event]);
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
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour de l\'événement.');
      const response = await res.json();
      const updatedEvents = events.map((e) => (e.id === editingEvent.id ? response.event : e));
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
      setSuccess('Événement mis à jour avec succès');
      setEditingEvent(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = [...selectedEventIds];
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/events', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ ids: idsToDelete }),
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression des événements.');
      const updatedEvents = events.filter((e) => !idsToDelete.includes(e.id));
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
      setSuccess('Événement(s) supprimé(s) avec succès');
      setShowDeleteModal(null);
      setSelectedEventIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleSelectEvents = (ids: string[]) => {
    setSelectedEventIds(ids);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="inline-block bg-blue-100 text-red-600 rounded-full p-2">
              <svg width="24" height="24" fill="none">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" fill="currentColor"/>
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
        >
          <svg width="20" height="20" fill="none">
            <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Ajouter une émission
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-2 bg-red-100 text-red-700 p-4 rounded mb-4 animate-fade-in">
          <svg width="20" height="20" fill="none">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" fill="currentColor"/>
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 p-4 rounded mb-4 animate-fade-in">
          <svg width="20" height="20" fill="none">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4l-3-3 1.41-1.41L9 11.17l4.59-4.59L15 8l-6 6z" fill="currentColor"/>
          </svg>
          {success}
        </div>
      )}

      {/* Actions groupées */}
      {selectedEventIds.length > 0 && (
        <div className="sticky top-0 z-10 flex justify-end mb-4">
          <button
            onClick={() => setShowDeleteModal({} as Event)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
          >
            <svg width="18" height="18" fill="none">
              <path d="M6 6v6m6-6v6M4 4h10v10H4V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Supprimer la sélection ({selectedEventIds.length})
          </button>
        </div>
      )}

      {/* Filtres et tableau */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <EventFilter onFilterChange={handleFilterChange} />
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></span>
          </div>
        ) : (
          <EventTable
            events={filteredEvents}
            onEdit={(event) => {
              setEditingEvent(event);
              setShowForm(true);
            }}
            onDelete={setShowDeleteModal}
            onSelectEvents={handleSelectEvents}
          />
        )}
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
            <EventForm
              event={editingEvent ?? undefined}
              onSubmit={editingEvent ? handleUpdate : handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Modale suppression */}
      <DeleteEventModal
        event={showDeleteModal}
        onConfirm={handleDeleteSelected}
        onCancel={() => {
          setShowDeleteModal(null);
          setSelectedEventIds([]);
        }}
      />
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s;
        }
      `}</style>
    </div>
  );
}