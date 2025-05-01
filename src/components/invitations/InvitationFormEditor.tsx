
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField } from "@/types/form";
import { Template } from "@/types/template";
import { Event } from "@/types/event";
import FormFieldList from "./FormFieldList";
import AddFieldForm from "./AddFieldForm";
import TemplateSelector from "./TemplateSelector";

interface InvitationFormEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  formFields: FormField[];
  setFormFields: (fields: FormField[]) => void;
  templates: Template[];
  onSaveTemplate: () => void;
  onApplyTemplate: (template: Template) => void;
}

const InvitationFormEditor = ({
  open,
  onOpenChange,
  event,
  formFields,
  setFormFields,
  templates,
  onSaveTemplate,
  onApplyTemplate
}: InvitationFormEditorProps) => {
  const { t } = useLanguage();
  
  const handleAddField = (field: FormField) => {
    setFormFields([...formFields, field]);
  };

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
            <TemplateSelector templates={templates} onApplyTemplate={onApplyTemplate} />
          </div>
          <FormFieldList formFields={formFields} setFormFields={setFormFields} />
          <AddFieldForm onAddField={handleAddField} />
        </div>

        <DialogFooter className="pt-4 border-t border-blue-200">
          <Button 
            onClick={onSaveTemplate}
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

export default InvitationFormEditor;
