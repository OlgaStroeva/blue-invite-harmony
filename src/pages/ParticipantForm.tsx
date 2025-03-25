
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from "@/components/ui/form";
import { Mail, CheckCircle } from "lucide-react";

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date';
  required: boolean;
  options?: string[];
}

interface Event {
  id: number;
  title: string;
  category: string;
  description?: string;
  image: string;
  gradient: string;
}

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
      { id: "email", name: "Email", type: "email" as const, required: true },
      { id: "name", name: "Full Name", type: "text" as const, required: true },
      { id: "dietary", name: "Dietary Restrictions", type: "text" as const, required: false },
    ]
  },
  {
    id: 2,
    eventId: 2,
    fields: [
      { id: "email", name: "Email", type: "email" as const, required: true },
      { id: "name", name: "Full Name", type: "text" as const, required: true },
      { id: "company", name: "Company", type: "text" as const, required: true },
      { id: "position", name: "Position", type: "text" as const, required: false },
    ]
  }
];

const ParticipantForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm({
    defaultValues: {},
  });

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
          
          // Set default values for the form
          const defaultValues: Record<string, string> = {};
          template.fields.forEach(field => {
            defaultValues[field.id] = "";
          });
          form.reset(defaultValues);
        }
      }
    }
  }, [eventId, form]);

  const onSubmit = (data: Record<string, string>) => {
    console.log("Form submitted:", data);
    
    // Display success toast and set submitted state
    toast({
      title: "Registration successful!",
      description: "Your information has been submitted",
    });
    
    setSubmitted(true);
    
    // In a real app, you would send this data to your backend
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-blue-700">Event Not Found</h1>
          <p className="text-blue-600 mt-2">The event you're looking for doesn't exist or has been removed.</p>
          <Button 
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-semibold text-blue-700">Registration Complete!</h1>
          <p className="text-blue-600 mt-2">
            Thank you for registering for {event.title}. We've sent a confirmation email to your address.
          </p>
          <Button 
            className="mt-6 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Header */}
          <div 
            className={`p-8 bg-gradient-to-r ${event.gradient} text-white`}
            style={event.image ? {
              backgroundImage: `url(${event.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            } : {}}
          >
            {event.image && (
              <div className="absolute inset-0 bg-black opacity-50"></div>
            )}
            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                {event.category}
              </span>
              <h1 className="text-3xl font-bold mt-3">{event.title}</h1>
              {event.description && (
                <p className="mt-2 text-white/90">{event.description}</p>
              )}
            </div>
          </div>
          
          {/* Registration Form */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-6 flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Registration Form
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {formFields.map((field) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.id}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">
                          {field.name} {field.required && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...formField}
                            type={field.type}
                            placeholder={`Enter ${field.name.toLowerCase()}`}
                            required={field.required}
                            className="border-blue-200 focus-visible:ring-blue-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit Registration
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantForm;
