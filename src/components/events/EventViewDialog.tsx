import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Edit, Users, Table, CalendarIcon, MapPin } from "lucide-react";
import { Event } from "@/types/event";
import InvitationFormDialog from "@/components/invitations/InvitationFormDialog";
import ParticipantsTable from "@/components/participants/ParticipantsTable";
import EmployeeManagementDialog from "@/components/employees/EmployeeManagementDialog";
import EventEditDialog from "./EventEditDialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EventViewDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventUpdated: (event: Event) => void;
}

const EventViewDialog = ({ event, open, onOpenChange, onEventUpdated }: EventViewDialogProps) => {
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [showParticipantsTable, setShowParticipantsTable] = useState(false);
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-700">{event.title}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="pr-4">
            <div className="space-y-6">
              {event.image && (
                <div className="max-h-[40vh] overflow-hidden rounded-lg">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full object-cover"
                  />
                </div>
              )}

              <div className="grid gap-6">
                <div>
                  <h3 className="font-medium text-blue-700">Category</h3>
                  <p className="mt-1">{event.category}</p>
                </div>

                {event.description && (
                  <article className="prose prose-blue max-w-none">
                    <h3 className="font-medium text-blue-700 mb-3">Description</h3>
                    <div className="rounded-md border p-4">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {event.description}
                      </div>
                    </div>
                  </article>
                )}

                <div className="flex flex-col gap-2">
                  {event.date && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-600" />
                      <span>{new Date(event.date).toLocaleString()}</span>
                    </div>
                  )}

                  {event.place && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>{event.place}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sticky bottom-0 bg-background py-4">
                <Button
                  onClick={() => setShowEditDialog(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                
                <Button
                  onClick={() => setShowInvitationForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Invitations
                </Button>
                
                <Button
                  onClick={() => setShowParticipantsTable(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Table className="mr-2 h-4 w-4" />
                  Data
                </Button>
                
                <Button
                  onClick={() => setShowEmployeeManagement(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Staff
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <EventEditDialog
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) onOpenChange(true);
          }}
          event={event}
          onEventUpdated={(updatedEvent) => {
            onEventUpdated(updatedEvent);
            setShowEditDialog(false);
            onOpenChange(true);
          }}
        />
      )}

      {showInvitationForm && (
        <InvitationFormDialog
          open={showInvitationForm}
          onOpenChange={(open) => {
            setShowInvitationForm(open);
            if (!open) onOpenChange(true);
          }}
          event={event}
        />
      )}

      {showParticipantsTable && (
        <ParticipantsTable
          open={showParticipantsTable}
          onOpenChange={(open) => {
            setShowParticipantsTable(open);
            if (!open) onOpenChange(true);
          }}
          event={event}
        />
      )}

      {showEmployeeManagement && (
        <EmployeeManagementDialog
          open={showEmployeeManagement}
          onOpenChange={(open) => {
            setShowEmployeeManagement(open);
            if (!open) onOpenChange(true);
          }}
          event={event}
        />
      )}
    </>
  );
};

export default EventViewDialog;
