
import { FormField } from "@/types/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Edit, Check } from "lucide-react";

interface FormFieldListProps {
  formFields: FormField[];
  setFormFields?: (fields: FormField[]) => void;
  readOnly?: boolean;
}

const FormFieldList = ({ formFields, setFormFields, readOnly = false }: FormFieldListProps) => {
  const { t } = useLanguage();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = Number(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === targetIndex) return;

    const newFields = [...formFields];
    const [draggedField] = newFields.splice(sourceIndex, 1);
    newFields.splice(targetIndex, 0, draggedField);

    setFormFields?.(newFields);
    setDraggedIndex(null);
  };

  const startEditing = (index: number) => {
    setEditingFieldIndex(index);
    setEditedName(formFields[index].name);
  };

  const saveFieldName = () => {
    if (editingFieldIndex === null) return;
    
    // Only update if there's actually a name entered
    if (editedName.trim()) {
      const updatedFields = [...formFields];
      updatedFields[editingFieldIndex] = {
        ...updatedFields[editingFieldIndex],
        name: editedName
      };
      setFormFields?.(updatedFields);
    }
    
    setEditingFieldIndex(null);
  };

  return (
    <div className="space-y-4">
      {formFields.map((field, index) => (
        <div
          key={field.id}
          className={`p-4 bg-white rounded-lg border ${
            readOnly ? 'border-blue-100' : 'border-blue-200 cursor-move'
          } ${draggedIndex === index ? 'opacity-50' : ''}`}
          draggable={!readOnly}
          onDragStart={!readOnly ? (e) => handleDragStart(e, index) : undefined}
          onDragOver={!readOnly ? handleDragOver : undefined}
          onDrop={!readOnly ? (e) => handleDrop(e, index) : undefined}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {!readOnly && editingFieldIndex === index ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="border-blue-200"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveFieldName()}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={saveFieldName}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-blue-700">{field.name}</h4>
                  {!readOnly && setFormFields && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="p-1 h-auto text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => startEditing(index)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              )}
              <p className="text-sm text-blue-600">
                {t("type")}: {field.type}
              </p>
            </div>
            {!readOnly && setFormFields && (
              <Button
                type="button"
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  const newFields = formFields.filter((_, i) => i !== index);
                  setFormFields(newFields);
                }}
              >
                {t("remove")}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormFieldList;
