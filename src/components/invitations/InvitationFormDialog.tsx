
import { Event } from "@/types/event";
import { useInvitationForm } from "@/hooks/useInvitationForm";
import InvitationFormEditor from "./InvitationFormEditor";
import InvitationFormPreview from "./InvitationFormPreview";

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
    selectedTemplate, 
    templates, 
    isEditMode, 
    handleSaveTemplate, 
    handleApplyTemplate, 
    handleDeleteForm,
    enterEditMode
  } = useInvitationForm(event);

  if (!isEditMode && selectedTemplate) {
    return (
      <InvitationFormPreview
        open={open}
        onOpenChange={onOpenChange}
        event={event}
        selectedTemplate={selectedTemplate}
        onEditMode={enterEditMode}
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
      onSaveTemplate={handleSaveTemplate}
      onApplyTemplate={handleApplyTemplate}
    />
  );
};

export default InvitationFormDialog;
