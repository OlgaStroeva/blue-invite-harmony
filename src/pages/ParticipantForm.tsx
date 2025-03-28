
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Event } from "@/types/event";
import { FormField } from "@/types/form";
import EventHeader from "@/components/participant/EventHeader";
import SuccessMessage from "@/components/participant/SuccessMessage";
import EventNotFound from "@/components/participant/EventNotFound";
import RegistrationForm from "@/components/participant/RegistrationForm";

// Mock events and form templates - in a real app, this would come from a database
const mockEvents = [
  {
    id: 1,
    title: "Summer Wedding",
    category: "Wedding",
    description: "Join us for our special day!",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop",
    gradient: "from-rose-400 to-orange-300",
  },
  {
    id: 2,
    title: "Annual Tech Conference",
    category: "Corporate",
    description: "The biggest tech event of the year",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    gradient: "from-blue-400 to-indigo-500",
  }
];

const mockFormTemplates = [
  {
    id: 1,
    eventId: 1,
    fields: [
      { id: "email", name: "email", type: "email" as const, required: true },
      { id: "name", name: "fullName", type: "text" as const, required: true },
      { id: "dietary", name: "dietary", type: "text" as const, required: false },
    ]
  },
  {
    id: 2,
    eventId: 2,
    fields: [
      { id: "email", name: "email", type: "email" as const, required: true },
      { id: "name", name: "fullName", type: "text" as const, required: true },
      { id: "company", name: "company", type: "text" as const, required: true },
      { id: "position", name: "position", type: "text" as const, required: false },
    ]
  }
];

const ParticipantForm = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [event, setEvent] = useState<Event | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Find event and its form template
    if (eventId) {
      const foundEvent = mockEvents.find(e => e.id.toString() === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
        
        // Find form template for this event
        const template = mockFormTemplates.find(t => t.eventId.toString() === eventId);
        if (template) {
          setFormFields(template.fields);
        }
      }
    }
  }, [eventId]);

  const handleSubmit = (data: Record<string, string | number>) => {
    console.log("Form submitted:", data);
    
    // Display success toast and set submitted state
    toast({
      title: t("registrationComplete"),
      description: "Your information has been submitted",
    });
    
    setSubmitted(true);
    
    // In a real app, you would send this data to your backend
  };

  if (!event) {
    return <EventNotFound />;
  }

  if (submitted) {
    return <SuccessMessage eventTitle={event.title} />;
  }

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Header */}
          <EventHeader event={event} />
          
          {/* Registration Form */}
          <RegistrationForm formFields={formFields} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ParticipantForm;
