
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
}

const InvitationFormDialog = ({ open, onOpenChange, event }: InvitationFormDialogProps) => {
  const {
    formFields,
    setFormFields,
    templates,
    isEditMode,  // Используем из хука
    setIsEditMode, // Добавляем в хук
    selectedTemplate, // Добавляем в хук
    setSelectedTemplate, // Добавляем в хук
    handleSaveTemplate,
    handleApplyTemplate
  } = useInvitationForm(event);
  //const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  //const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);

  const handleTemplateSave = (newTemplate: Template) => {
    setSelectedTemplate(newTemplate);
    setIsEditMode(false); // Переключаем в режим просмотра
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
          
          setUser(data); // обновляем user
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
                 // 👈 формируем уникальный ключ
              }));
              
              setFormFields(fieldsWithKeys);
              setSelectedTemplate({
                id: data.id,
                fields: fieldsWithKeys,
                name: "Current Template"
              });
              setIsEditMode(false);
              enterEditMode(false);
            } else {
              setIsEditMode(true);
            }
          })

          .catch(() => enterEditMode(true));
    }
  }, [event, open]);


  const handleSuccessfulSave = (newTemplate: Template) => {
    setSelectedTemplate(newTemplate);
    setIsEditMode(false);
  };

  if (!isEditMode && selectedTemplate) {
    return (
        <InvitationFormPreview
            open={open}
            onOpenChange={onOpenChange}
            event={event}
            selectedTemplate={selectedTemplate}
            onEditMode={() => setIsEditMode(true)} // Исправляем
            user={user?.id}
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
          setIsEditMode={setIsEditMode} // Передаем функцию из хука
          onSaveTemplate={(template) => {
            setSelectedTemplate(template);
            setIsEditMode(false); // Переключаем режим
          }}
          onApplyTemplate={handleApplyTemplate}
      />
  );
};

export default InvitationFormDialog;
