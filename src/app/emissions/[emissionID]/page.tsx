'use client';

import { useParams } from 'next/navigation';
import EventComponent from '../components/EventComponent';
import { useEffect, useState } from 'react';
import { Event, Phase } from '@/app/dashboard/types/event';
import { toZonedTime } from 'date-fns-tz';

export default function EmissionPage() {
  const params = useParams();
  const emissionID = typeof params.emissionID === 'string' ? params.emissionID : '';

  const [emissionData, setEmissionData] = useState<Event | null>(null);
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!emissionID) {
      setError('ID d\'émission invalide');
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/public/events/get/${emissionID}`);
        if (!response.ok) throw new Error('Erreur lors du chargement de l\'événement');
        const eventData: Event = await response.json();
        setEmissionData(eventData);

        // Détecter la phase en cours (WAT, UTC+1)
        const now = toZonedTime(new Date(), 'Africa/Lagos');
        let activePhase: Phase | null = null;
        for (const tournament of eventData.tournaments) {
          for (const phase of tournament.phases) {
            const start = phase.startDate ? toZonedTime(new Date(phase.startDate), 'Africa/Lagos') : null;
            const end = phase.endDate ? toZonedTime(new Date(phase.endDate), 'Africa/Lagos') : null;
            if (start && end && now >= start && now <= end) {
              activePhase = phase;
              break;
            }
          }
          if (activePhase) break;
        }
        setCurrentPhase(activePhase);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [emissionID]);

  if (loading) return <div className='bg-white'>Chargement...</div>;
  if (error) return <div className='bg-white'>Erreur : {error}</div>;
  if (!emissionData) return <div className='bg-white'>Aucune donnée disponible</div>;
  console.log('Emission data:', emissionData);

  return (
    <div className='bg-white'>
      <EventComponent
        targetDate={currentPhase?.endDate ? toZonedTime(new Date(currentPhase.endDate), 'Africa/Lagos') : undefined}
        emissionData={emissionData}
        currentPhase={currentPhase}
      />
    </div>
  );
}