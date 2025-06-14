import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Image, Plus, Mail, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EventFormDialog from "@/components/events/EventFormDialog";
import EventEditDialog from "@/components/events/EventEditDialog";
import InvitationFormDialog from "@/components/invitations/InvitationFormDialog";
import EmployeeManagementDialog from "@/components/employees/EmployeeManagementDialog";
import EventStatusButton from "@/components/events/EventStatusButton";
import { Event } from "@/types/event";
import EventViewDialog from "@/components/events/EventViewDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface Event {
  id: number;
  title: string;
  category: string;
  description?: string;
  image: string;
  gradient: string;
}
const blueGradients = [
  "from-blue-100 to-blue-200",
  "from-blue-300 to-blue-400",
  "from-blue-500 to-blue-600",
  "from-blue-700 to-blue-800",
  "from-blue-900 to-blue-950"
];

const events: Event[] = await fetch("https://0.0.0.0:7291/api/events/my-events", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  }
})
    .then((res) => res.json())
    .then((data) =>
        data.map((event: any, index: number) => ({
          id: event.id,
          title: event.name, // если приходит "name", а не "title"
          category: event.category || "Uncategorized",
          description: event.description || "",
          image: event.imageBase64 || "",
          gradient: blueGradients[index % blueGradients.length],
          status: event.status,
          createdBy : event.createdBy
        }))
    )
    .catch((err) => {
      console.error("Ошибка загрузки мероприятий:", err);
      return [];
    });

const categories: string[] = await fetch("https://0.0.0.0:7291/api/events/my-events", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  }
})
    .then((res) => res.json())
    .then((data) => {
      const rawCategories = data.map((event: any) => event.category);
      const rawStatuses = data.map((event: any) => event.status);

      const combined = [...rawCategories, ...rawStatuses].filter(
          (v) => typeof v === "string" && v.trim() !== ""
      );

      return ["All", ...Array.from(new Set(combined))];
    })
    .catch((err) => {
      console.error("Ошибка загрузки категорий и статусов:", err);
      return [];
    });


const Dashboard = () => {
  const [userEvents, setUserEvents] = useState<Event[]>(events);
  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Start animating items sequentially
              userEvents.forEach((_, index) => {
                setTimeout(() => {
                  setAnimatedItems((prev) => [...prev, index]);
                }, 150 * index);
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
    );
  console.error(events);
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [userEvents]);  

  const [activeCategory, setActiveCategory] = useState("All");
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const filteredEvents = activeCategory === "All" 
    ? userEvents 
    : userEvents.filter(event => event.category === activeCategory);

  const handleAddEvent = () => {
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleOpenInvitations = (event: Event) => {
    setCurrentEvent(event);
    setIsInvitationDialogOpen(true);
  };

  const handleEventCreated = (newEvent: Event) => {
    setUserEvents((prev) => {
      const exists = prev.some(e => e.id === newEvent.id);
      window.location.reload();
      return exists ? prev : [newEvent, ...prev];
    });

  };

  const handleEventUpdated = (updatedEvent: Event) => {
    setUserEvents((prev) =>
        prev.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
        )
    );
    toast({
      title: "Event Updated",
      description: "Your event has been updated successfully!",
    });
  };
  const handleStatusChange = (eventId: number, newStatus: string) => {
    setUserEvents(prev =>
        prev.map(e =>
            e.id === eventId ? { ...e, status: newStatus } : e
        )
    );
  };

  const handleEventStatusChange = (eventToUpdate: Event, newStatus: 'upcoming' | 'in_progress' | 'finished') => {
    setUserEvents(prev => 
      prev.map(event => 
        event.id === eventToUpdate.id 
          ? { ...event, status: newStatus }
          : event
      )
    );
    
    let statusMessage = "";
    if (newStatus === "upcoming") statusMessage = t("markedAsUpcoming");
    else if (newStatus === "in_progress") statusMessage = t("markedAsInProgress");
    else statusMessage = t("markedAsFinished");
    
    toast({
      title: t("eventStatusUpdated"),
      description: statusMessage,
    });
  };

  const handleViewEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-blue-100 text-foreground overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <section className="py-8 relative" ref={sectionRef}>
          <div className="absolute top-1/2 right-0 w-1/3 h-1/3 bg-blue-300/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-200/30 rounded-full blur-[80px]" />
          
          <Container>
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">
                {t("yourEvents")}
              </h1>
              <p className="text-blue-700 max-w-2xl mx-auto">
                {t("manageEvents")}
              </p>
            </div>

            <div className="mb-10 flex items-center justify-center flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {t(category?.toLowerCase?.() || category || "unknown")}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`transition-all duration-500 ${
                    animatedItems.includes(index)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                >
                  <div className="rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
                    <div 
                      className={`aspect-[4/5] ${
                        event.image 
                          ? "" 
                          : `bg-gradient-to-br ${event.gradient}`
                      } relative p-6 flex flex-col justify-between`}
                      style={event.image ? { backgroundImage: `url(${event.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                      <div className="absolute inset-0 bg-blue-900/5 group-hover:bg-blue-900/0 transition-all duration-300"></div>
                      
                      <div className="relative z-10">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-white/80 text-blue-700 rounded-md backdrop-blur-sm">
                          {t(event.category.toLowerCase())}
                        </span>
                      </div>
                      
                      <div className="relative z-10 mt-auto">
                        <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg">
                          <h3 className="text-lg font-medium text-white mb-3">
                            {event.title}
                          </h3>
                          <div className="flex justify-between items-center gap-2">
                            <Button 
                              size="sm" 
                              className="bg-white/90 hover:bg-white text-blue-600 text-xs"
                              onClick={() => handleViewEvent(event)}
                            >
                              {t("open")}
                            </Button>
                            <EventStatusButton 
                              event={event} 
                              onStatusChange={handleEventStatusChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <button
          onClick={handleAddEvent}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-highlight z-20"
          aria-label={t("createNewEvent")}
        >
          <Plus className="w-6 h-6" />
        </button>

        <EventFormDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          onEventCreated={handleEventCreated}
        />

        {currentEvent && (
          <>
            <EventEditDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              event={currentEvent}
              onEventUpdated={handleEventUpdated}
            />
            
            <InvitationFormDialog
              open={isInvitationDialogOpen}
              onOpenChange={setIsInvitationDialogOpen}
              event={currentEvent}
            />

            <EmployeeManagementDialog
              open={isEmployeeDialogOpen}
              onOpenChange={setIsEmployeeDialogOpen}
              event={currentEvent}
            />

            <EventViewDialog
              open={isViewDialogOpen}
              onOpenChange={setIsViewDialogOpen}
              event={currentEvent}
              onEventUpdated={handleEventUpdated}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
