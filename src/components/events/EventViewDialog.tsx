
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Edit, Users, Table, CalendarIcon, MapPin } from "lucide-react";
import { Event } from "@/types/event";
import InvitationFormDialog from "@/components/invitations/InvitationFormDialog";
import ParticipantsTable from "@/components/participants/ParticipantsTable";
import EmployeeManagementDialog from "@/components/employees/EmployeeManagementDialog";
import EventEditDialog from "./EventEditDialog";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface EventViewDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventUpdated: (event: Event) => void;
  onEventDeleted?: (event: Event) => void;
}

const EventViewDialog = ({ 
  event, 
  open, 
  onOpenChange, 
  onEventUpdated,
  onEventDeleted 
}: EventViewDialogProps) => {
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [showParticipantsTable, setShowParticipantsTable] = useState(false);
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event>(event);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  // Update the local event state whenever the prop changes
  useEffect(() => {
    setCurrentEvent(event);
  }, [event]);

  const handleEventUpdated = (updatedEvent: Event) => {
    setCurrentEvent(updatedEvent);
    onEventUpdated(updatedEvent);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-700">{currentEvent.title}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 pr-4">
              {currentEvent.image && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={currentEvent.image} 
                    alt={currentEvent.title} 
                    className="w-full object-cover"
                  />
                </div>
              )}

              <div className="grid gap-6">
                <div>
                  <h3 className="font-medium text-blue-700">{t("category")}</h3>
                  <p className="mt-1">{currentEvent.category}</p>
                </div>

                {currentEvent.description && (
                  <article className="prose prose-blue max-w-none">
                    <h3 className="font-medium text-blue-700 mb-3">{t("eventDescription")}</h3>
                    <div className="rounded-md border p-4">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {currentEvent.description}
                      </div>
                    </div>
                  </article>
                )}

                <div className="flex flex-col gap-2">
                  {currentEvent.date && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-600" />
                      <span>{new Date(currentEvent.date).toLocaleString()}</span>
                    </div>
                  )}

                  {currentEvent.place && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>{currentEvent.place}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t mt-4">
            {isAuthenticated && (
              <Button
                onClick={() => setShowEditDialog(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                {t("editEvent")}
              </Button>
            )}
            
            {isAuthenticated && (
              <Button
                onClick={() => setShowInvitationForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="mr-2 h-4 w-4" />
                {t("invitations")}
              </Button>
            )}
            
            <Button
              onClick={() => setShowParticipantsTable(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Table className="mr-2 h-4 w-4" />
              {t("participants")}
            </Button>
            
            {isAuthenticated && (
              <Button
                onClick={() => setShowEmployeeManagement(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Users className="mr-2 h-4 w-4" />
                {t("employees")}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <EventEditDialog
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) onOpenChange(true);
          }}
          event={currentEvent}
          onEventUpdated={handleEventUpdated}
          onEventDeleted={onEventDeleted}
        />
      )}

      {showInvitationForm && (
        <InvitationFormDialog
          open={showInvitationForm}
          onOpenChange={(open) => {
            setShowInvitationForm(open);
            if (!open) onOpenChange(true);
          }}
          event={currentEvent}
        />
      )}

      {showParticipantsTable && (
        <ParticipantsTable
          open={showParticipantsTable}
          onOpenChange={(open) => {
            setShowParticipantsTable(open);
            if (!open) onOpenChange(true);
          }}
          event={currentEvent}
        />
      )}

      {showEmployeeManagement && (
        <EmployeeManagementDialog
          open={showEmployeeManagement}
          onOpenChange={(open) => {
            setShowEmployeeManagement(open);
            if (!open) onOpenChange(true);
          }}
          event={currentEvent}
        />
      )}
    </>
  );
};

export default EventViewDialog;
