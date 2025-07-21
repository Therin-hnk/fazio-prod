export interface Event {
  id: string;
  name: string;
  description?: string;
  videos?: string[];
  organizerId: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status: 'coming' | 'ongoing' | 'finished' | 'cancelled';
  organizer?: Organizer;
}

export interface Organizer {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}