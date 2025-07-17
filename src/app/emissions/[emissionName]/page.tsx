'use client';

import { notFound, useParams } from 'next/navigation';
import TalentsAfrique from '../components/TalentsAfrique';
import PhasesTournoi from '../components/PhasesTournoi';
import ParticipantsSection from '../components/ParticipantsSection';

// Types pour les données d'émission
interface EmissionData {
  id: string;
  name: string;
  title: string;
  description: string;
  targetDate: string;
  season: string;
  categories: string[];
  status: 'upcoming' | 'live' | 'ended';
}

// Données simulées des émissions (à remplacer par une API ou base de données)
const emissionsData: Record<string, EmissionData> = {
  'talents-afrique-2025': {
    id: 'talents-afrique-2025',
    name: 'talents-afrique-2025',
    title: 'Talents d\'Afrique 2025',
    description: 'Nouvelle saison de la compétition de talents, avec des performances spectaculaires à Cotonou et Porto-Novo.',
    targetDate: '2025-09-20T20:00:00',
    season: '2025',
    categories: ['Chant', 'Danse', 'Comédie'],
    status: 'upcoming',
  },
};

// Composant principal de la page
export default function EmissionPage() {
  const params = useParams();
  const emissionName = params.emissionName as string;

  const emission = emissionsData['talents-afrique-2025'];
  const targetDate = new Date(emission.targetDate);

  return (
    <div className='bg-white'>
      <TalentsAfrique targetDate={targetDate} emissionData={emission} />
      {/* <ParticipantsSection/> */}
    </div>
  );
}