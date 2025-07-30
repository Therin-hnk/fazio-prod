'use client';

import { useState, useEffect, useCallback } from 'react';
import ParticipantTable from './components/ParticipantTable';
import ParticipantForm from './components/ParticipantForm';
import ParticipantFilter from './components/ParticipantFilter';
import DeleteParticipantModal from './components/DeleteParticipantModal';
import ParticipantDetails from './components/ParticipantDetails';
import { Participant } from '../types/participant';
import { Event } from '../types/event';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null | undefined>(null);
  const [viewingParticipant, setViewingParticipant] = useState<Participant | null | undefined>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null | undefined>(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  const getHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (userId) {
      headers['x-user-id'] = userId;
    }
    return headers;
  }, [userId]);

  const fetchParticipants = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/participants', {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Erreur lors du chargement des participants');
      const data = await response.json();
      setParticipants(data);
      setFilteredParticipants(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  }, [getHeaders]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/events', {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Erreur lors du chargement des événements');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchParticipants();
    fetchEvents();
  }, [fetchParticipants, fetchEvents]);

  const handleCreate = () => {
    setEditingParticipant(null);
    setIsFormOpen(true);
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setIsFormOpen(true);
  };

  const handleView = (participant: Participant) => {
    setViewingParticipant(participant);
    setIsDetailsOpen(true);
  };

  const handleDelete = (participant: Participant) => {
    setParticipantToDelete(participant);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: {
    firstName: string;
    lastName: string;
    description?: string;
    matricule?: string;
    birthDate?: string;
    eventId: string;
    avatarUrl?: string;
    regeneratePassword?: boolean;
    videos?: { url: string }[];
  }) => {
    if (!userId) {
      console.error('Erreur: ID de l\'admin non disponible');
      return;
    }
    try {
      const url = editingParticipant
        ? `/api/admin/participants/update`
        : `/api/admin/participants/create`;
      const method = editingParticipant ? 'PUT' : 'POST';
      const body = editingParticipant
        ? { ...data, id: editingParticipant.id }
        : data;

      console.log('Submitting data:', body);

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Erreur lors de la soumission');
      setIsFormOpen(false);
      fetchParticipants();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!participantToDelete || !userId) {
      console.error('Erreur: Participant ou ID de l\'admin non disponible');
      return;
    }
    try {
      const response = await fetch(`/api/admin/participants/delete/${userId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ ids: [participantToDelete.id] }),
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setIsDeleteModalOpen(false);
      setParticipantToDelete(null);
      setSelectedParticipantIds([]);
      fetchParticipants();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleFilterChange = (filters: { name: string; eventId: string }) => {
    const filtered = participants.filter((participant) => {
      const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
      const matchesName = fullName.includes(filters.name.toLowerCase());
      const matchesEvent = filters.eventId ? participant.eventId === filters.eventId : true;
      return matchesName && matchesEvent;
    });
    setFilteredParticipants(filtered);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des participants</h1>
      <ParticipantFilter events={events} onFilterChange={handleFilterChange} />
      <button
        onClick={handleCreate}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Créer un participant
      </button>
      <ParticipantTable
        participants={filteredParticipants}
        events={events}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onSelectParticipants={setSelectedParticipantIds}
      />
      {isFormOpen && (
        <ParticipantForm
          participant={editingParticipant}
          events={events}
          onSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      {isDeleteModalOpen && participantToDelete && (
        <DeleteParticipantModal
          participant={participantToDelete}
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
      {isDetailsOpen && viewingParticipant && (
        <ParticipantDetails
          participant={viewingParticipant}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
}