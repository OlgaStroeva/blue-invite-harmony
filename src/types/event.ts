
export interface Event {
  id: number;
  title: string;
  category: string;
  description?: string;
  image: string;
  gradient: string;
  date?: string;
  place?: string;
  status?: 'upcoming' | 'in_progress' | 'finished';
  organizerId?: number; // ID of the user who created the event
}
