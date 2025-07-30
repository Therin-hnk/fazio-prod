export interface Vote {
  id: string;
  voteCount: number;
}

export interface Video {
  id: string;
  url: string;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  description: string | null | undefined;
  matricule: string | null | undefined;
  birthDate: string | null | undefined;
  eventId: string;
  password: string;
  avatarUrl: string | null | undefined;
  event: { id: string; name: string } | null | undefined;
  votes: Vote[];
  videos: Video[];
}