
import { Event } from "@/types/event";
import { useInvitationForm } from "@/hooks/useInvitationForm";
import InvitationFormEditor from "./InvitationFormEditor";
import InvitationFormPreview from "./InvitationFormPreview";
import {useEffect, useState} from "react";

interface InvitationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  onClose?: () => void;
  canEdit: boolean;
}

const InvitationFormDialog = ({ open, onOpenChange, event, canEdit }: InvitationFormDialogProps) => {
  const {
    formFields,
    setFormFields,
    templates,
    isEditMode,
    setIsEditMode,
    selectedTemplate,
    setSelectedTemplate,
    handleSaveTemplate,
    handleApplyTemplate
  } = useInvitationForm(event);
  
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);

  const handleTemplateSave = (newTemplate: Template) => {
    setSelectedTemplate(newTemplate);
    setIsEditMode(false);
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://localhost:7291/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
        .then((res) => {
          if (!res.ok) throw new Error("Пользователь не аутентифицирован");
          return res.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.error("Ошибка при получении пользователя:", err);
        });
  }, []);

  useEffect(() => {
    if (event && open) {
      const token = localStorage.getItem("token");

      fetch(`https://localhost:7291/api/forms/get-by-event/${event.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.fields?.length > 0) {
              const fieldsWithKeys = data.fields.map((f, i) => ({
                id: `${i}`,
                ...f
              }));
              
              setFormFields(fieldsWithKeys);
              setSelectedTemplate({
                id: data.id,
                fields: fieldsWithKeys,
                name: "Current Template"
              });
              setIsEditMode(false);
            } else if (canEdit) {
              setIsEditMode(true);
            }
          })
          .catch(() => canEdit && setIsEditMode(true));
    }
  }, [event, open, canEdit]);

  const handleSuccessfulSave = (newTemplate: Template) => {
    setSelectedTemplate(newTemplate);
    setIsEditMode(false);
  };

  if ((!isEditMode && selectedTemplate) || !canEdit) {
    return (
        <InvitationFormPreview
            open={open}
            onOpenChange={onOpenChange}
            event={event}
            selectedTemplate={selectedTemplate}
            onEditMode={() => canEdit && setIsEditMode(true)}
            user={user?.id}
            canEdit={canEdit}
        />
    );
  }

  return (
      <InvitationFormEditor
          open={open}
          onOpenChange={onOpenChange}
          event={event}
          formFields={formFields}
          setFormFields={setFormFields}
          templates={templates}
          setIsEditMode={setIsEditMode}
          onSaveTemplate={(template) => {
            setSelectedTemplate(template);
            setIsEditMode(false);
          }}
          onApplyTemplate={handleApplyTemplate}
          canEdit={canEdit}
      />
  );
};

export default InvitationFormDialog;
