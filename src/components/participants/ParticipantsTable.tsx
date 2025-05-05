
import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Table as TableIcon, Mail, Check, X, Upload, Download, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import * as XLSX from 'xlsx';

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
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

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
          ? { ...p, invitationSent: !p.invitationSent }
          : p
      )
    );
    
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      if (!participant.invitationSent) {
        toast({
          title: t("invitationSent"),
          description: t("participantNotified"),
        });
      } else {
        toast({
          title: t("invitationCanceled"),
          description: t("participantRemovedNotification"),
        });
      }
    }
  };

  const handleToggleAttendance = (participantId: number) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === participantId 
          ? { ...p, attended: !p.attended }
          : p
      )
    );
    
    toast({
      title: t("attendanceUpdated"),
      description: t("participantStatusChanged"),
    });
  };

  const handleXlsxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<Participant>(ws);
      
      // Add generated IDs and set initial invitation/attendance status
      const newParticipants = data.map((item, index) => ({
        ...item,
        id: participants.length + index + 1,
        invitationSent: false,
        attended: false
      }));
      
      setParticipants([...participants, ...newParticipants]);
      
      toast({
        title: t("dataImported"),
        description: `${t("successfullyImported")} ${newParticipants.length} ${t("records")}`,
      });
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadXlsx = () => {
    // Create worksheet from participants data
    const worksheet = XLSX.utils.json_to_sheet(participants.map(p => {
      const { id, invitationSent, attended, ...rest } = p;
      return rest;
    }));
    
    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
    
    // Write and download file
    XLSX.writeFile(workbook, `${event.title}-participants.xlsx`);
    
    toast({
      title: t("dataExported"),
      description: t("fileDownloaded"),
    });
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

  const isEventFinished = event.status === 'finished';
  
  // Only show employer-specific features if authenticated
  const showEmployerFeatures = isAuthenticated;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto bg-blue-50 border-blue-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <TableIcon className="h-5 w-5" /> 
            {t("participantsFor")} {event.title}
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            {t("viewAndManageParticipants")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {participants.length === 0 ? (
            <div className="text-center p-8 bg-blue-100/50 rounded-lg">
              {showEmployerFeatures && (
                <div className="mb-4">
                  <input
                    id="xlsx"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleXlsxUpload}
                    className="hidden"
                  />
                  <label 
                    htmlFor="xlsx" 
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    {t("importXLSX")}
                  </label>
                </div>
              )}
              <Mail className="h-10 w-10 mx-auto text-blue-400 mb-2" />
              <h3 className="text-lg font-medium text-blue-700">{t("noParticipantsYet")}</h3>
              <p className="text-blue-600 mt-1">
                {t("shareInvitationFormOrImport")}
              </p>
            </div>
          ) : (
            <div>
              {showEmployerFeatures && (
                <div className="mb-4 flex justify-between">
                  <input
                    id="xlsx"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleXlsxUpload}
                    className="hidden"
                  />
                  <label 
                    htmlFor="xlsx" 
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    {t("importXLSX")}
                  </label>
                  
                  <Button 
                    onClick={handleDownloadXlsx}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    {t("exportToExcel")}
                  </Button>
                </div>
              )}
              
              <div className="border border-blue-200 rounded-md bg-white overflow-hidden">
                <Table>
                  <TableCaption>
                    {t("totalParticipants")}: {participants.length}
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      {allKeys.map((key) => (
                        <TableHead key={key} className="capitalize text-blue-700">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </TableHead>
                      ))}
                      {showEmployerFeatures && (
                        <>
                          <TableHead className="text-blue-700">{t("invite")}</TableHead>
                          {isEventFinished && (
                            <TableHead className="text-blue-700">{t("attended")}</TableHead>
                          )}
                          <TableHead className="text-right text-blue-700">{t("actions")}</TableHead>
                        </>
                      )}
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
                        
                        {showEmployerFeatures && (
                          <>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendInvite(participant.id)}
                                className={participant.invitationSent ? "text-red-600" : "text-blue-600"}
                              >
                                {participant.invitationSent ? (
                                  <>
                                    <X className="h-4 w-4 mr-1" />
                                    {t("cancel")}
                                  </>
                                ) : (
                                  <>
                                    <Mail className="h-4 w-4 mr-1" />
                                    {t("invite")}
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
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantsTable;
