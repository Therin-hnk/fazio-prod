import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Trophy, Users, Calendar, Medal, Award, Star } from 'lucide-react';

// Interface pour typer les données de classement
interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  description?: string;
  totalVotes: number;
}

interface Phase {
  id: string;
  name: string;
  order: number;
  startDate: string;
  endDate: string;
  participants: Participant[];
}

interface Tournament {
  id: string;
  name: string;
  phases: Phase[];
}

interface Event {
  id: string;
  name: string;
  tournaments: Tournament[];
}

interface ApiResponse {
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Composant principal
const RankingsComponent: React.FC = () => {
  const [rankings, setRankings] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  // Récupérer les classements depuis l'API
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (userId) {
          headers['x-user-id'] = userId;
        }
        const response = await fetch('/api/admin/events/get', { headers });
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des classements');
        }
        const { data, pagination }: ApiResponse = await response.json();
        setRankings(data);
        setPagination(pagination);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setLoading(false);
      }
    };

    fetchRankings();
  }, [page]);

  // Obtenir l'icône du rang
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-300" />;
    }
  };

  // Obtenir la couleur du rang
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Générer le PDF
  const generatePDF = () => {
    const pdf = new jsPDF();
    let yPosition = 20;

    // Titre principal
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Classements des Participants', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);
    yPosition += 20;

    rankings.forEach((event) => {
      // Vérifier si on a assez d'espace pour le titre de l'événement
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Titre de l'événement
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Événement: ${event.name}`, 20, yPosition);
      yPosition += 15;

      event.tournaments.forEach((tournament) => {
        // Titre du tournoi
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Tournoi: ${tournament.name}`, 25, yPosition);
        yPosition += 10;

        tournament.phases.forEach((phase) => {
          // Vérifier si on a assez d'espace pour la phase
          if (yPosition > 230) {
            pdf.addPage();
            yPosition = 20;
          }

          // Titre de la phase
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Phase: ${phase.name} (Ordre ${phase.order})`, 30, yPosition);
          yPosition += 10;

          // Créer le tableau des participants
          const tableData = phase.participants.map((participant, index) => [
            (index + 1).toString(),
            `${participant.firstName} ${participant.lastName}`,
            participant.totalVotes.toString()
          ]);

          autoTable(pdf, {
            startY: yPosition,
            head: [['Rang', 'Participant', 'Votes']],
            body: tableData,
            margin: { left: 35 },
            styles: {
              fontSize: 10,
              cellPadding: 3
            },
            headStyles: {
              fillColor: [59, 130, 246],
              textColor: 255,
              fontStyle: 'bold'
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            }
          });

          yPosition = (pdf as any).lastAutoTable.finalY + 15;
        });
      });
    });

    // Télécharger le PDF
    pdf.save('classements-participants.pdf');
  };


  // Affichage en cas de chargement ou d'erreur
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Chargement des classements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            🏆 Classements des Participants
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Découvrez les résultats de tous les événements et tournois
          </p>
          
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger en PDF
          </button>
        </div>

        {rankings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-xl text-gray-500">Aucun événement trouvé.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {rankings.map((event, eventIndex) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Event Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">{event.name}</h2>
                  </div>
                </div>

                <div className="p-6">
                  {event.tournaments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Aucun tournoi trouvé.</p>
                  ) : (
                    <div className="space-y-8">
                      {event.tournaments.map((tournament) => (
                        <div key={tournament.id}>
                          {/* Tournament Header */}
                          <div className="flex items-center space-x-3 mb-6">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-xl font-semibold text-gray-800">{tournament.name}</h3>
                          </div>

                          {tournament.phases.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Aucune phase trouvée.</p>
                          ) : (
                            <div className="space-y-6">
                              {tournament.phases.map((phase) => (
                                <div key={phase.id} className="bg-gray-50 rounded-xl p-6">
                                  {/* Phase Header */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                      <Users className="w-5 h-5 text-blue-500" />
                                      <h4 className="text-lg font-medium text-gray-800">
                                        {phase.name}
                                      </h4>
                                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        Ordre {phase.order}
                                      </span>
                                    </div>
                                  </div>

                                  {phase.participants.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">Aucun participant trouvé.</p>
                                  ) : (
                                    <div className="overflow-hidden rounded-lg">
                                      <div className="overflow-x-auto">
                                        <table className="w-full">
                                          <thead>
                                            <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                                              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                                Rang
                                              </th>
                                              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                                Participant
                                              </th>
                                              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">
                                                Votes
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-200">
                                            {phase.participants.map((participant, index) => {
                                              const rank = index + 1;
                                              return (
                                                <tr 
                                                  key={participant.id} 
                                                  className="hover:bg-blue-50 transition-colors duration-150"
                                                >
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankColor(rank)}`}>
                                                        {rank}
                                                      </div>
                                                      {getRankIcon(rank)}
                                                    </div>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                      <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                                                          {participant.firstName[0]}{participant.lastName[0]}
                                                        </div>
                                                      </div>
                                                      <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                          {participant.firstName} {participant.lastName}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                      <span className="text-lg font-bold text-gray-900">
                                                        {participant.totalVotes.toLocaleString()}
                                                      </span>
                                                      <span className="text-sm text-gray-500">votes</span>
                                                    </div>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total > pagination.limit && (
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Précédent
            </button>
            <span className="flex items-center space-x-2">
              <span className="text-gray-600">Page</span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold">{page}</span>
              <span className="text-gray-600">sur {Math.ceil(pagination.total / pagination.limit)}</span>
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * pagination.limit >= pagination.total}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingsComponent;