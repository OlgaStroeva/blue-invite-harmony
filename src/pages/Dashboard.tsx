
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Image, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EventFormDialog from "@/components/events/EventFormDialog";

interface Event {
  id: number;
  title: string;
  category: string;
  description?: string;
  image: string;
  gradient: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "Elegant Blue",
    category: "Wedding",
    image: "",
    gradient: "from-blue-100 to-blue-200",
  },
  {
    id: 2,
    title: "Modern Sapphire",
    category: "Corporate",
    image: "",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    id: 3,
    title: "Sky Celebration",
    category: "Birthday",
    image: "",
    gradient: "from-blue-300 to-blue-500",
  },
  {
    id: 4,
    title: "Ocean Waves",
    category: "Party",
    image: "",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: 5,
    title: "Azure Delight",
    category: "Wedding",
    image: "",
    gradient: "from-blue-200 to-blue-400",
  },
  {
    id: 6,
    title: "Navy Elegance",
    category: "Formal",
    image: "",
    gradient: "from-blue-700 to-blue-900",
  },
];

const Dashboard = () => {
  const [userEvents, setUserEvents] = useState<Event[]>(events);
  const [activeCategory, setActiveCategory] = useState("All");
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [userEvents]);

  const categories = ["All", "Wedding", "Birthday", "Corporate", "Party", "Formal"];
  const filteredEvents = activeCategory === "All" 
    ? userEvents 
    : userEvents.filter(event => event.category === activeCategory);

  const handleAddEvent = () => {
    setIsDialogOpen(true);
  };

  const handleEventCreated = (newEvent: Event) => {
    setUserEvents((prev) => [newEvent, ...prev]);
  };

  return (
    <div className="min-h-screen bg-blue-100 text-foreground overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <section className="py-8 relative" ref={sectionRef}>
          {/* Background decorations */}
          <div className="absolute top-1/2 right-0 w-1/3 h-1/3 bg-blue-300/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-200/30 rounded-full blur-[80px]" />
          
          <Container>
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">
                Your <span className="text-gradient">Events</span>
              </h1>
              <p className="text-blue-700 max-w-2xl mx-auto">
                Manage your events and create new invitations
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
                  {category}
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
                      
                      {/* Event content preview */}
                      <div className="relative z-10">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-white/80 text-blue-700 rounded-md backdrop-blur-sm">
                          {event.category}
                        </span>
                        {event.description && (
                          <div className="mt-4 p-3 bg-white/70 rounded-md backdrop-blur-sm">
                            <p className="text-sm text-blue-900 line-clamp-3">{event.description}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="relative z-10 mt-auto">
                        <h3 className="text-lg font-medium text-white drop-shadow-sm mb-1">
                          {event.title}
                        </h3>
                        <div className="flex justify-between items-center">
                          <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white text-blue-600 text-xs backdrop-blur-sm">
                            Edit
                          </Button>
                          <Button size="sm" className="bg-blue-600/90 hover:bg-blue-600 text-white text-xs backdrop-blur-sm">
                            Send Invites
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Floating Action Button */}
        <button
          onClick={handleAddEvent}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-highlight z-20"
          aria-label="Create new event"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Event Creation Dialog */}
        <EventFormDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          onEventCreated={handleEventCreated}
        />
      </main>
    </div>
  );
};

export default Dashboard;
