
export interface Event {
  id: number;
  title: string;
  description?: string;
  date?: string;
  place?: string;
  category: string;
  image?: string;
  createdBy: number;
  gradient?: string;
}
