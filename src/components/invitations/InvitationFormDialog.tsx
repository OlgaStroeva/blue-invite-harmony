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
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSaveAsFile = () => {
    if (!selectedTemplate) return;
    
    const templateData = JSON.stringify(selectedTemplate, null, 2);
    const blob = new Blob([templateData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: t("templateSaved"),
      description: t("templateSavedToFile"),
    });
  };

  const handleAddParticipant = () => {
    if (!selectedTemplate) return;
    navigate(`/participant-form/${event.id}`);
    onOpenChange(false);
    if (onClose) onClose();
  };

  const handleAddField = (field: FormField) => {
    setFormFields([...formFields, field]);
  };

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
    
    toast({
      title: t("templateSaved"),
      description: t("templateSavedSuccess"),
    });
  };

  const handleApplyTemplate = (template: Template) => {
    setFormFields([...template.fields]);
    setSelectedTemplate(template);
  };

  const handleCreateForm = () => {
    if (!selectedTemplate) {
      const newTemplate: Template = {
        id: Date.now(),
        name: `${t("templateFor")} ${event.title}`,
        eventId: event.id,
        fields: [...formFields]
      };
      setTemplates([...templates, newTemplate]);
      setSelectedTemplate(newTemplate);
    }
    
    onOpenChange(false);
    if (onClose) onClose();
    
    navigate(`/participant-form/${event.id}`);
  };

  if (selectedTemplate && !isEditing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto bg-blue-50 border-blue-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <Mail className="h-5 w-5" />
              {t("templatePreview")} - {selectedTemplate.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <FormFieldList formFields={selectedTemplate.fields} readOnly />
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-blue-200">
            <div className="flex items-center gap-2 w-full justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-blue-200 bg-blue-50 hover:bg-blue-100"
              >
                {t("close")}
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("edit")}
                </Button>
                <Button
                  type="button"
                  onClick={handleAddParticipant}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("addParticipant")}
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveAsFile}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  {t("saveAsFile")}
                </Button>
              </div>
            </div>
          </DialogFooter>
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-blue-800">{t("formFields")}</h3>
            <div className="flex items-center gap-2">
              <TemplateSelector 
                templates={templates}
                onApplyTemplate={handleApplyTemplate}
              />
              <Button 
                type="button"
                onClick={handleSaveTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {t("saveAsTemplate")}
              </Button>
            </div>
          </div>

          <FormFieldList formFields={formFields} setFormFields={setFormFields} />

          <AddFieldForm onAddField={handleAddField} />
        </div>

        <DialogFooter className="gap-2 pt-4 border-t border-blue-200">
          <Button 
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              if (onClose) onClose();
            }}
            className="border-blue-200 bg-blue-50 hover:bg-blue-100"
          >
            {t("close")}
          </Button>
          <Button 
            type="button" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleCreateForm}
          >
            {t("createForm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationFormDialog;
