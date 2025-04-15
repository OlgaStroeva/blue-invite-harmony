import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Table as TableIcon, Mail, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: number;
  name: string;
  email: string;
  company: string;
  dietaryRestrictions: string;
  invitationSent: boolean;
  attended: boolean;
  [key: string]: string | number | boolean;
}

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

interface ParticipantsTableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
}

const ParticipantsTable = ({ open, onOpenChange, event }: ParticipantsTableProps) => {
  const { toast } = useToast();

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      company: "Acme Inc",
      dietaryRestrictions: "Vegetarian",
      invitationSent: false,
      attended: false
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      company: "Globex Corp",
      dietaryRestrictions: "None",
      invitationSent: false,
      attended: false
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      company: "Wayne Enterprises",
      dietaryRestrictions: "Gluten-free",
      invitationSent: false,
      attended: false
    }
  ]);

  const handleSendInvite = (participantId: number) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === participantId 
          ? { ...p, invitationSent: true }
          : p
      )
    );
    toast({
      title: "Invitation Sent",
      description: "The participant has been notified via email",
    });
  };

  const handleToggleAttendance = (participantId: number) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === participantId 
          ? { ...p, attended: !p.attended }
          : p
      )
    );
  };

  const allKeys = Array.from(
    new Set(
      participants.flatMap(participant => 
        Object.keys(participant).filter(key => 
          !['id', 'invitationSent', 'attended'].includes(key)
        )
      )
    )
  );

  const isEventFinished = false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto bg-blue-50 border-blue-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <TableIcon className="h-5 w-5" /> 
            Participants for {event.title}
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            View and manage all participant registrations for this event
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {participants.length === 0 ? (
            <div className="text-center p-8 bg-blue-100/50 rounded-lg">
              <Mail className="h-10 w-10 mx-auto text-blue-400 mb-2" />
              <h3 className="text-lg font-medium text-blue-700">No participants yet</h3>
              <p className="text-blue-600 mt-1">
                Share your invitation form to collect participant information
              </p>
            </div>
          ) : (
            <div className="border border-blue-200 rounded-md bg-white overflow-hidden">
              <Table>
                <TableCaption>
                  Total participants: {participants.length}
                </TableCaption>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    {allKeys.map((key) => (
                      <TableHead key={key} className="capitalize text-blue-700">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </TableHead>
                    ))}
                    <TableHead className="text-blue-700">Invite</TableHead>
                    {isEventFinished && (
                      <TableHead className="text-blue-700">Attended</TableHead>
                    )}
                    <TableHead className="text-right text-blue-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant) => (
                    <TableRow key={participant.id} className="hover:bg-blue-50">
                      {allKeys.map((key) => (
                        <TableCell key={`${participant.id}-${key}`}>
                          {participant[key] !== undefined ? String(participant[key]) : '—'}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => !participant.invitationSent && handleSendInvite(participant.id)}
                          className={participant.invitationSent ? "text-red-600" : "text-blue-600"}
                        >
                          {participant.invitationSent ? (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4 mr-1" />
                              Invite
                            </>
                          )}
                        </Button>
                      </TableCell>
                      {isEventFinished && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleAttendance(participant.id)}
                            className={participant.attended ? "text-green-600" : "text-gray-400"}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0" 
                          aria-label="Edit participant"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantsTable;
