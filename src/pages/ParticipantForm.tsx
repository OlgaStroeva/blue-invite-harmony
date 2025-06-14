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

const ParticipantForm = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [event, setEvent] = useState<Event | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [formId, setFormId] = useState<number | null>(null);


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (eventId) {
      // Получаем данные мероприятия
      fetch(`https://0.0.0.0:7291/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data) {
              setEvent({
                id: data.id,
                title: data.name,
                category: data.category,
                description: data.description,
                image: data.imageBase64,
                gradient: "from-blue-100 to-blue-300" // Пример градиента
              });
            }
          });

      // Получаем шаблон анкеты
      fetch(`https://0.0.0.0:7291/api/forms/get-by-event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.fields) {
              const fieldsWithIds = data.fields.map((f: any, i: number) => ({
                id: `field-${i}`,
                name: f.name,
                type: f.type,
                required: f.name.toLowerCase() === "email" // или f.required
              }));

              setFormFields(fieldsWithIds);
              setFormId(data.id); // 👈 сохраняем formId
            }
          });
    }
  }, [eventId]);


  const handleSubmit = async (data: Record<string, string>) => {
    const token = localStorage.getItem("token");

    try {
      const mappedData: Record<string, string> = {};

      formFields.forEach((field) => {
        const fieldName = field.name;
        const value = data[field.id]; // field.id из input формы, например: field-0
        if (value !== undefined) {
          mappedData[fieldName] = value;
        }
      });

      const response = await fetch(`https://0.0.0.0:7291/api/forms/add-participant/${formId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: [mappedData]
        })
      });


      const result = await response.json();

      if (response.ok) {
        toast({
          title: t("registrationComplete"),
          description: "Your information has been submitted"
        });
        setSubmitted(true);
      } else {
        toast({
          title: t("error"),
          description: result.message || "Submission failed",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: t("error"),
        description: "Network issue",
        variant: "destructive"
      });
    }
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
