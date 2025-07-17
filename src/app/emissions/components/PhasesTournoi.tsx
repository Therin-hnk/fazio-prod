import React, { useState } from 'react';

interface PhasesTournoiProps {
  currentPhase?: string;
}

const PhasesTournoi: React.FC<PhasesTournoiProps> = ({ 
  currentPhase = 'Quarts de finale' 
}) => {
  const [activePhase, setActivePhase] = useState(currentPhase);

  const phases = [
    { id: 'quarts', label: 'Quarts de finale', status: 'current' },
    { id: 'preselections', label: 'Pré-sélections', status: 'upcoming' },
    { id: 'demifinales', label: 'Demi-finales (à venir)', status: 'upcoming' },
    { id: 'finale', label: 'Finale (à venir)', status: 'upcoming' }
  ];

  return (
    <div className="bg-white py-6 px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Phases du tournoi
        </h2>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.label)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                phase.status === 'current' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {phase.id === 'quarts' && phase.status === 'current' ? 'Phase actuelle: ' : ''}
              {phase.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhasesTournoi;