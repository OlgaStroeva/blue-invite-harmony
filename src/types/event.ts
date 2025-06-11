
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  gradient?: string;
  status?: "upcoming" | "in_progress" | "finished";
  createdBy: number;
  staff?: number[];
  participants?: Participant[];
}

export interface Participant {
  id: number;
  fullName: string;
  email: string;
  company?: string;
  position?: string;
  dietary?: string;
  response?: "attending" | "not_attending" | "pending";
  registeredAt: string;
}

export interface FormField {
  id: string;
  type: "text" | "email" | "textarea" | "select" | "checkbox" | "radio";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
}

export type EventStatus = "upcoming" | "in_progress" | "finished";
