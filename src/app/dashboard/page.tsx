'use client'

import { useEffect, useState } from 'react';

// Interfaces TypeScript (inchangées, pour référence)
interface SponsorStats {
  data: Array<{
    id: string;
    viewCount: number;
    clickCount: number;
    createdAt: string;
    sponsor: { id: string; name: string };
    event?: { id: string; name: string };
    tournament?: { id: string; name: string };
  }>;
  totalViews: number;
  totalClicks: number;
}

interface EventStats {
  data: Array<{
    id: string;
    name: string;
    status: string;
    _count: { participants: number; tournaments: number; sponsors: number };
  }>;
  totalEvents: number;
  eventsByStatus: Array<{ status: string; _count: { id: number } }>;
}

interface TournamentStats {
  data: Array<{
    id: string;
    name: string;
    event: { id: string; name: string };
    _count: { phases: number };
    participantCount: number;
  }>;
  totalTournaments: number;
}

interface VoteStats {
  data: Array<{
    id: string;
    voteCount: number;
    participant: { id: string; firstName: string; lastName: string };
    phase: { id: string; name: string; tournament: { event: { id: string; name: string } } };
  }>;
  totalVotes: number;
}

interface PaymentStats {
  data: Array<{
    id: string;
    amount: number;
    status: string;
    voteCount: number;
    tournament: { id: string; name: string };
  }>;
  totalPayments: number;
  totalAmount: number;
  paymentsByStatus: Array<{ status: string; _count: { id: number } }>;
}

interface UserStats {
  data: Array<{
    id: string;
    role: string;
    _count: { events: number };
  }>;
  totalUsers: number;
  usersByRole: Array<{ role: string; _count: { id: number } }>;
}

interface SponsorDetails {
  data: Array<{
    id: string;
    name: string;
    sponsorshipType: string;
    contributionAmount: number | null;
  }>;
  totalSponsors: number;
  sponsorsByType: Array<{ sponsorshipType: string; _count: { id: number } }>;
  totalContribution: number;
}

interface RewardStats {
  data: Array<{
    id: string;
    name: string;
    value: number | null;
    tournament: { id: string; name: string };
    sponsor?: { id: string; name: string };
  }>;
  totalRewards: number;
  totalRewardValue: number;
}

interface NewsAndVideos {
  news: Array<{
    id: string;
    title: string;
    event?: { id: string; name: string };
  }>;
  totalNews: number;
  totalEventVideos: number;
  totalParticipantVideos: number;
}

interface Stats {
  sponsorStats: SponsorStats;
  eventStats: EventStats;
  tournamentStats: TournamentStats;
  voteStats: VoteStats;
  paymentStats: PaymentStats;
  userStats: UserStats;
  sponsorDetails: SponsorDetails;
  rewardStats: RewardStats;
  newsAndVideos: NewsAndVideos;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  useEffect(() => {
    async function fetchStats() {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (userId) {
          headers['x-user-id'] = userId;
        }
        const response = await fetch('/api/admin/stats', { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data: Stats = await response.json();
        setStats(data);
      } catch (err) {
        setError('Erreur lors de la récupération des statistiques');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-orange-500 text-2xl font-semibold animate-pulse">
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 text-2xl font-semibold animate-bounce">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in forwards;
        }
        .hover-scale:hover {
          transform: scale(1.03);
          transition: transform 0.2s ease-in-out;
        }
        .hover-lift:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          transition: all 0.2s ease-in-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center animate-slide-up">
          Statistiques de la plateforme
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg hover-scale animate-slide-up">
            <h2 className="text-xl font-semibold">Événements</h2>
            <p className="text-3xl font-bold">{stats.eventStats.totalEvents}</p>
            <p className="text-sm">Total</p>
          </div>
          <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg hover-scale animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-semibold">Sponsors</h2>
            <p className="text-3xl font-bold">{stats.sponsorDetails.totalSponsors}</p>
            <p className="text-sm">Total</p>
          </div>
          <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg hover-scale animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-semibold">Votes</h2>
            <p className="text-3xl font-bold">{stats.voteStats.totalVotes}</p>
            <p className="text-sm">Total</p>
          </div>
        </div>

        {/* Sponsor Stats */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques des sponsors</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
            <p className="text-gray-700 mb-2">Total Vues: <span className="font-bold">{stats.sponsorStats.totalViews}</span></p>
            <p className="text-gray-700 mb-4">Total Clics: <span className="font-bold">{stats.sponsorStats.totalClicks}</span></p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-gray-900 font-semibold">Sponsor</th>
                    <th className="p-3 text-gray-900 font-semibold">Événement</th>
                    <th className="p-3 text-gray-900 font-semibold">Tournoi</th>
                    <th className="p-3 text-gray-900 font-semibold">Vues</th>
                    <th className="p-3 text-gray-900 font-semibold">Clics</th>
                    <th className="p-3 text-gray-900 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.sponsorStats.data.map((stat, index) => (
                    <tr key={stat.id} className="border-b animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="p-3">{stat.sponsor.name}</td>
                      <td className="p-3">{stat.event?.name || '-'}</td>
                      <td className="p-3">{stat.tournament?.name || '-'}</td>
                      <td className="p-3">{stat.viewCount}</td>
                      <td className="p-3">{stat.clickCount}</td>
                      <td className="p-3">{new Date(stat.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Event Stats */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques des événements</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
            <p className="text-gray-700 mb-4">Répartition par statut:</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {stats.eventStats.eventsByStatus.map((status, index) => (
                <li key={status.status} className="text-gray-700 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <span className="font-bold">{status.status}</span>: {status._count.id}
                </li>
              ))}
            </ul>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-gray-900 font-semibold">Nom</th>
                    <th className="p-3 text-gray-900 font-semibold">Statut</th>
                    <th className="p-3 text-gray-900 font-semibold">Participants</th>
                    <th className="p-3 text-gray-900 font-semibold">Tournois</th>
                    <th className="p-3 text-gray-900 font-semibold">Sponsors</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.eventStats.data.map((event, index) => (
                    <tr key={event.id} className="border-b animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="p-3">{event.name}</td>
                      <td className="p-3">{event.status}</td>
                      <td className="p-3">{event._count.participants}</td>
                      <td className="p-3">{event._count.tournaments}</td>
                      <td className="p-3">{event._count.sponsors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tournament Stats */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques des tournois</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
            <p className="text-gray-700 mb-4">Total Tournois: <span className="font-bold">{stats.tournamentStats.totalTournaments}</span></p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-gray-900 font-semibold">Nom</th>
                    <th className="p-3 text-gray-900 font-semibold">Événement</th>
                    <th className="p-3 text-gray-900 font-semibold">Phases</th>
                    <th className="p-3 text-gray-900 font-semibold">Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.tournamentStats.data.map((tournament, index) => (
                    <tr key={tournament.id} className="border-b animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="p-3">{tournament.name}</td>
                      <td className="p-3">{tournament.event.name}</td>
                      <td className="p-3">{tournament._count.phases}</td>
                      <td className="p-3">{tournament.participantCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Vote Stats */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques des votes</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
            <p className="text-gray-700 mb-4">Total Votes: <span className="font-bold">{stats.voteStats.totalVotes}</span></p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-gray-900 font-semibold">Participant</th>
                    <th className="p-3 text-gray-900 font-semibold">Phase</th>
                    <th className="p-3 text-gray-900 font-semibold">Événement</th>
                    <th className="p-3 text-gray-900 font-semibold">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.voteStats.data.map((vote, index) => (
                    <tr key={vote.id} className="border-b animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="p-3">{`${vote.participant.firstName} ${vote.participant.lastName}`}</td>
                      <td className="p-3">{vote.phase.name}</td>
                      <td className="p-3">{vote.phase.tournament.event.name}</td>
                      <td className="p-3">{vote.voteCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Payment Stats */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques des paiements</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
            <p className="text-gray-700 mb-2">Total Paiements: <span className="font-bold">{stats.paymentStats.totalPayments}</span></p>
            <p className="text-gray-700 mb-4">Montant Total: <span className="font-bold">{stats.paymentStats.totalAmount}</span></p>
            <p className="text-gray-700 mb-4">Répartition par statut:</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {stats.paymentStats.paymentsByStatus.map((status, index) => (
                <li key={status.status} className="text-gray-700 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <span className="font-bold">{status.status}</span>: {status._count.id}
                </li>
              ))}
            </ul>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-gray-900 font-semibold">Tournoi</th>
                    <th className="p-3 text-gray-900 font-semibold">Montant</th>
                    <th className="p-3 text-gray-900 font-semibold">Statut</th>
                    <th className="p-3 text-gray-900 font-semibold">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.paymentStats.data.map((payment, index) => (
                    <tr key={payment.id} className="border-b animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="p-3">{payment.tournament.name}</td>
                      <td className="p-3">{payment.amount}</td>
                      <td className="p-3">{payment.status}</td>
                      <td className="p-3">{payment.voteCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* User Stats */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques des utilisateurs</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
            <p className="text-gray-700 mb-2">Total Utilisateurs: <span className="font-bold">{stats.userStats.totalUsers}</span></p>
            <p className="text-gray-700 mb-4">Répartition par rôle:</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {stats.userStats.usersByRole.map((role, index) => (
                <li key={role.role} className="text-gray-700 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <span className="font-bold">{role.role}</span>: {role._count.id}
                </li>
              ))}
            </ul>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-gray-900 font-semibold">ID</th>
                    <th className="p-3 text-gray-900 font-semibold">Rôle</th>
                    <th className="p-3 text-gray-900 font-semibold">Événements créés</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.userStats.data.map((user, index) => (
                    <tr key={user.id} className="border-b animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="p-3">{user.id}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">{user._count.events}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sponsor Details */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Détails des sponsors</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
            <p className="text-gray-700 mb-2">Total Sponsors: <span className="font-bold">{stats.sponsorDetails.totalSponsors}</span></p>
            <p className="text-gray-700 mb-4">Contribution Totale: <span className="font-bold">{stats.sponsorDetails.totalContribution}</span></p>
            <p className="text-gray-700 mb-4">Répartition par type:</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {stats.sponsorDetails.sponsorsByType.map((type, index) => (
                <li key={type.sponsorshipType} className="text-gray-700 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <span className="font-bold">{type.sponsorshipType}</span>: {type._count.id}
                </li>
              ))}
            </ul>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-gray-900 font-semibold">Nom</th>
                    <th className="p-3 text-gray-900 font-semibold">Type</th>
                    <th className="p-3 text-gray-900 font-semibold">Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.sponsorDetails.data.map((sponsor, index) => (
                    <tr key={sponsor.id} className="border-b animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="p-3">{sponsor.name}</td>
                      <td className="p-3">{sponsor.sponsorshipType}</td>
                      <td className="p-3">{sponsor.contributionAmount ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Reward Stats */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques des récompenses</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
            <p className="text-gray-700 mb-2">Total Récompenses: <span className="font-bold">{stats.rewardStats.totalRewards}</span></p>
            <p className="text-gray-700 mb-4">Valeur Totale: <span className="font-bold">{stats.rewardStats.totalRewardValue}</span></p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-gray-900 font-semibold">Nom</th>
                    <th className="p-3 text-gray-900 font-semibold">Tournoi</th>
                    <th className="p-3 text-gray-900 font-semibold">Sponsor</th>
                    <th className="p-3 text-gray-900 font-semibold">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.rewardStats.data.map((reward, index) => (
                    <tr key={reward.id} className="border-b animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="p-3">{reward.name}</td>
                      <td className="p-3">{reward.tournament.name}</td>
                      <td className="p-3">{reward.sponsor?.name ?? '-'}</td>
                      <td className="p-3">{reward.value ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* News and Videos */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Statistiques des actualités et vidéos</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
            <p className="text-gray-700 mb-2">Total Actualités: <span className="font-bold">{stats.newsAndVideos.totalNews}</span></p>
            <p className="text-gray-700 mb-2">{"Total Vidéos d'événements"}: <span className="font-bold">{stats.newsAndVideos.totalEventVideos}</span></p>
            <p className="text-gray-700 mb-4">Total Vidéos de participants: <span className="font-bold">{stats.newsAndVideos.totalParticipantVideos}</span></p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-gray-900 font-semibold">Titre</th>
                    <th className="p-3 text-gray-900 font-semibold">Événement</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.newsAndVideos.news.map((news, index) => (
                    <tr key={news.id} className="border-b animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="p-3">{news.title}</td>
                      <td className="p-3">{news.event?.name ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}