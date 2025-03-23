
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { Image } from "lucide-react";

interface Event {
  id: number;
  title: string;
  category: string;
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

const Events = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start animating items sequentially
            events.forEach((_, index) => {
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
  }, []);

  const categories = ["All", "Wedding", "Birthday", "Corporate", "Party", "Formal"];
  const filteredEvents = activeCategory === "All" 
    ? events 
    : events.filter(event => event.category === activeCategory);

  return (
    <section id="events" className="py-20 relative bg-gradient-to-b from-blue-50/50 to-transparent" ref={sectionRef}>
      {/* Background decorations */}
      <div className="absolute top-1/2 right-0 w-1/3 h-1/3 bg-blue-100/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50/20 rounded-full blur-[80px]" />
      
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-gradient">Events</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of elegant events and create invitations for any occasion
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
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
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
                  className={`aspect-[4/5] bg-gradient-to-br ${event.gradient} relative p-6 flex flex-col justify-between`}
                >
                  <div className="absolute inset-0 bg-blue-900/5 group-hover:bg-blue-900/0 transition-all duration-300"></div>
                  
                  {/* Event image placeholder */}
                  <div className="relative z-10 flex justify-center items-center mb-4">
                    <div className="w-full h-40 bg-white/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Image className="w-12 h-12 text-blue-100/70" />
                    </div>
                  </div>
                  
                  {/* Event content preview */}
                  <div className="relative z-10">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-white/80 text-blue-700 rounded-md backdrop-blur-sm">
                      {event.category}
                    </span>
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-white/70 rounded-md w-3/4"></div>
                      <div className="h-2 bg-white/60 rounded-full w-1/2"></div>
                      <div className="h-2 bg-white/60 rounded-full w-2/3"></div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 mt-auto">
                    <h3 className="text-lg font-medium text-white drop-shadow-sm mb-1">
                      {event.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white text-blue-600 text-xs backdrop-blur-sm">
                        Preview
                      </Button>
                      <Button size="sm" className="bg-blue-600/90 hover:bg-blue-600 text-white text-xs backdrop-blur-sm">
                        Create Invitation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50/50">
            View All Events
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default Events;
