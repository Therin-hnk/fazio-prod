'use client';

import { useState, useEffect } from 'react';
import { Event } from '../../types/event';

interface ParticipantFilterProps {
  events: Event[];
  onFilterChange: (filters: { name: string; eventId: string }) => void;
}

function ParticipantFilter({ events, onFilterChange }: ParticipantFilterProps) {
  const [name, setName] = useState('');
  const [eventId, setEventId] = useState('');

  useEffect(() => {
    onFilterChange({ name, eventId });
  }, [name, eventId, onFilterChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Filtres</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name-filter" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            id="name-filter"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            placeholder="Rechercher par nom"
          />
        </div>
        <div>
          <label htmlFor="event-filter" className="block text-sm font-medium text-gray-700">
            Événement
          </label>
          <select
            id="event-filter"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          >
            <option value="">Tous les événements</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ParticipantFilter;