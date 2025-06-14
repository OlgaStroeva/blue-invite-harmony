
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetClose 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField } from "@/types/form";
import { Template } from "@/types/template";
import { useEffect } from "react";

interface TemplateSelectorProps {
  onApplyTemplate: (template: Template) => void;
}

const TemplateSelector = ({ onApplyTemplate }: TemplateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://158.160.171.159:7291/api/forms/my-templates", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then(res => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const normalized = data.map(template => ({
              ...template,
              fields: Array.isArray(template.fields)
                  ? template.fields.map(f =>
                      typeof f === "string"
                          ? { name: f, type: "text" }
                          : { name: f.name || "", type: f.type || "text" }
                  )
                  : []
            }));
            setTemplates(normalized);
          }
        })
        .catch(err => console.error("Ошибка загрузки шаблонов:", err));
  }, []);




  const handleApplyTemplate = (template: Template) => {
    onApplyTemplate(template);
    setIsOpen(false);
    
    toast({
      title: t("templateApplied"),
      description: `${t("theTemplate")} "${template.name}" ${t("hasBeenApplied")}.`,
    });
  };

  return (
    <>
      <Button 
        type="button" 
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="border-blue-300 bg-blue-100 hover:bg-blue-200 text-blue-700"
      >
        <FileText className="mr-2 h-4 w-4" />
        {t("loadTemplate")}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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

export default TemplateSelector;
