export interface EventVideo {
  id: string;
  url: string;
}

export interface Organizer {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  votes: Vote[];
  totalVotes?: number;
  description: string | null;
  videos?: participantVideos[];
}

export interface participantVideos {
  id: string;
  url: string;
  phaseId: string;
}

export interface Vote {
  voteCount: number;
  phaseId: string;
  participantId: string;
}

export interface Phase {
  id: string;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  tournamentId: string;
  participants: Participant[];
  tournament: Tournament | null;
  votes: Vote[];
  order: number;
}

export interface Tournament {
  id: string;
  name: string;
  eventId: string;
  description: string | null;
  image: string | null;
  logoUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  phases: Phase[];
  event: Event | null;
}

export interface Event {
  id: string;
  name: string;
  description: string | null;
  organizerId: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  image: string | null;
  status: 'coming' | 'ongoing' | 'completed' | 'canceled';
  createdAt: string;
  organizer: Organizer | null;
  tournaments: Tournament[];
  participants: Participant[];
  sponsors: any[]; // Non utilisé pour le moment
  sponsorStats: any[]; // Non utilisé pour le moment
  news: any[]; // Non utilisé pour le moment
  videos: EventVideo[];
  totalVotes: number | 0;
  votePrice: number;
}