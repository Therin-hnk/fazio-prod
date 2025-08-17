"use client"
import driveImageLoader from '@/app/lib/driveImageLoader';
import Image from 'next/image';
import Router from 'next/router';
import { useState, useEffect } from 'react';
import { JSX, SVGProps } from 'react';
import Cookies from 'js-cookie';

// Interface pour les données du tableau de bord
interface ParticipantDashboardData {
  id: string;
  firstName: string;
  lastName: string;
  description?: string;
  matricule?: string;
  birthDate?: string;
  avatarUrl?: string;
  event: {
    id: string;
    name: string;
    tournaments: {
      id: string;
      name: string;
      phases: {
        id: string;
        name: string;
        order: number;
        startDate: string;
        endDate: string;
      }[];
    }[];
  };
  votes: {
    id: string;
    voteCount: number;
    phaseId: string;
  }[];
  videos: {
    id: string;
    url: string;
  }[];
  phases: {
    phase: {
      id: string;
      name: string;
      order: number;
      startDate: string;
      endDate: string;
      tournament: {
        id: string;
        name: string;
      };
    };
  }[];
  stats: {
    totalVotes: number;
    votesByPhase: Record<string, number>;
  };
  rankings: {
    phaseId: string;
    phaseName: string;
    tournamentId: string;
    tournamentName: string;
    rank: number;
    totalVotes: number;
  }[];
}

// SVG Icons
const UserIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const TrophyIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5 16L3 5h5.5l1.5 9 1.5-9H17l-2 11h-1.5l-1.5-9L10.5 16H5zm7-10.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S14.33 7 13.5 7 12 6.33 12 5.5z"/>
    <path d="M17.5 4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5S19 6.83 19 6s-.67-1.5-1.5-1.5z"/>
    <path d="M5.5 11L7 20h10l1.5-9H5.5z"/>
  </svg>
);

const VideoIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);

const StatsIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
);

const LogoutIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  </svg>
);

const EventIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zM5 8h14V6H5v2z"/>
  </svg>
);

export default function ParticipantDashboard() {
  const [data, setData] = useState<ParticipantDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return;

    const userId = Cookies.get('userId');
    if (!userId) {
      window.location.href = ('/nominee');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/public/participants/${userId}`);
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          setError(result.error || 'Erreur lors du chargement des données');
        }
      } catch (err) {
        setError('Une erreur s\'est produite. Vérifiez votre connexion et réessayez.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('userId');
    window.location.reload();
    // router.push('/nominee/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="relative flex flex-col justify-center items-center">
          <div className="w-20 h-20 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{animationDelay: '-0.5s', animationDuration: '1.5s'}}></div>
          <div className="mt-6 text-center">
            <div className="text-white text-lg font-medium">Chargement de votre espace</div>
            <div className="text-orange-300 text-sm mt-1">Préparation des données...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-orange-400 text-2xl">⚠</span>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Erreur de connexion</h3>
          <p className="text-orange-200 text-sm mb-6">{error}</p>
          <button
            onClick={handleLogout}
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getBestRank = () => {
    return Math.min(...data.rankings.map(r => r.rank));
  };

  const getLatestPhaseVotes = () => {
    const sortedPhases = Object.entries(data.stats.votesByPhase).sort(([a], [b]) => {
      const phaseA = data.event.tournaments.flatMap(t => t.phases).find(p => p.id === a);
      const phaseB = data.event.tournaments.flatMap(t => t.phases).find(p => p.id === b);
      return (phaseB?.order || 0) - (phaseA?.order || 0);
    });
    return sortedPhases[0]?.[1] || 0;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header moderne */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold  text-slate-900">
                  {data.firstName} {data.lastName}
                </h1>
                <p className="text-orange-700 text-sm">Participant • {data.event.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <LogoutIcon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total des votes</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{data.stats.totalVotes}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <StatsIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-orange-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Meilleur rang</p>
                <p className="text-3xl font-bold text-white mt-1">#{getBestRank()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">Phase actuelle</p>
                <p className="text-3xl font-bold text-white mt-1">{getLatestPhaseVotes()}</p>
                <p className="text-orange-300 text-xs">votes reçus</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Vidéos</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{data.videos.length}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <VideoIcon className="w-6 h-6 text-slate-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Layout principal en deux colonnes */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Colonne gauche - Profil */}
          <div className="xl:col-span-1 space-y-6">
            {/* Carte profil */}
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center">
                <div className="relative mx-auto mb-6">
                  {data.avatarUrl ? (
                    <div className="w-full h-[500px] rounded-3xl overflow-hidden bg-orange-500 p-1 shadow-2xl mx-auto">
                        <img
                            src={driveImageLoader({ src: data.avatarUrl })}
                            alt="Image de l’émission"
                            className="object-contain w-full h-full"
                        />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-slate-800 rounded-3xl flex items-center justify-center shadow-2xl mx-auto">
                      <UserIcon className="w-16 h-16 text-orange-400" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <span className="w-3 h-3 bg-white rounded-full"></span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{data.firstName} {data.lastName}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{data.description || 'Participant actif'}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600 text-sm font-medium">Matricule</span>
                    <span className="text-slate-900 font-semibold text-sm">{data.matricule || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-orange-50 rounded-xl">
                    <span className="text-slate-600 text-sm font-medium">Naissance</span>
                    <span className="text-orange-700 font-semibold text-sm">
                      {data.birthDate ? new Date(data.birthDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Événement */}
            <div className="bg-slate-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-lg mr-3 flex items-center justify-center">
                  <EventIcon className="w-5 h-5 text-white" />
                </div>
                Événement
              </h3>
              <div className="p-4 bg-slate-700/50 rounded-2xl border border-slate-600">
                <p className="text-white font-semibold mb-3">{data.event.name}</p>
                <div className="space-y-2">
                  {data.event.tournaments.map((tournament) => (
                    <div key={tournament.id}>
                      <p className="text-orange-300 font-medium text-sm">{tournament.name}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tournament.phases.map((phase) => (
                          <span key={phase.id} className="bg-orange-500/20 text-orange-200 px-3 py-1 rounded-lg text-xs font-medium">
                            {phase.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Contenu principal */}
          <div className="xl:col-span-2 space-y-6">
            {/* Performance par phase */}
            <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-slate-900 rounded-lg mr-3 flex items-center justify-center">
                  <StatsIcon className="w-5 h-5 text-white" />
                </div>
                Performance par phase
              </h3>
              
              <div className="grid gap-4">
                {Object.entries(data.stats.votesByPhase).map(([phaseId, votes]) => {
                  const phase = data.event.tournaments.flatMap(t => t.phases).find(p => p.id === phaseId);
                  const percentage = (votes / data.stats.totalVotes) * 100;
                  
                  return (
                    <div key={phaseId} className="group p-5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-900 font-semibold">{phase?.name || 'Phase inconnue'}</span>
                        <span className="text-orange-600 font-bold text-lg">{votes} votes</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full transition-all duration-1000 group-hover:bg-orange-600"
                          style={{width: `${percentage}%`}}
                        ></div>
                      </div>
                      <div className="text-slate-600 text-xs mt-2 font-medium">{percentage.toFixed(1)}% du total</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Classements */}
            <div className="bg-slate-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                Mes classements
              </h3>
              
              <div className="space-y-4">
                {data.rankings.map((ranking, index) => {
                  const getRankBg = (rank: number) => {
                    if (rank === 1) return 'bg-orange-500';
                    if (rank === 2) return 'bg-slate-400';
                    if (rank === 3) return 'bg-orange-400';
                    return 'bg-slate-600';
                  };

                  const getRankIcon = (rank: number) => {
                    if (rank === 1) return '🥇';
                    if (rank === 2) return '🥈';
                    if (rank === 3) return '🥉';
                    return '🏅';
                  };

                  return (
                    <div key={ranking.phaseId} className="group p-5 bg-slate-700/50 hover:bg-slate-700 rounded-2xl border border-slate-600 transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${getRankBg(ranking.rank)} rounded-xl flex items-center justify-center shadow-lg`}>
                            <span className="text-xl">{getRankIcon(ranking.rank)}</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">{ranking.phaseName}</p>
                            <p className="text-orange-300 text-sm">{ranking.tournamentName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">#{ranking.rank}</p>
                          <p className="text-slate-300 text-sm">{ranking.totalVotes} votes</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section vidéos pleine largeur */}
        <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-slate-900 rounded-lg mr-3 flex items-center justify-center">
              <VideoIcon className="w-5 h-5 text-white" />
            </div>
            Mes vidéos ({data.videos.length})
          </h3>
          
          {data.videos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.videos.map((video, index) => {
                const videoId = getYouTubeVideoId(video.url);
                  return videoId ? (
                    <>
                        <iframe
                            key={index}
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`Vidéo ${index + 1}`}
                            className="w-[350px] h-[250px] rounded-lg border"
                            allowFullScreen
                        />
                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                            Vidéo {index + 1}
                        </div>
                        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
                    </>
                  ) : null;
                })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <VideoIcon className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg font-medium">Aucune vidéo disponible</p>
              <p className="text-slate-500 text-sm mt-1">Vos vidéos apparaîtront ici une fois ajoutées</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">💫</span>
              </div>
              <div>
                <p className="text-white font-medium">Tableau de bord participant</p>
                <p className="text-orange-300 text-sm">Suivez vos performances en temps réel</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span>Dernière mise à jour : il y a quelques instants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Effets de fond subtils */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-600/5 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
}