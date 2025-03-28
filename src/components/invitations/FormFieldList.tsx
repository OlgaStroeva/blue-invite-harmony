
import { FormField } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface FormFieldListProps {
  formFields: FormField[];
  setFormFields: React.Dispatch<React.SetStateAction<FormField[]>>;
}

const FormFieldList = ({ formFields, setFormFields }: FormFieldListProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();

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

  return (
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
                            <option value="text">{t("text")}</option>
                            <option value="email">{t("email")}</option>
                            <option value="tel">{t("phone")}</option>
                            <option value="number">{t("number")}</option>
                            <option value="date">{t("date")}</option>
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
  );
};

export default FormFieldList;
