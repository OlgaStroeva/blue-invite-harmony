import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, FileDown, UserPlus, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Event } from "@/types/event";
import { Template } from "@/types/template";
import FormFieldList from "./FormFieldList";
import * as XLSX from 'xlsx';

interface InvitationFormPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  selectedTemplate: Template | null;
  onEditMode: () => void;
  onClose?: () => void;
  user: number | undefined;
  canEdit: boolean;
}

const InvitationFormPreview = ({ 
  open, 
  onOpenChange, 
  event, 
  selectedTemplate,
  onEditMode, 
  user,
  canEdit
}: InvitationFormPreviewProps) => {
  const navigate = useNavigate();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [isAuthenticated] = useState(false);

  const handleExportToXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet([]);
    const headers = selectedTemplate?.fields.map(field => field.name) || [];
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
    
    XLSX.writeFile(workbook, `${event.title}-participants.xlsx`);
    
    toast({
      title: t("fileExported"),
      description: t("downloadStarted"),
    });
  };

  const handleDeleteForm = async () => {
    const token = localStorage.getItem("token");
    let formId;

    try {
      // Пытаемся получить существующий шаблон
      const formRes = await fetch(`http://158.160.171.159:7291/api/forms/get-by-event/${event.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (formRes.ok) {
        const form = await formRes.json();
        formId = form.id;
      }
      const res = await fetch(`http://158.160.171.159:7291/api/forms/delete/${formId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          title: t("error"),
          description: result.message || t("deleteFailed"),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: t("formDeleted"),
        description: t("formDeletedSuccessfully")
      });

      // Закрываем предпросмотр и сбрасываем шаблон
      onOpenChange(false);
      // 👇 Предположим, что setTemplate передан, как reset
      // setTemplate(null); // ← раскомментируйте, если нужно
    } catch (err) {
      toast({
        title: t("error"),
        description: t("networkError"),
        variant: "destructive"
      });
      console.error("Ошибка при удалении шаблона:", err);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("https://158.160.171.159:7291/api/forms/my-templates", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            console.error("Ошибка сервера:", text);
            return;
          }

          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("Не JSON:", text);
            return;
          }

          const data = await res.json();

          // обработка и нормализация
          const normalized = data.map(template => ({
            ...template,
            fields: Array.isArray(template.fields)
                ? template.fields.map(f =>
                    typeof f === "string"
                        ? { name: f, type: "text"}
                        : { name: f.name || "", type: f.type || "text" }
                )
                : []
          }));

          //setTemplate(normalized);
        })
        .catch(err => {
          console.error("Ошибка загрузки шаблонов:", err);
        });
  }, []);
  
  // Only show employer-specific features if authenticated
  const showEmployerFeatures = isAuthenticated;

  // If no template exists, show a message
  if (!selectedTemplate) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl bg-blue-50 border-blue-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <Mail className="h-5 w-5" />
              {t("invitationPreview")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center p-8">
              <p className="text-blue-600">{t("noFormAvailable")}</p>
              {canEdit && (
                <Button
                  onClick={onEditMode}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  {t("createForm")}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteForm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteFormConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction 
                onClick={async () => {
                  setShowDeleteAlert(false);
                  await handleDeleteForm();
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl bg-blue-50 border-blue-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <Mail className="h-5 w-5" />
              {t("invitationPreview")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <FormFieldList formFields={selectedTemplate.fields} currentEvent={event} readOnly />
            
            <div className="flex justify-between gap-3 pt-4 border-t border-blue-200">
              {event.createdBy === user && (
                <Button
                  onClick={() => setShowDeleteAlert(true)}
                  variant="destructive"
                  className="bg-[#ea384c] hover:bg-[#ea384c]/90"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                  <span className="ml-2">{t("deleteForm")}</span>
                </Button>
              )}
              
              <div className="flex gap-3 ml-auto">
                {event.createdBy === user && canEdit && (
                    <Button
                        onClick={() => onEditMode()}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {t("editForm")}
                  </Button>
                )}
                
                <Button
                  onClick={() => navigate(`/participant-form/${event.id}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("addParticipant")}
                </Button>
                
                  <Button
                    onClick={handleExportToXLSX}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    {t("exportToExcel")}
                  </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvitationFormPreview;
