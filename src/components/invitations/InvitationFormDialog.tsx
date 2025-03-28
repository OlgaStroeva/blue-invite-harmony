import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Mail, Trash2, Save, FileText, GripVertical } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useLanguage } from "@/contexts/LanguageContext";

interface Event {
  id: number;
  title: string;
  category: string;
  description?: string;
  image: string;
  gradient: string;
}

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date';
  required: boolean;
  options?: string[];
}

interface Template {
  id: number;
  name: string;
  eventId: number;
  fields: FormField[];
}

const mockTemplates: Template[] = [
  {
    id: 1,
    name: "Wedding Guest Info",
    eventId: 1,
    fields: [
      { id: "email", name: "Email", type: "email", required: true },
      { id: "name", name: "Full Name", type: "text", required: true },
      { id: "dietary", name: "Dietary Restrictions", type: "text", required: false },
    ]
  },
  {
    id: 2,
    name: "Corporate RSVP",
    eventId: 2,
    fields: [
      { id: "email", name: "Email", type: "email", required: true },
      { id: "name", name: "Full Name", type: "text", required: true },
      { id: "company", name: "Company", type: "text", required: true },
      { id: "position", name: "Position", type: "text", required: false },
    ]
  }
];

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
  const [newField, setNewField] = useState<FormField>({
    id: "",
    name: "",
    type: "text",
    required: false
  });
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const fieldTypes = [
    { value: "text", label: t("text") },
    { value: "email", label: t("email") },
    { value: "tel", label: t("phone") },
    { value: "number", label: t("number") },
    { value: "date", label: t("date") }
  ];

  const handleAddField = () => {
    if (!newField.name.trim()) {
      toast({
        title: t("fieldNameRequired"),
        description: t("pleaseEnterFieldName"),
        variant: "destructive",
      });
      return;
    }

    const fieldId = newField.name.toLowerCase().replace(/\s+/g, '_');
    
    setFormFields([...formFields, { ...newField, id: fieldId }]);
    setNewField({
      id: "",
      name: "",
      type: "text",
      required: false
    });
  };

  const handleRemoveField = (index: number) => {
    if (index === 0) {
      toast({
        title: t("cannotRemoveEmail"),
        description: t("emailRequired"),
        variant: "destructive",
      });
      return;
    }
    
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
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
    setIsTemplateSheetOpen(false);
    
    toast({
      title: t("templateApplied"),
      description: `${t("theTemplate")} "${template.name}" ${t("hasBeenApplied")}.`,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    // Don't allow moving the email field (index 0)
    if (result.source.index === 0 || result.destination.index === 0) {
      toast({
        title: t("cannotMoveEmail"),
        description: t("emailMustBeFirst"),
        variant: "destructive",
      });
      return;
    }

    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormFields(items);
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
    }
    
    onOpenChange(false);
    if (onClose) onClose();
    
    navigate(`/participant-form/${event.id}`);
  };

  return (
    <>
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
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsTemplateSheetOpen(true)}
                  className="border-blue-300 bg-blue-100 hover:bg-blue-200 text-blue-700"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t("loadTemplate")}
                </Button>
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

            {/* Fields List with Drag and Drop */}
            <div className="space-y-4 border border-blue-200 rounded-md p-4 bg-blue-100/50">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="formFields">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {formFields.map((field, index) => (
                        <Draggable
                          key={`${field.id}-${index}`}
                          draggableId={`${field.id}-${index}`}
                          index={index}
                          isDragDisabled={index === 0} // Email field can't be moved
                        >
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-start gap-4 p-3 bg-white rounded-md border ${
                                snapshot.isDragging ? 'border-blue-400 shadow-md' : 'border-blue-200'
                              }`}
                            >
                              <div 
                                {...provided.dragHandleProps}
                                className={`flex items-center h-full py-2 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'text-blue-500 cursor-grab'}`}
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                              <div className="flex-1 grid grid-cols-3 gap-2">
                                <div>
                                  <Label className="text-sm text-blue-700">{t("fieldName")}</Label>
                                  <Input 
                                    value={field.name}
                                    onChange={(e) => {
                                      const updatedFields = [...formFields];
                                      updatedFields[index].name = e.target.value;
                                      setFormFields(updatedFields);
                                    }}
                                    readOnly={index === 0}
                                    className={`border-blue-200 ${index === 0 ? 'bg-blue-50 cursor-not-allowed' : 'bg-white'}`}
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm text-blue-700">{t("type")}</Label>
                                  <select
                                    value={field.type}
                                    onChange={(e) => {
                                      const updatedFields = [...formFields];
                                      updatedFields[index].type = e.target.value as 'text' | 'email' | 'tel' | 'number' | 'date';
                                      setFormFields(updatedFields);
                                    }}
                                    disabled={index === 0}
                                    className={`w-full rounded-md border border-blue-200 px-3 py-2 text-sm ${
                                      index === 0 
                                        ? 'bg-blue-50 cursor-not-allowed' 
                                        : 'bg-white focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                                    }`}
                                  >
                                    {fieldTypes.map((type) => (
                                      <option key={type.value} value={type.value}>
                                        {type.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex items-end gap-2">
                                  <div className="flex items-center h-10 gap-2">
                                    <input
                                      type="checkbox"
                                      id={`required-${index}`}
                                      checked={field.required}
                                      onChange={(e) => {
                                        const updatedFields = [...formFields];
                                        updatedFields[index].required = e.target.checked;
                                        setFormFields(updatedFields);
                                      }}
                                      disabled={index === 0}
                                      className="rounded border-blue-300"
                                    />
                                    <Label htmlFor={`required-${index}`} className="text-sm text-blue-700">
                                      {t("required")}
                                    </Label>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemoveField(index)}
                                    disabled={index === 0}
                                    className={index === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Add New Field */}
            <div className="space-y-4 border border-blue-200 rounded-md p-4 bg-blue-100/50">
              <h4 className="font-medium text-blue-700">{t("addNewField")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="newFieldName" className="text-sm text-blue-700">{t("fieldName")}</Label>
                  <Input
                    id="newFieldName"
                    value={newField.name}
                    onChange={(e) => setNewField({...newField, name: e.target.value})}
                    placeholder={t("fieldNamePlaceholder")}
                    className="border-blue-200"
                  />
                </div>
                <div>
                  <Label htmlFor="newFieldType" className="text-sm text-blue-700">{t("type")}</Label>
                  <select
                    id="newFieldType"
                    value={newField.type}
                    onChange={(e) => setNewField({...newField, type: e.target.value as 'text' | 'email' | 'tel' | 'number' | 'date'})}
                    className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm bg-white focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex items-center h-10 gap-2">
                    <input
                      type="checkbox"
                      id="newFieldRequired"
                      checked={newField.required}
                      onChange={(e) => setNewField({...newField, required: e.target.checked})}
                      className="rounded border-blue-300"
                    />
                    <Label htmlFor="newFieldRequired" className="text-sm text-blue-700">
                      {t("required")}
                    </Label>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddField}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    {t("addField")}
                  </Button>
                </div>
              </div>
            </div>
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

      {/* Template Selection Sheet */}
      <Sheet open={isTemplateSheetOpen} onOpenChange={setIsTemplateSheetOpen}>
        <SheetContent className="sm:max-w-md bg-blue-50 border-blue-200">
          <SheetHeader>
            <SheetTitle className="text-blue-700">{t("selectTemplate")}</SheetTitle>
            <SheetDescription className="text-blue-600">
              {t("chooseTemplate")}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {templates.length === 0 ? (
              <div className="text-center p-4 bg-blue-100/50 rounded-md">
                <p className="text-blue-700">{t("noTemplatesAvailable")}</p>
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border border-blue-200 rounded-md bg-white hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => handleApplyTemplate(template)}
                >
                  <h4 className="font-medium text-blue-700 mb-1">{template.name}</h4>
                  <p className="text-sm text-blue-600">
                    {template.fields.length} {t("fieldsIncluding")}{" "}
                    {template.fields
                      .slice(0, 2)
                      .map((f) => f.name)
                      .join(", ")}
                    {template.fields.length > 2 && "..."}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="absolute bottom-6 right-6">
            <SheetClose asChild>
              <Button variant="outline" className="border-blue-200 bg-blue-50 hover:bg-blue-100">
                {t("cancel")}
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default InvitationFormDialog;
