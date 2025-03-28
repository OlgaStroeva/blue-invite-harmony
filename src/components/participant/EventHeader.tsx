
import { Event } from "@/types/event";

interface EventHeaderProps {
  event: Event;
}

const EventHeader = ({ event }: EventHeaderProps) => {
  return (
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
  );
};

export default EventHeader;
