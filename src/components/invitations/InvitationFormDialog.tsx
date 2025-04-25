
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Save, FileDown, UserPlus, Edit } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Event } from "@/types/event";
import { FormField } from "@/types/form";
import { Template } from "@/types/template";
import FormFieldList from "./FormFieldList";
import AddFieldForm from "./AddFieldForm";
import TemplateSelector from "./TemplateSelector";
import * as XLSX from 'xlsx';

interface InvitationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  onClose?: () => void;
}

const InvitationFormDialog = ({ open, onOpenChange, event, onClose }: InvitationFormDialogProps) => {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: "email", name: "Email", type: "email", required: true }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isEditMode, setIsEditMode] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSaveTemplate = () => {
    if (formFields.length <= 1) {
      toast({
        title: t("moreFieldsNeeded"),
        description: t("addMoreFieldsTemplate"),
        variant: "destructive",
      });
      return;
    }

    const newTemplate: Template = {
      id: Date.now(),
      name: `${t("templateFor")} ${event.title}`,
      eventId: event.id,
      fields: [...formFields]
    };

    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setIsEditMode(false);
    
    toast({
      title: t("templateSaved"),
      description: t("templateSavedSuccess"),
    });
  };

  const handleAddField = (field: FormField) => {
    setFormFields([...formFields, field]);
  };

  const handleApplyTemplate = (template: Template) => {
    setFormFields([...template.fields]);
    setSelectedTemplate(template);
  };

  const handleExportToXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet([]);
    const headers = selectedTemplate?.fields.map(field => field.name) || [];
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
    
    XLSX.writeFile(workbook, `${event.title}-participants.xlsx`);
  };

  if (!isEditMode && selectedTemplate) {
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
            <FormFieldList formFields={selectedTemplate.fields} readOnly />
            
            <div className="flex justify-end gap-3 pt-4 border-t border-blue-200">
              <Button
                onClick={() => setIsEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                {t("editForm")}
              </Button>
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
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto bg-blue-50 border-blue-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Mail className="h-5 w-5" /> 
            {t("invitationFormFor")} {event.title}
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            {t("createCustomForm")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <FormFieldList formFields={formFields} setFormFields={setFormFields} />
          <AddFieldForm onAddField={handleAddField} />
        </div>

        <DialogFooter className="pt-4 border-t border-blue-200">
          <Button 
            onClick={handleSaveTemplate}
            className="bg-blue-600 hover:bg-blue-700 ml-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationFormDialog;
