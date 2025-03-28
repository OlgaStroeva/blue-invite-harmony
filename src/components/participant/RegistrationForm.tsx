
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from "@/components/ui/form";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField as FormFieldType } from "@/types/form";

interface RegistrationFormProps {
  formFields: FormFieldType[];
  onSubmit: (data: Record<string, string | number>) => void;
}

const RegistrationForm = ({ formFields, onSubmit }: RegistrationFormProps) => {
  const { t } = useLanguage();
  
  // Use Record<string, string | number> to allow different types of form values
  const form = useForm<Record<string, string | number>>({
    defaultValues: formFields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {} as Record<string, string | number>),
  });

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-blue-700 mb-6 flex items-center">
        <Mail className="mr-2 h-5 w-5" />
        {t("registrationForm")}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {formFields.map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">
                    {t(field.name)} {field.required && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...formField}
                      type={field.type}
                      placeholder={`${t("enter")} ${t(field.name).toLowerCase()}`}
                      required={field.required}
                      className="border-blue-200 focus-visible:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("submitRegistration")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
