import React from 'react';
import { toZonedTime } from 'date-fns-tz';
import { Calendar, Clock, Trophy, CheckCircle, Play, Pause } from 'lucide-react';
import { Phase } from '@/app/dashboard/types/event';

interface PhasesTournoiProps {
  currentPhaseId?: string;
  phases: Phase[];
}

const PhasesTournoi: React.FC<PhasesTournoiProps> = ({ currentPhaseId, phases }) => {
  // Fonction pour calculer le pourcentage de progression d'une phase
  const calculateProgress = (startDate?: string | null, endDate?: string | null): number => {
    if (!startDate || !endDate) return 0;
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    return Math.round((elapsed / total) * 100);
  };

  // Fonction pour déterminer le statut d'une phase
  const getPhaseStatus = (phase: Phase): 'upcoming' | 'active' | 'completed' => {
    if (!phase.startDate || !phase.endDate) return 'upcoming';
    
    const now = new Date();
    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  // Fonction pour formater les dates
  const formatDate = (dateString?: string | null ): string => {
    if (!dateString) return 'N/A';
    try {
      const zonedDate = toZonedTime(new Date(dateString), 'Africa/Lagos');
      return zonedDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Fonction pour obtenir l'icône selon le statut
  const getStatusIcon = (status: string, isActive: boolean) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'active':
        return <Play className="w-3 h-3" />;
      default:
        return <Pause className="w-3 h-3 opacity-60" />;
    }
  };

  const phasesToRender = phases;
  const activePhaseId = currentPhaseId || '2';

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* En-tête moderne */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-blue-900 rounded-lg">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-blue-900">
            Phases
          </h2>
        </div>
        <p className="text-gray-600 text-sm ml-8">Suivez la progression de chaque étape</p>
      </div>

      {/* Layout horizontal avec scroll */}
      <div className="overflow-x-auto pb-3">
        <div className="flex gap-4 min-w-max">
          {phasesToRender.map((phase, index) => {
            const status = getPhaseStatus(phase);
            const isActive = phase.id === activePhaseId;
            const progress = calculateProgress(phase.startDate, phase.endDate);
            
            return (
              <div
                key={phase.id}
                className={`
                  relative overflow-hidden rounded-xl p-4 transition-all duration-300 min-w-64 flex-shrink-0
                  ${isActive 
                    ? 'bg-blue-900 text-white' 
                    : status === 'completed'
                    ? 'bg-green-50 border border-green-200 hover:shadow-lg'
                    : status === 'active' && !isActive
                    ? 'bg-blue-50 border border-blue-200 hover:shadow-lg'
                    : 'bg-gray-50 border border-gray-200 hover:shadow-lg'
                  }
                `}
                aria-current={isActive ? 'true' : 'false'}
              >
                {/* Badge de statut */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`
                    flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : status === 'active'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {getStatusIcon(status, isActive)}
                    <span className="capitalize">
                      {status === 'upcoming' ? 'À venir' : 
                       status === 'active' ? 'En cours' : 'Terminé'}
                    </span>
                  </div>
                  
                  {/* Numéro de phase */}
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {index + 1}
                  </div>
                </div>

                {/* Contenu principal */}
                <div className="mb-3">
                  <h3 className={`text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-800'}`}>
                    {phase.name}
                  </h3>
                </div>

                {/* Dates */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Calendar className={`w-3 h-3 ${isActive ? 'text-white/80' : 'text-gray-500'}`} />
                    <span className={isActive ? 'text-white/90' : 'text-gray-600'}>
                      Du {formatDate(phase.startDate)} au {formatDate(phase.endDate)}
                    </span>
                  </div>
                  
                  {status === 'active' && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className={`w-3 h-3 ${isActive ? 'text-white/80' : 'text-gray-500'}`} />
                      <span className={isActive ? 'text-white/90' : 'text-gray-600'}>
                        Progression: {progress}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Barre de progression */}
                {status === 'active' && (
                  <div className="space-y-1">
                    <div className={`
                      w-full h-1.5 rounded-full overflow-hidden
                      ${isActive ? 'bg-white/20' : 'bg-gray-200'}
                    `}>
                      <div 
                        className={`
                          h-full transition-all duration-1000 ease-out rounded-full
                          ${isActive 
                            ? 'bg-white shadow-lg' 
                            : 'bg-blue-900'
                          }
                        `}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhasesTournoi;