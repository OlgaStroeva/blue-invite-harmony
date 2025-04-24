
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField } from "@/types/form";

interface AddFieldFormProps {
  onAddField: (field: FormField) => void;
}

const AddFieldForm = ({ onAddField }: AddFieldFormProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [newField, setNewField] = useState<FormField>({
    id: "",
    name: "",
    type: "text",
    required: false
  });

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
    // Always set required to false since we removed the checkbox
    onAddField({ ...newField, id: fieldId, required: false });
    
    // Reset form
    setNewField({
      id: "",
      name: "",
      type: "text",
      required: false
    });
  };

  return (
    <div className="space-y-4 border border-blue-200 rounded-md p-4 bg-blue-100/50">
      <h4 className="font-medium text-blue-700">{t("addNewField")}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      <div className="flex justify-end">
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
  );
};

export default AddFieldForm;
