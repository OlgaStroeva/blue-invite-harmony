import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Table as TableIcon, Mail, Check, X, Upload, Download, FileDown, Send, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import * as XLSX from 'xlsx';
import { Event } from "@/types/event";
import {useEffect, useState} from "react";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface Participant {
  id: number;
  name: string;
  email: string;
  company: string;
  dietaryRestrictions: string;
  invitationSent: boolean;
  attended: boolean;
  haveQr: boolean;
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
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [sendingInvites, setSendingInvites] = useState<Record<number, boolean>>({});
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [sendingBulkInvites, setSendingBulkInvites] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [formId, setFormId] = useState<number | null>(null);

  // Load form fields to get proper column order and form ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !event?.id) return;

    fetch(`http://158.160.171.159:7291/api/forms/get-by-event/${event.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then(async res => {
          if (!res.ok) throw new Error("Failed to get form data");
          return res.json();
        })
        .then(data => {
          setFormFields(data.fields || []);
          setFormId(data.id); // Store form ID for upload
        })
        .catch(err => {
          console.error("Error loading form fields:", err);
        });
  }, [event.id]);

  const handleSelectParticipant = (participantId: number, checked: boolean) => {
    if (checked) {
      setSelectedParticipants(prev => [...prev, participantId]);
    } else {
      setSelectedParticipants(prev => prev.filter(id => id !== participantId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const availableParticipants = participants
          .filter(p => p.haveQr && !p.invitationSent)
          .map(p => p.id);
      setSelectedParticipants(availableParticipants);
    } else {
      setSelectedParticipants([]);
    }
  };

  const handleInviteAll = async () => {
    const availableParticipants = participants
        .filter(p => p.haveQr && !p.invitationSent)
        .map(p => p.id);

    if (availableParticipants.length === 0) {
      toast({
        title: t("noParticipantsSelected"),
        description: t("pleaseSelectParticipants"),
        variant: "destructive"
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || !formId) return;

    try {
      setSendingBulkInvites(true);

      // Send invitations to all available participants
      const promises = availableParticipants.map(async (participantId) => {
        const inviteRes = await fetch(`http://158.160.171.159:7291/api/invitations/send/${formId}/${participantId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!inviteRes.ok) {
          const errorData = await inviteRes.json();
          throw new Error(`Failed to send invitation to participant ${participantId}: ${errorData.message}`);
        }

        return participantId;
      });

      await Promise.all(promises);

      // Update participants state
      setParticipants(prev =>
          prev.map(p =>
              availableParticipants.includes(p.id)
                  ? { ...p, invitationSent: true }
                  : p
          )
      );

      toast({
        title: t("allInvitationsSent"),
        description: `${t("sentInvitationsTo")} ${availableParticipants.length} ${t("participants")}`,
      });

    } catch (err: any) {
      console.error("Error sending bulk invitations:", err);
      toast({
        title: t("error"),
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSendingBulkInvites(false);
    }
  };

  const handleSendBulkInvites = async () => {
    if (selectedParticipants.length === 0) return;

    const token = localStorage.getItem("token");
    if (!token || !formId) return;

    try {
      setSendingBulkInvites(true);

      // Send invitations to all selected participants
      const promises = selectedParticipants.map(async (participantId) => {
        const inviteRes = await fetch(`http://158.160.171.159:7291/api/invitations/send/${formId}/${participantId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!inviteRes.ok) {
          const errorData = await inviteRes.json();
          throw new Error(`Failed to send invitation to participant ${participantId}: ${errorData.message}`);
        }

        return participantId;
      });

      await Promise.all(promises);

      // Update participants state
      setParticipants(prev =>
          prev.map(p =>
              selectedParticipants.includes(p.id)
                  ? { ...p, invitationSent: true }
                  : p
          )
      );

      setSelectedParticipants([]);

      toast({
        title: t("invitationsSent"),
        description: `${t("sentInvitationsTo")} ${selectedParticipants.length} ${t("participants")}`,
      });

    } catch (err: any) {
      console.error("Error sending bulk invitations:", err);
      toast({
        title: t("error"),
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSendingBulkInvites(false);
    }
  };

  const handleSendInvite = async (participantId: number) => {
    const token = localStorage.getItem("token");
    if (!token || !formId) return;

    try {
      setSendingInvites(prev => ({ ...prev, [participantId]: true }));

      const inviteRes = await fetch(`http://158.160.171.159:7291/api/invitations/send/${formId}/${participantId}`, {
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
    if (!token || !formId) return;

    try {
      setSendingInvites(prev => ({ ...prev, [participantId]: true }));

      const cancelRes = await fetch(`http://158.160.171.159:7291/api/invitations/delete/${formId}/${participantId}`, {
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

  const handleDeleteParticipant = async (participantId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://158.160.171.159:7291/api/forms/delete-participant/${participantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete participant");
      }

      setParticipants(prev => prev.filter(p => p.id !== participantId));

      toast({
        title: t("success"),
        description: t("participantDeleted"),
      });

    } catch (error: any) {
      console.error("Error deleting participant:", error);
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !event?.id) return;

    fetch(`http://158.160.171.159:7291/api/forms/participants/${event.id}`, {
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
          console.error(mapped);
          console.log("Participants data:", data);
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

  const handleEditParticipant = (participantId: number) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      setEditingParticipant(participantId);
      setEditValues({ ...participant });
    }
  };

  const handleSaveEdit = async (participantId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Создаем новый объект с правильным порядком полей
      const orderedValues: Record<string, any> = {};

      // Проходим по всем полям шаблона
      formFields.forEach(field => {
        const fieldName = field.name; // предполагая, что field.name содержит имя поля
        // Если поле есть в editValues и не в списке исключений - добавляем его
        if (editValues.hasOwnProperty(fieldName) &&
            !['id', 'invitationSent', 'haveQr'].includes(fieldName)) {
          orderedValues[fieldName] = editValues[fieldName];
        }
      });

      const response = await fetch(`http://158.160.171.159:7291/api/forms/update/${participantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderedValues)
      });

      // Остальной код остается без изменений
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update participant");
      }

      setParticipants(prev =>
          prev.map(p =>
              p.id === participantId ? { ...p, ...editValues } : p
          )
      );

      setEditingParticipant(null);
      setEditValues({});

      toast({
        title: t("success"),
        description: "Participant updated successfully",
      });

    } catch (error: any) {
      console.error("Error updating participant:", error);
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleCancelEdit = () => {
    setEditingParticipant(null);
    setEditValues({});
  };

  const handleXlsxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formId) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`http://158.160.171.159:7291/api/forms/upload/${formId}`, {
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

      // Reload participants
      window.location.reload();

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
      const { id, invitationSent, attended, haveQr, ...rest } = p;
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

  // Get ordered columns based on form fields, fallback to participant keys
  const getOrderedColumns = () => {
    if (formFields.length > 0) {
      return formFields.map(field => field.name);
    }

    // Fallback to all keys except system fields
    return Array.from(
        new Set(
            participants.flatMap(participant =>
                Object.keys(participant).filter(key =>
                    !['id', 'invitationSent', 'attended', 'haveQr'].includes(key)
                )
            )
        )
    );
  };

  const orderedColumns = getOrderedColumns();
  const isEventFinished = event.status === 'finished';
  const canEdit = event.status === 'upcoming';
  const availableForInvite = participants.filter(p => p.haveQr && !p.invitationSent);
  const allAvailableSelected = availableForInvite.length > 0 &&
      availableForInvite.every(p => selectedParticipants.includes(p.id));

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
                  {canEdit && (
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
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      {canEdit && (
                          <>
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

                            {availableForInvite.length > 0 && (
                                <Button
                                    onClick={handleInviteAll}
                                    disabled={sendingBulkInvites}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                  {sendingBulkInvites ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                      <Send className="mr-2 h-4 w-4" />
                                  )}
                                  {t("inviteAll")} ({availableForInvite.length})
                                </Button>
                            )}

                            {selectedParticipants.length > 0 && (
                                <Button
                                    onClick={handleSendBulkInvites}
                                    disabled={sendingBulkInvites}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                  {sendingBulkInvites ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                      <Send className="mr-2 h-4 w-4" />
                                  )}
                                  {t("sendInvites")} ({selectedParticipants.length})
                                </Button>
                            )}
                          </>
                      )}
                    </div>

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
                          {canEdit && availableForInvite.length > 0 && (
                              <TableHead className="w-12">
                                <Checkbox
                                    checked={allAvailableSelected}
                                    onCheckedChange={handleSelectAll}
                                />
                              </TableHead>
                          )}
                          {orderedColumns.map((columnName) => (
                              <TableHead key={columnName} className="capitalize text-blue-700">
                                {columnName.replace(/([A-Z])/g, ' $1').trim()}
                              </TableHead>
                          ))}

                          {canEdit && (
                              <TableHead className="text-blue-700">{t("invite")}</TableHead>
                          )}
                          {isEventFinished && (
                              <TableHead className="text-blue-700">{t("attended")}</TableHead>
                          )}
                          <TableHead className="text-right text-blue-700">{t("actions")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map((participant) => (
                            <TableRow key={participant.id} className="hover:bg-blue-50">
                              {canEdit && availableForInvite.some(p => p.id === participant.id) && (
                                  <TableCell>
                                    <Checkbox
                                        checked={selectedParticipants.includes(participant.id)}
                                        onCheckedChange={(checked) => handleSelectParticipant(participant.id, checked as boolean)}
                                        disabled={!participant.haveQr || participant.invitationSent}
                                    />
                                  </TableCell>
                              )}
                              {orderedColumns.map((columnName) => (
                                  <TableCell key={`${participant.id}-${columnName}`}>
                                    {editingParticipant === participant.id ? (
                                        <Input
                                            value={editValues[columnName] || ''}
                                            onChange={(e) => setEditValues(prev => ({ ...prev, [columnName]: e.target.value }))}
                                            className="w-full"
                                        />
                                    ) : (
                                        participant[columnName] !== undefined ? String(participant[columnName]) : '—'
                                    )}
                                  </TableCell>
                              ))}

                              {canEdit && (
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
                              )}

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
                                {editingParticipant === participant.id ? (
                                    <div className="flex gap-1">
                                      <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleSaveEdit(participant.id)}
                                          className="text-green-600"
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={handleCancelEdit}
                                          className="text-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-1">
                                      <Button
                                          variant="ghost"
                                          className="h-8 w-8 p-0"
                                          onClick={() => handleEditParticipant(participant.id)}
                                          disabled={!canEdit}
                                          aria-label="Edit participant"
                                      >
                                        <Edit className="h-4 w-4 text-blue-600" />
                                      </Button>
                                      {canEdit && !participant.invitationSent && (
                                          <Button
                                              variant="ghost"
                                              className="h-8 w-8 p-0"
                                              onClick={() => handleDeleteParticipant(participant.id)}
                                              aria-label="Delete participant"
                                          >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                          </Button>
                                      )}
                                    </div>
                                )}
                              </TableCell>
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
