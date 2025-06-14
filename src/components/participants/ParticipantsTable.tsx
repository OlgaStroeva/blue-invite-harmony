
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Table as TableIcon, Mail, Check, X, Upload, Download, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import * as XLSX from 'xlsx';
import { Event } from "@/types/event";
import {useEffect, useState} from "react";
import { Loader2 } from "lucide-react";

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

interface ParticipantsTableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
}

const ParticipantsTable = ({ open, onOpenChange, event }: ParticipantsTableProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sendingInvites, setSendingInvites] = useState<Record<number, boolean>>({});

  const handleSendInvite = async (participantId: number) => {
    const token = localStorage.getItem("token");
    if (!token || !event?.id) return;

    try {
      setSendingInvites(prev => ({ ...prev, [participantId]: true }));

      const formRes = await fetch(`https://0.0.0.0:7291/api/forms/get-by-event/${event.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!formRes.ok) throw new Error("Failed to get form data");
      const { id: formId } = await formRes.json();

      const inviteRes = await fetch(`https://0.0.0.0:7291/api/invitations/send/${formId}/${participantId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!inviteRes.ok) {
        const errorData = await inviteRes.json();
        throw new Error(errorData.message || "Failed to send invitation");
      }

      setParticipants(prev =>
          prev.map(p =>
              p.id === participantId
                  ? { ...p, invitationSent: true }
                  : p
          )
      );

      toast({
        title: t("invitationSent"),
        description: t("invitationSentSuccessfully"),
      });

    } catch (err: any) {
      console.error("Error sending invitation:", err);
      toast({
        title: t("error"),
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSendingInvites(prev => ({ ...prev, [participantId]: false }));
    }
  };

  const handleCancelInvite = async (participantId: number) => {
    const token = localStorage.getItem("token");
    if (!token || !event?.id) return;

    try {
      setSendingInvites(prev => ({ ...prev, [participantId]: true }));

      const formRes = await fetch(`https://0.0.0.0:7291/api/forms/get-by-event/${event.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!formRes.ok) throw new Error("Failed to get form data");
      const { id: formId } = await formRes.json();

      const cancelRes = await fetch(`https://0.0.0.0:7291/api/invitations/cancel/${formId}/${participantId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!cancelRes.ok) {
        const errorData = await cancelRes.json();
        throw new Error(errorData.message || "Failed to cancel invitation");
      }

      setParticipants(prev =>
          prev.map(p =>
              p.id === participantId
                  ? { ...p, invitationSent: false }
                  : p
          )
      );

      toast({
        title: t("invitationCancelled"),
        description: t("invitationCancelledSuccessfully"),
      });

    } catch (err: any) {
      console.error("Error cancelling invitation:", err);
      toast({
        title: t("error"),
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSendingInvites(prev => ({ ...prev, [participantId]: false }));
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !event?.id) return;

    fetch(`https://0.0.0.0:7291/api/forms/participants/${event.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then(async res => {
          if (!res.ok) throw new Error("Ошибка при получении участников");
          return res.json();
        })
        .then(data => {
          const mapped = data.map((p: any) => ({
            id: p.id,
            ...p.data,
            invitationSent: p.attended ?? false,
            haveQr: p.qrCode
          }));
          console.error(data);
          setParticipants(mapped);
        })
        .catch(err => {
          console.error("Ошибка загрузки участников:", err);
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить участников",
            variant: "destructive"
          });
        });
  }, [event]);

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

  const handleXlsxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !event?.id) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`https://0.0.0.0:7291/api/forms/upload-participants/${event.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Ошибка при загрузке:", result.errors || result.message);
        toast({
          title: t("uploadError"),
          description: result.errors?.join(", ") || result.message || t("tryAgain"),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: t("dataImported"),
        description: result.message || `${t("successfullyImported")} ${result.count} ${t("records")}`,
      });

    } catch (err) {
      console.error("Ошибка отправки файла:", err);
      toast({
        title: t("error"),
        description: t("fileUploadFailed"),
        variant: "destructive"
      });
    }
  };

  const handleDownloadXlsx = () => {
    const worksheet = XLSX.utils.json_to_sheet(participants.map(p => {
      const { id, invitationSent, attended, ...rest } = p;
      return rest;
    }));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
    
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

  const updateParticipantOnServer = async (participantId: number, updatedData: Record<string, string>) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://0.0.0.0:7291/api/forms/update/${participantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("Ошибка при обновлении:", result.message);
      } else {
        console.log("Участник обновлён:", result);
      }
    } catch (error) {
      console.error("Сетевая ошибка при обновлении участника:", error);
    }
  };

  const handleFieldChange = (id: number, key: string, value: string) => {
    setParticipants(prev =>
        prev.map(participant => {
          if (participant.id === id) {
            const updated = { ...participant, [key]: value };
            
            updateParticipantOnServer(id, {
              [key]: value
            });

            return updated;
          }
          return participant;
        })
    );
  };

  const isEventFinished = event.status === 'finished';

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
              <Mail className="h-10 w-10 mx-auto text-blue-400 mb-2" />
              <h3 className="text-lg font-medium text-blue-700">{t("noParticipantsYet")}</h3>
              <p className="text-blue-600 mt-1">
                {t("shareInvitationFormOrImport")}
              </p>
            </div>
          ) : (
            <div>
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
              
              <div className="border border-blue-200 rounded-md bg-white overflow-hidden">
                <Table>
                  <TableCaption>
                    {t("totalParticipants")}: {participants.length}
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      {allKeys
                          .filter(key => key !== 'haveQr')
                          .map((key) => (
                        <TableHead key={key} className="capitalize text-blue-700">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </TableHead>
                      ))}

                        <>
                          <TableHead className="text-blue-700">{t("invite")}</TableHead>
                          {isEventFinished && (
                            <TableHead className="text-blue-700">{t("attended")}</TableHead>
                          )}
                          <TableHead className="text-right text-blue-700">{t("actions")}</TableHead>
                        </>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id} className="hover:bg-blue-50">
                        {allKeys
                            .filter(key => key !== 'haveQr')
                            .map((key) => (
                          <TableCell key={`${participant.id}-${key}`}>
                            {participant[key] !== undefined ? String(participant[key]) : '—'}
                          </TableCell>
                        ))}
                        
                          <>
                            <TableCell>
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => participant.invitationSent ? handleCancelInvite(participant.id) : handleSendInvite(participant.id)}
                                  disabled={sendingInvites[participant.id] || !participant.haveQr}
                                  className={
                                    participant.invitationSent
                                        ? "text-red-600"
                                        : sendingInvites[participant.id] && !participant.haveQr && !participant.invitationSent
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-blue-600 hover:text-blue-700"
                                  }
                                  title={
                                    !participant.haveQr
                                        ? t("qrCodeRequired")
                                        : sendingInvites[participant.id]
                                            ? t("sending")
                                            : ""
                                  }
                              >
                                {sendingInvites[participant.id] ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : participant.invitationSent ? (
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
