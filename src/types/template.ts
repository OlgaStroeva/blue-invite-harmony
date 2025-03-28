
import { FormField } from "./form";

export interface Template {
  id: number;
  name: string;
  eventId: number;
  fields: FormField[];
}
