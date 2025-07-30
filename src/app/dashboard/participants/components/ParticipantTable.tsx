'use client';

import { memo, useState } from 'react';
import { Participant } from '../../types/participant';
import { Event } from '../../types/event';
import { Edit2, Trash2, Eye, User } from 'lucide-react';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface ParticipantTableProps {
  participants: Participant[];
  events: Event[];
  onEdit: (participant: Participant) => void;
  onDelete: (participant: Participant) => void;
  onView: (participant: Participant) => void;
  onSelectParticipants: (selectedIds: string[]) => void;
}

function ParticipantTable({
  participants,
  events,
  onEdit,
  onDelete,
  onView,
  onSelectParticipants,
}: ParticipantTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelectedIds);
    onSelectParticipants(newSelectedIds);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === participants.length) {
      setSelectedIds([]);
      onSelectParticipants([]);
    } else {
      const allIds = participants.map((participant) => participant.id);
      setSelectedIds(allIds);
      onSelectParticipants(allIds);
    }
  };

  const handleDelete = (participant: Participant) => {
    setSelectedIds([participant.id]);
    onSelectParticipants([participant.id]);
    onDelete(participant);
  };

  const formatDate = (date: string | null): string => {
    if (!date) return 'N/A';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'N/A';
      return format(dateObj, 'dd MMMM yyyy', { locale: fr });
    } catch {
      return 'N/A';
    }
  };

  const getEventName = (eventId: string): string => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.name : 'N/A';
  };

  const getTotalVotes = (votes: Participant['votes']): number => {
    return votes.reduce((total, vote) => total + vote.voteCount, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Participants ({participants.length})
          </h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="grid">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === participants.length && participants.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-colors duration-200"
                  aria-label="Sélectionner tous les participants"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom complet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement associé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matricule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de naissance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre de votes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {participants.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <User className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500">Aucun participant trouvé</p>
                  </div>
                </td>
              </tr>
            ) : (
              participants.map((participant) => (
                <tr
                  key={participant.id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    selectedIds.includes(participant.id) ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(participant.id)}
                      onChange={() => handleSelect(participant.id)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-colors duration-200"
                      aria-label={`Sélectionner le participant ${participant.firstName} ${participant.lastName}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {participant.firstName} {participant.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getEventName(participant.eventId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{participant.matricule || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(participant.birthDate as string)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getTotalVotes(participant.votes)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(participant)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                        title="Voir les détails"
                        aria-label={`Voir les détails du participant ${participant.firstName} ${participant.lastName}`}
                      >
                        <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      </button>
                      <button
                        onClick={() => onEdit(participant)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                        title="Modifier"
                        aria-label={`Modifier le participant ${participant.firstName} ${participant.lastName}`}
                      >
                        <Edit2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      </button>
                      <button
                        onClick={() => handleDelete(participant)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                        title="Supprimer"
                        aria-label={`Supprimer le participant ${participant.firstName} ${participant.lastName}`}
                      >
                        <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(ParticipantTable);