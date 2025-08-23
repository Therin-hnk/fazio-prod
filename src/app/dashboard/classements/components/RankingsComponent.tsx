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
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-slate-400" />;
      case 3:
        return <Award className="w-4 h-4 text-orange-500" />;
      default:
        return <Star className="w-3 h-3 text-slate-300" />;
    }
  };

  // Obtenir la couleur du rang
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25';
      case 2:
        return 'bg-gradient-to-r from-slate-300 to-slate-400 text-white shadow-lg shadow-slate-400/25';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/25';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  // Générer le PDF pour un événement complet
  const generateEventPDF = (event: Event) => {
    const pdf = new jsPDF();
    let yPosition = 30;

    // Titre principal
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Classements - ${event.name}`, 20, yPosition);
    yPosition += 20;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);
    yPosition += 25;

    event.tournaments.forEach((tournament) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }

      // Titre du tournoi
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${tournament.name}`, 20, yPosition);
      yPosition += 15;

      tournament.phases.forEach((phase) => {
        if (yPosition > 230) {
          pdf.addPage();
          yPosition = 30;
        }

        // Titre de la phase
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${phase.name} (Ordre ${phase.order})`, 25, yPosition);
        yPosition += 10;

        const tableData = phase.participants.map((participant, index) => [
          (index + 1).toString(),
          `${participant.firstName} ${participant.lastName}`,
          participant.totalVotes.toString()
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [['Rang', 'Participant', 'Votes']],
          body: tableData,
          margin: { left: 30 },
          styles: { fontSize: 10, cellPadding: 4 },
          headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [248, 250, 252] }
        });

        yPosition = (pdf as any).lastAutoTable.finalY + 15;
      });
    });

    pdf.save(`classement-${event.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  // Générer le PDF pour un tournoi
  const generateTournamentPDF = (tournament: Tournament, eventName: string) => {
    const pdf = new jsPDF();
    let yPosition = 30;

    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${tournament.name}`, 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Événement: ${eventName}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);
    yPosition += 25;

    tournament.phases.forEach((phase) => {
      if (yPosition > 230) {
        pdf.addPage();
        yPosition = 30;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${phase.name} (Ordre ${phase.order})`, 20, yPosition);
      yPosition += 10;

      const tableData = phase.participants.map((participant, index) => [
        (index + 1).toString(),
        `${participant.firstName} ${participant.lastName}`,
        participant.totalVotes.toString()
      ]);

      autoTable(pdf, {
        startY: yPosition,
        head: [['Rang', 'Participant', 'Votes']],
        body: tableData,
        margin: { left: 25 },
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] }
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 15;
    });

    pdf.save(`classement-${tournament.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  // Générer le PDF pour une phase
  const generatePhasePDF = (phase: Phase, tournamentName: string, eventName: string) => {
    const pdf = new jsPDF();
    
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${phase.name}`, 20, 30);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Tournoi: ${tournamentName}`, 20, 50);
    pdf.text(`Événement: ${eventName}`, 20, 65);
    pdf.text(`Ordre: ${phase.order}`, 20, 80);
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 95);

    const tableData = phase.participants.map((participant, index) => [
      (index + 1).toString(),
      `${participant.firstName} ${participant.lastName}`,
      participant.totalVotes.toString()
    ]);

    autoTable(pdf, {
      startY: 110,
      head: [['Rang', 'Participant', 'Votes']],
      body: tableData,
      margin: { left: 20 },
      styles: { fontSize: 11, cellPadding: 5 },
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    pdf.save(`classement-${phase.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  // Générer le PDF global
  const generatePDF = () => {
    const pdf = new jsPDF();
    let yPosition = 30;

    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Classements Généraux', 20, yPosition);
    yPosition += 20;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);
    yPosition += 25;

    rankings.forEach((event) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }

      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${event.name}`, 20, yPosition);
      yPosition += 15;

      event.tournaments.forEach((tournament) => {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${tournament.name}`, 25, yPosition);
        yPosition += 10;

        tournament.phases.forEach((phase) => {
          if (yPosition > 230) {
            pdf.addPage();
            yPosition = 30;
          }

          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${phase.name} (Ordre ${phase.order})`, 30, yPosition);
          yPosition += 10;

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
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [248, 250, 252] }
          });

          yPosition = (pdf as any).lastAutoTable.finalY + 15;
        });
      });
    });

    pdf.save('classements-complets.pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Chargement des classements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Erreur de chargement</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Classements des Participants
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Consultez les résultats de tous les événements et téléchargez les classements
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={generatePDF}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl shadow-sm hover:bg-slate-800 hover:shadow-md transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              Télécharger tout
            </button>
          </div>
        </div>

        {rankings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun événement</h3>
            <p className="text-slate-500">Aucun événement n'a été trouvé.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {rankings.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Event Header */}
                <div className="bg-slate-900 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">{event.name}</h2>
                    </div>
                    <button
                      onClick={() => generateEventPDF(event)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {event.tournaments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500">Aucun tournoi disponible.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {event.tournaments.map((tournament) => (
                        <div key={tournament.id}>
                          {/* Tournament Header */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Trophy className="w-4 h-4 text-amber-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-slate-900">{tournament.name}</h3>
                            </div>
                            <button
                              onClick={() => generateTournamentPDF(tournament, event.name)}
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors duration-200"
                            >
                              <Download className="w-4 h-4" />
                              PDF
                            </button>
                          </div>

                          {tournament.phases.length === 0 ? (
                            <div className="text-center py-6">
                              <p className="text-slate-500">Aucune phase disponible.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {tournament.phases.map((phase) => (
                                <div key={phase.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                  {/* Phase Header */}
                                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center">
                                          <Users className="w-3 h-3 text-slate-600" />
                                        </div>
                                        <h4 className="font-medium text-slate-900">{phase.name}</h4>
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-slate-200 text-slate-700 rounded-full">
                                          Ordre {phase.order}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => generatePhasePDF(phase, tournament.name, event.name)}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-white text-slate-600 font-medium rounded-md border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
                                      >
                                        <Download className="w-3 h-3" />
                                        PDF
                                      </button>
                                    </div>
                                  </div>

                                  {/* Participants Table */}
                                  {phase.participants.length === 0 ? (
                                    <div className="p-8 text-center">
                                      <p className="text-slate-500">Aucun participant.</p>
                                    </div>
                                  ) : (
                                    <div className="overflow-x-auto">
                                      <table className="w-full">
                                        <thead className="bg-slate-100">
                                          <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                              Rang
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                              Participant
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                              Votes
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-200">
                                          {phase.participants.map((participant, index) => {
                                            const rank = index + 1;
                                            return (
                                              <tr 
                                                key={participant.id}
                                                className="hover:bg-slate-50 transition-colors duration-150"
                                              >
                                                <td className="px-6 py-4">
                                                  <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${getRankColor(rank)}`}>
                                                      {rank}
                                                    </div>
                                                    {getRankIcon(rank)}
                                                  </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                  <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                                      <span className="text-sm font-medium text-slate-700">
                                                        {participant.firstName[0]}{participant.lastName[0]}
                                                      </span>
                                                    </div>
                                                    <div className="font-medium text-slate-900">
                                                      {participant.firstName} {participant.lastName}
                                                    </div>
                                                  </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                  <div className="flex items-center justify-end gap-2">
                                                    <span className="text-lg font-semibold text-slate-900">
                                                      {participant.totalVotes.toLocaleString()}
                                                    </span>
                                                    <span className="text-sm text-slate-500">votes</span>
                                                  </div>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
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
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Précédent
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Page</span>
              <span className="px-3 py-1 bg-slate-900 text-white rounded-lg font-semibold">{page}</span>
              <span className="text-slate-600">sur {Math.ceil(pagination.total / pagination.limit)}</span>
            </div>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * pagination.limit >= pagination.total}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
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