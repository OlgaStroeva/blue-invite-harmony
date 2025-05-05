
import { useState } from "react";
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
  selectedTemplate: Template;
  onEditMode: () => void;
  onClose?: () => void;
}

const InvitationFormPreview = ({ 
  open, 
  onOpenChange, 
  event, 
  selectedTemplate,
  onEditMode
}: InvitationFormPreviewProps) => {
  const navigate = useNavigate();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

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

  // Only show employer-specific features if authenticated
  const showEmployerFeatures = isAuthenticated;

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
              onClick={() => {
                setShowDeleteAlert(false);
                onEditMode();
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
            <FormFieldList formFields={selectedTemplate.fields} readOnly />
            
            <div className="flex justify-between gap-3 pt-4 border-t border-blue-200">
              {showEmployerFeatures && (
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
                {showEmployerFeatures && (
                  <Button
                    onClick={onEditMode}
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
                
                {showEmployerFeatures && (
                  <Button
                    onClick={handleExportToXLSX}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    {t("exportToExcel")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvitationFormPreview;
