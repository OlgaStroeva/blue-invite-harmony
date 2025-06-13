
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField } from "@/types/form";
import { Template } from "@/types/template";
import { Event } from "@/types/event";

export const useInvitationForm = (event: Event) => {
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: "email", name: "Email", type: "email", required: true }
  ]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

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

  const handleApplyTemplate = (template: Template) => {
    setFormFields([...template.fields]);
    setSelectedTemplate(template);
    toast({
      title: t("templateApplied"),
      description: `${t("theTemplate")} "${template.name}" ${t("hasBeenApplied")}.`,
    });
  };

  const handleDeleteForm = () => {
    setFormFields([{ id: "email", name: "Email", type: "email", required: true }]);
    setSelectedTemplate(null);
    setIsEditMode(true);
  };

  const enterEditMode = () => {
    setIsEditMode(true);
  };

  return {
    formFields,
    setFormFields,
    templates,
    isEditMode,
    setIsEditMode,
    selectedTemplate,
    setSelectedTemplate,
    handleSaveTemplate,
    handleApplyTemplate,
    handleDeleteForm,
    enterEditMode
  };
};
