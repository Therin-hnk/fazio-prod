export interface EventVideo {
  id: string;
  url: string;
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
  tournaments: any[]; // Remplacer par le type approprié si défini
  participants: any[]; // Remplacer par le type approprié si défini
  sponsors: any[]; // Remplacer par le type approprié si défini
  sponsorStats: any[]; // Remplacer par le type approprié si défini
  news: any[]; // Remplacer par le type approprié si défini
  videos: EventVideo[];
}

export interface Organizer {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}