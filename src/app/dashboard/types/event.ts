export interface Event {
  id: string;
  name: string;
  description?: string;
  organizerId: string;
  status: 'active' | 'completed' | 'canceled';
  organizer?: Organizer;
}

export interface Organizer {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}