
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Event } from "@/types/event";
import { Play, Square } from "lucide-react";

interface EventStatusButtonProps {
  event: Event;
  onStatusChange: (event: Event, newStatus: 'upcoming' | 'in_progress' | 'finished') => void;
}

const EventStatusButton = ({ event, onStatusChange }: EventStatusButtonProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const handleStatusChange = () => {
    if (event.status === 'upcoming') {
      onStatusChange(event, 'in_progress');
    } else if (event.status === 'in_progress') {
      onStatusChange(event, 'finished');
    }
    setShowConfirmDialog(false);
  };

  const getButtonText = () => {
    if (event.status === 'upcoming') return 'Begin';
    if (event.status === 'in_progress') return 'Finish';
    return 'Finished';
  };

  const getIcon = () => {
    if (event.status === 'upcoming' || event.status === 'in_progress') {
      return event.status === 'upcoming' ? <Play className="h-3 w-3" /> : <Square className="h-3 w-3" />;
    }
    return null;
  };

  // Don't render the button if the event is finished
  if (event.status === 'finished') return null;

  return (
    <>
      <Button
        size="sm"
        onClick={() => setShowConfirmDialog(true)}
        className="bg-blue-600/90 hover:bg-blue-600 text-white text-xs"
      >
        {getIcon()}
        {getButtonText()}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Event Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {event.status === 'upcoming' ? 'begin' : 'finish'} this event?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventStatusButton;
