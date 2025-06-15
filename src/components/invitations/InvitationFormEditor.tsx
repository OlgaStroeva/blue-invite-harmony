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
import {useToast} from "@/hooks/use-toast.ts";
import {useEffect, useState} from "react";

interface InvitationFormEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  formFields: FormField[];
  setFormFields: (fields: FormField[]) => void;
  templates: Template[];
  onApplyTemplate: (template: Template) => void;
  isEditMode: boolean;
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template) => void;
  onSaveTemplate: (template: Template) => void;
  setIsEditMode: (val: boolean) => void;
  canEdit: boolean;
}

const InvitationFormEditor = ({
                                open,
                                onOpenChange,
                                event,
                                formFields,
                                setFormFields,
                                templates,
                                onApplyTemplate,
                                onSaveTemplate,
                                setIsEditMode,
                                canEdit
                              }: InvitationFormEditorProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSaveTemplate = async () => {
    const eventId = event?.id;
    if (!eventId) {
      console.error("Событие не определено:", event);
      return;
    }

    const token = localStorage.getItem("token");
    let formId: number;

    try {
      // Пытаемся получить существующий шаблон
      const formRes = await fetch(`http://158.160.171.159:7291/api/forms/get-by-event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (formRes.ok) {
        const form = await formRes.json();
        formId = form.id;
      } else {
        // Если не найден — создаём новый шаблон
        const createRes = await fetch(`http://158.160.171.159:7291/api/forms/create/${eventId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        const createResult = await createRes.json();

        formId = createResult.formId ?? createResult.id;
      }
      

      try {
        const response = await fetch(`http://158.160.171.159:7291/api/forms/update-form/${formId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            fields: formFields.map(field => ({
              name: field.name,
              type: field.type
            }))
          })
        });

        const result = await response.json();

        if (response.ok) {
          const savedTemplate = {
            id: formId,
            eventId: eventId,
            fields: formFields,
            name: "Current Template"
          };

          onSaveTemplate(savedTemplate);
          setIsEditMode(false);

          toast({
            title: t("formSaved"),
            description: t("formSavedSuccessfully")
          });
        }
      } catch (error) {
        console.error("Ошибка при сохранении шаблона:", error);
        return null;
      }
    
  } catch (err) {
    console.error("Ошибка:", err);
  }
};
  
  const handleAddField = (field: FormField) => {
    if (canEdit) {
      setFormFields([...formFields, field]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto bg-blue-50 border-blue-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Mail className="h-5 w-5" /> 
            {canEdit ? t("invitationFormFor") : "View Form for"} {event.title}
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            {canEdit ? t("createCustomForm") : "View invitation form"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {canEdit && (
            <div className="flex justify-between items-center">
              <TemplateSelector onApplyTemplate={onApplyTemplate} />
            </div>
          )}
          {event && (
          <FormFieldList formFields={formFields} setFormFields={setFormFields} currentEvent={event} canEdit={canEdit}/>
          )}
          {canEdit && <AddFieldForm onAddField={handleAddField} />}
        </div>

        <DialogFooter className="pt-4 border-t border-blue-200">
          {canEdit && (
            <Button 
              onClick={handleSaveTemplate}
              className="bg-blue-600 hover:bg-blue-700 ml-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              {t("save")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationFormEditor;
